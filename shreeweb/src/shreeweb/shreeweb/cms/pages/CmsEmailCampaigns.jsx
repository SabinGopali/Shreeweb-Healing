import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsEmailCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [totalRecipients, setTotalRecipients] = useState(0);
  const [sendingCampaigns, setSendingCampaigns] = useState(new Set());
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const openModal = ({ title, message, type = 'info' }) => {
    setModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    fetchCampaigns();
  }, [page]);

  useEffect(() => {
    fetchRecipients();
  }, []);

  // Poll for sending campaigns
  useEffect(() => {
    if (sendingCampaigns.size === 0) return;

    const interval = setInterval(() => {
      fetchCampaigns();
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [sendingCampaigns]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      const response = await fetch(`/backend/email-campaigns?${params.toString()}`, {
        credentials: 'include'
      });

      console.log('Campaign fetch response status:', response.status);

      if (response.status === 401 || response.status === 403) {
        // Not authenticated, redirect to login
        navigate('/shreeweb/cms/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Campaign fetch error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch campaigns');
      }

      const data = await response.json();
      console.log('Campaign data:', data);

      if (data.success) {
        setCampaigns(data.data || []);
        setPagination(data.pagination || { total: 0, pages: 1 });
        
        // Track sending campaigns
        const sending = new Set();
        (data.data || []).forEach(campaign => {
          if (campaign.status === 'sending') {
            sending.add(campaign._id);
          }
        });
        setSendingCampaigns(sending);
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      const params = new URLSearchParams({
        subscribed: 'true',
        limit: '1'
      });

      const response = await fetch(`/backend/email-captures?${params.toString()}`, {
        credentials: 'include'
      });

      console.log('Recipients fetch response status:', response.status);

      if (!response.ok) {
        console.error('Failed to fetch recipients count');
        return;
      }

      const data = await response.json();
      console.log('Recipients data:', data);

      if (data.success && data.pagination) {
        console.log('Setting total recipients to:', data.pagination.total);
        setTotalRecipients(data.pagination.total);
      } else {
        console.log('No pagination data found in response');
      }
    } catch (err) {
      console.error('Error fetching recipients:', err);
    }
  };

  const handleCreateCampaign = () => {
    navigate('/shreeweb/cms/email-campaigns/create');
  };

  const handleEditCampaign = (campaign) => {
    navigate(`/shreeweb/cms/email-campaigns/edit/${campaign._id}`);
  };

  const handleDeleteCampaign = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`/backend/email-campaigns/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete campaign');

      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const handleSendCampaign = async (id) => {
    if (!confirm('Are you sure you want to send this campaign? This action cannot be undone.')) return;

    let sendStatus = null;
    let sendErrorMessage = '';

    try {
      const url = `/backend/email-campaigns/${id}/send`;
      console.log('[SEND DEBUG] Full URL:', `${location.origin}${url}`);
      console.log('[SEND DEBUG] Is production:', location.hostname !== 'localhost' && !location.hostname.includes('127.'));
      console.log('[SEND DEBUG] User agent:', navigator.userAgent);
      console.log('Sending campaign:', id);
      
      // Add to sending campaigns immediately for UI feedback
      setSendingCampaigns(prev => new Set([...prev, id]));
      
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      sendStatus = response.status;

      console.log('Send response status:', response.status);
      console.log('Send response headers:', Object.fromEntries([...response.headers.entries()]));

      if (!response.ok) {
        // Log full response body as text first (clone for multiple reads)
        const errorClone = response.clone();
        const errorText = await errorClone.text();
        console.error('[SEND ERROR FULL TEXT]:', errorText);
        
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('JSON parse failed:', e);
        }
        
        console.error('Send error data:', errorData);
        console.error('Send error status:', response.status);
        sendErrorMessage = errorData.message || '';
        
        setSendingCampaigns(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to send campaign`);
      }

      const data = await response.json();
      console.log('Send response:', data);
      
      if (data.success) {
        openModal({
          type: 'success',
          title: 'Campaign Sending Started',
          message: `Campaign is being sent to ${data.data.recipientCount} recipients. The status will update automatically.`
        });
        fetchCampaigns();
      } else {
        setSendingCampaigns(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        throw new Error(data.message || 'Failed to send campaign');
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      const friendlyMessage = sendErrorMessage || error.message || 'Unknown error';
      openModal({
        type: 'error',
        title: `Send Failed (${sendStatus || 'unknown'})`,
        message: `${friendlyMessage}\n\nCheck browser console for details (F12 -> Console/Network).`
      });
    }
  };

  const handleFixRecipients = async (id) => {
    try {
      const response = await fetch(`/backend/email-campaigns/${id}/fix-recipients`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fix recipients');

      const data = await response.json();
      if (data.success) {
        openModal({
          type: 'success',
          title: 'Recipients Updated',
          message: `Recipients updated: ${data.data.oldCount} -> ${data.data.newCount}`
        });
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error fixing recipients:', error);
      openModal({
        type: 'error',
        title: 'Fix Failed',
        message: 'Failed to fix recipients'
      });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-700',
      scheduled: 'bg-blue-100 text-blue-700',
      sending: 'bg-yellow-100 text-yellow-700 animate-pulse',
      sent: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };

    const icons = {
      draft: '📝',
      scheduled: '📅',
      sending: '⏳',
      sent: '✅',
      failed: '❌'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${badges[status] || badges.draft}`}>
        <span>{icons[status] || icons.draft}</span>
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </span>
    );
  };

  return (
    <div className={cmsTheme.pageWrap}>
      {/* Header */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-serif text-stone-800">Email Campaigns</h1>
            <p className="text-sm text-stone-600 mt-1">Create and manage email marketing campaigns</p>
          </div>
          <button onClick={handleCreateCampaign} className={cmsTheme.btnPrimary}>
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-stone-600">Total Campaigns</p>
            <p className="text-2xl font-serif text-stone-800">{pagination.total}</p>
          </div>
          <div>
            <p className="text-sm text-stone-600">Total Recipients</p>
            <p className="text-2xl font-serif text-stone-800">{totalRecipients}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-stone-600">Current Page</p>
            <p className="text-2xl font-serif text-stone-800">{page} / {pagination.pages}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Campaigns List */}
      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-100/80 text-xs font-semibold uppercase tracking-wider text-stone-600">
              <tr>
                <th className="px-4 py-3">Campaign Name</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Recipients</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Opens</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-stone-500">
                    Loading campaigns...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-stone-500">
                    No campaigns yet. Create your first email campaign to get started.
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign._id} className="border-b border-stone-100 hover:bg-white/80">
                    <td className="px-4 py-3 font-medium text-stone-900">{campaign.name}</td>
                    <td className="px-4 py-3 text-stone-600">{campaign.subject}</td>
                    <td className="px-4 py-3">{getStatusBadge(campaign.status)}</td>
                    <td className="px-4 py-3 text-stone-600">{campaign.recipients.totalCount}</td>
                    <td className="px-4 py-3">
                      {campaign.status === 'sending' ? (
                        <div className="space-y-1">
                          <div className="text-xs text-yellow-600 font-medium">
                            {campaign.recipients.sentCount} / {campaign.recipients.totalCount}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-yellow-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${campaign.recipients.totalCount > 0 
                                  ? (campaign.recipients.sentCount / campaign.recipients.totalCount * 100) 
                                  : 0}%` 
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-stone-600">
                          {campaign.recipients.sentCount} / {campaign.recipients.totalCount}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {campaign.analytics.uniqueOpens.length}
                    </td>
                    <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <>
                            <button
                              onClick={() => handleEditCampaign(campaign)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Edit
                            </button>
                            {campaign.recipients.totalCount === 0 && (
                              <button
                                onClick={() => handleFixRecipients(campaign._id)}
                                className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                                title="Recalculate recipient count"
                              >
                                Fix
                              </button>
                            )}
                            <button
                              onClick={() => handleSendCampaign(campaign._id)}
                              className="text-xs text-green-600 hover:text-green-800 font-medium"
                            >
                              Send
                            </button>
                          </>
                        )}
                        {campaign.status === 'sending' && (
                          <span className="text-xs text-yellow-600 font-medium">Sending...</span>
                        )}
                        {campaign.status === 'sent' && (
                          <>
                            <button
                              onClick={() => navigate(`/shreeweb/cms/email-campaigns/view/${campaign._id}`)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View
                            </button>
                            {campaign.recipients?.sentCount === 0 && (
                              <button
                                onClick={() => handleSendCampaign(campaign._id)}
                                className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                                title="Resend campaign because previous send delivered 0 emails"
                              >
                                Resend
                              </button>
                            )}
                          </>
                        )}
                        {campaign.status === 'failed' && (
                          <button
                            onClick={() => handleEditCampaign(campaign)}
                            className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                          >
                            Retry
                          </button>
                        )}
                        {campaign.status !== 'sending' && (
                          <button
                            onClick={() => handleDeleteCampaign(campaign._id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`${cmsTheme.btnGhost} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Previous
            </button>
            <span className="text-sm text-stone-600">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className={`${cmsTheme.btnGhost} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white shadow-xl">
            <div className="border-b border-stone-100 px-5 py-4">
              <h3 className="text-base font-semibold text-stone-900">
                {modal.type === 'success' ? '✅ ' : modal.type === 'error' ? '❌ ' : 'ℹ️ '}
                {modal.title}
              </h3>
            </div>
            <div className="px-5 py-4">
              <p className="whitespace-pre-line text-sm text-stone-700">{modal.message}</p>
            </div>
            <div className="flex justify-end border-t border-stone-100 px-5 py-3">
              <button onClick={closeModal} className={cmsTheme.btnPrimary}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

