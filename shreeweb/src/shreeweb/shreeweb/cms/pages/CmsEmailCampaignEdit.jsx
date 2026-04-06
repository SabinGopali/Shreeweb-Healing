import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsEmailCampaignEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    filterSource: 'all',
    filterTags: '',
    subscribedOnly: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [recipientCount, setRecipientCount] = useState(0);
  const [testEmail, setTestEmail] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [testSuccess, setTestSuccess] = useState('');
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  useEffect(() => {
    if (formData.name) {
      fetchRecipientCount();
    }
  }, [formData.filterSource, formData.filterTags, formData.subscribedOnly]);

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
        const camp = data.data;
        setCampaign(camp);
        
        setFormData({
          name: camp.name || '',
          subject: camp.subject || '',
          htmlContent: camp.htmlContent || '',
          textContent: camp.textContent || '',
          filterSource: camp.recipients?.filterBy?.source || 'all',
          filterTags: camp.recipients?.filterBy?.tags?.join(', ') || '',
          subscribedOnly: camp.recipients?.filterBy?.subscribedOnly !== false
        });
      }
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError(err.message || 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipientCount = async () => {
    try {
      const params = new URLSearchParams();
      if (formData.subscribedOnly) params.append('subscribed', 'true');
      if (formData.filterSource !== 'all') params.append('source', formData.filterSource);

      const response = await fetch(`/backend/email-captures?${params.toString()}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setRecipientCount(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching recipient count:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/backend/email-campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          subject: formData.subject,
          htmlContent: formData.htmlContent,
          textContent: formData.textContent,
          recipients: {
            filterBy: {
              source: formData.filterSource,
              tags: formData.filterTags ? formData.filterTags.split(',').map(t => t.trim()) : [],
              subscribedOnly: formData.subscribedOnly
            }
          }
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update campaign');
      }

      navigate('/shreeweb/cms/email-campaigns');
    } catch (err) {
      console.error('Error updating campaign:', err);
      setError(err.message || 'Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setTestSending(true);
    setTestSuccess('');
    setError('');

    try {
      const response = await fetch('/backend/email-campaigns/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          campaignId: id,
          testEmail,
          subject: formData.subject,
          htmlContent: formData.htmlContent,
          textContent: formData.textContent
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send test email');
      }

      setTestSuccess('Test email sent successfully!');
      setTimeout(() => setTestSuccess(''), 5000);
    } catch (err) {
      console.error('Error sending test email:', err);
      setError(err.message || 'Failed to send test email');
    } finally {
      setTestSending(false);
    }
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

  if (!campaign) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <p className="text-center text-red-600">Campaign not found</p>
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

  if (campaign.status !== 'draft') {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <p className="text-center text-amber-600">This campaign cannot be edited because it has already been sent or is currently sending.</p>
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

  return (
    <div className={cmsTheme.pageWrap}>
      {/* Header */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-stone-800">Edit Email Campaign</h1>
            <p className="text-sm text-stone-600 mt-1">Update your campaign details</p>
          </div>
          <button
            onClick={() => navigate('/shreeweb/cms/email-campaigns')}
            className={cmsTheme.btnGhost}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Success Message */}
      {testSuccess && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {testSuccess}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campaign Details */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <h2 className="text-lg font-serif text-stone-800 mb-4">Campaign Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Campaign Name *</label>
              <input
                type="text"
                className={cmsTheme.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Welcome Series - Week 1"
                required
              />
              <p className="text-xs text-stone-500 mt-1">Internal name for your reference</p>
            </div>

            <div>
              <label className={cmsTheme.label}>Email Subject *</label>
              <input
                type="text"
                className={cmsTheme.input}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Welcome to Our Community!"
                required
              />
              <p className="text-xs text-stone-500 mt-1">This will appear in recipients' inboxes</p>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <h2 className="text-lg font-serif text-stone-800 mb-4">Email Content</h2>
          
          <div className="space-y-4">
            <div>
              <label className={cmsTheme.label}>HTML Content *</label>
              <textarea
                className={cmsTheme.textarea}
                rows={15}
                value={formData.htmlContent}
                onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                placeholder="Enter your HTML email content here..."
                required
              />
              <div className="mt-2 p-3 bg-stone-50 rounded-lg">
                <p className="text-xs text-stone-600 font-medium mb-1">Available Variables:</p>
                <div className="flex flex-wrap gap-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border border-stone-200">{'{{name}}'}</code>
                  <code className="text-xs bg-white px-2 py-1 rounded border border-stone-200">{'{{email}}'}</code>
                  <code className="text-xs bg-white px-2 py-1 rounded border border-stone-200">{'{{unsubscribe_link}}'}</code>
                </div>
              </div>
            </div>

            <div>
              <label className={cmsTheme.label}>Plain Text Content (Optional)</label>
              <textarea
                className={cmsTheme.textarea}
                rows={8}
                value={formData.textContent}
                onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                placeholder="Plain text version for email clients that don't support HTML"
              />
              <p className="text-xs text-stone-500 mt-1">If left empty, will be auto-generated from HTML</p>
            </div>
          </div>
        </div>

        {/* Recipients */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <h2 className="text-lg font-serif text-stone-800 mb-4">Recipients</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={cmsTheme.label}>Source</label>
                <select
                  className={cmsTheme.input}
                  value={formData.filterSource}
                  onChange={(e) => setFormData({ ...formData, filterSource: e.target.value })}
                >
                  <option value="all">All Sources</option>
                  <option value="shreeweb">Shreeweb</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="contact_form">Contact Form</option>
                </select>
              </div>

              <div>
                <label className={cmsTheme.label}>Tags (comma-separated)</label>
                <input
                  type="text"
                  className={cmsTheme.input}
                  value={formData.filterTags}
                  onChange={(e) => setFormData({ ...formData, filterTags: e.target.value })}
                  placeholder="e.g., vip, interested"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.subscribedOnly}
                  onChange={(e) => setFormData({ ...formData, subscribedOnly: e.target.checked })}
                  className="rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">Only send to subscribed users</span>
              </label>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>Estimated Recipients:</strong> {recipientCount} {recipientCount === 1 ? 'subscriber' : 'subscribers'}
              </p>
            </div>
          </div>
        </div>

        {/* Test Email */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <h2 className="text-lg font-serif text-stone-800 mb-4">Send Test Email</h2>
          
          <div className="flex gap-3">
            <input
              type="email"
              className={cmsTheme.input}
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your-email@example.com"
            />
            <button
              type="button"
              onClick={handleSendTest}
              disabled={testSending}
              className={cmsTheme.btnGhost}
            >
              {testSending ? 'Sending...' : 'Send Test'}
            </button>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Send a test email to yourself to preview the campaign
          </p>
        </div>

        {/* Actions */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate('/shreeweb/cms/email-campaigns')}
              className={cmsTheme.btnGhost}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
