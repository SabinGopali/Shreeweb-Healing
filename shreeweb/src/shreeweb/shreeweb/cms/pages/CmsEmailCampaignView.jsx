import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsEmailCampaignView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/backend/email-campaigns/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }

      const data = await response.json();
      
      if (data.success) {
        setCampaign(data.data);
      }
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError(err.message || 'Failed to load campaign');
    } finally {
      setLoading(false);
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
      <span className={`inline-block px-3 py-1 text-sm rounded-full ${badges[status] || badges.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <p className="text-center text-stone-500">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <p className="text-center text-red-600">{error || 'Campaign not found'}</p>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/shreeweb/cms/email-campaigns')}
              className={cmsTheme.btnPrimary}
            >
              Back to Campaigns
            </button>
          </div>
        </div>
      </div>
    );
  }

  const openRate = campaign.recipients.sentCount > 0 
    ? ((campaign.analytics.uniqueOpens.length / campaign.recipients.sentCount) * 100).toFixed(1)
    : 0;

  const clickRate = campaign.recipients.sentCount > 0
    ? ((campaign.analytics.uniqueClicks.length / campaign.recipients.sentCount) * 100).toFixed(1)
    : 0;

  return (
    <div className={cmsTheme.pageWrap}>
      {/* Header */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-stone-800">{campaign.name}</h1>
            <p className="text-sm text-stone-600 mt-1">Campaign Details & Analytics</p>
          </div>
          <button
            onClick={() => navigate('/shreeweb/cms/email-campaigns')}
            className={cmsTheme.btnGhost}
          >
            Back to Campaigns
          </button>
        </div>
      </div>

      {/* Campaign Info */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className="text-lg font-serif text-stone-800 mb-4">Campaign Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-stone-600">Status</p>
            <div className="mt-1">{getStatusBadge(campaign.status)}</div>
          </div>
          
          <div>
            <p className="text-sm text-stone-600">Created</p>
            <p className="text-base text-stone-800 mt-1">
              {new Date(campaign.createdAt).toLocaleString()}
            </p>
          </div>

          {campaign.sentAt && (
            <div>
              <p className="text-sm text-stone-600">Sent</p>
              <p className="text-base text-stone-800 mt-1">
                {new Date(campaign.sentAt).toLocaleString()}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-stone-600">Subject Line</p>
            <p className="text-base text-stone-800 mt-1">{campaign.subject}</p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className="text-lg font-serif text-stone-800 mb-4">Campaign Analytics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-stone-50 p-4 rounded-lg">
            <p className="text-sm text-stone-600">Total Recipients</p>
            <p className="text-3xl font-serif text-stone-800 mt-2">{campaign.recipients.totalCount}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">Successfully Sent</p>
            <p className="text-3xl font-serif text-green-800 mt-2">{campaign.recipients.sentCount}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">Unique Opens</p>
            <p className="text-3xl font-serif text-blue-800 mt-2">{campaign.analytics.uniqueOpens.length}</p>
            <p className="text-xs text-blue-600 mt-1">{openRate}% open rate</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-700">Unique Clicks</p>
            <p className="text-3xl font-serif text-purple-800 mt-2">{campaign.analytics.uniqueClicks.length}</p>
            <p className="text-xs text-purple-600 mt-1">{clickRate}% click rate</p>
          </div>
        </div>

        {campaign.recipients.failedCount > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Failed Deliveries:</strong> {campaign.recipients.failedCount}
            </p>
          </div>
        )}
      </div>

      {/* Email Content Preview */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className="text-lg font-serif text-stone-800 mb-4">Email Content</h2>
        
        <div className="border border-stone-200 rounded-lg p-6 bg-white">
          <div className="mb-4 pb-4 border-b border-stone-200">
            <p className="text-sm text-stone-600">Subject:</p>
            <p className="text-lg font-medium text-stone-800 mt-1">{campaign.subject}</p>
          </div>
          
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: campaign.htmlContent }}
          />
        </div>
      </div>

      {/* Recipient Filters */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className="text-lg font-serif text-stone-800 mb-4">Recipient Filters</h2>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-600">Source:</span>
            <span className="text-sm font-medium text-stone-800">
              {campaign.recipients.filterBy.source === 'all' ? 'All Sources' : campaign.recipients.filterBy.source}
            </span>
          </div>
          
          {campaign.recipients.filterBy.tags && campaign.recipients.filterBy.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {campaign.recipients.filterBy.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-stone-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-600">Subscription Filter:</span>
            <span className="text-sm font-medium text-stone-800">
              {campaign.recipients.filterBy.subscribedOnly ? 'Subscribed users only' : 'All users'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
