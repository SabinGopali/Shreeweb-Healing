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

  useEffect(() => {
    fetchCampaigns();
  }, [page]);

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

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const data = await response.json();

      if (data.success) {
        setCampaigns(data.data || []);
        setPagination(data.pagination || { total: 0, pages: 1 });
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
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

    try {
      const response = await fetch(`/backend/email-campaigns/${id}/send`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to send campaign');

      const data = await response.json();
      alert(`Campaign is being sent to ${data.data.recipientCount} recipients`);
      fetchCampaigns();
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send campaign');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-700',
      scheduled: 'bg-blue-100 text-blue-700',
      sending: 'bg-yellow-100 text-yellow-700',
      sent: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };

    return (
      <span className={`inline-block px-2 py-1 text-xs rounded-full ${badges[status] || badges.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-600">Total Campaigns</p>
            <p className="text-2xl font-serif text-stone-800">{pagination.total}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone-600">Page {page} of {pagination.pages}</p>
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
                    <td className="px-4 py-3 text-stone-600">
                      {campaign.recipients.sentCount} / {campaign.recipients.totalCount}
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
                            <button
                              onClick={() => handleSendCampaign(campaign._id)}
                              className="text-xs text-green-600 hover:text-green-800 font-medium"
                            >
                              Send
                            </button>
                          </>
                        )}
                        {campaign.status === 'sent' && (
                          <button
                            onClick={() => navigate(`/shreeweb/cms/email-campaigns/view/${campaign._id}`)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCampaign(campaign._id)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
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
    </div>
  );
}
