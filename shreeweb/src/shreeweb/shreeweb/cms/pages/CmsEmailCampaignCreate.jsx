import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';

// Build HTML from structured fields
function buildEmailHtml(fields) {
  let html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #292524; line-height: 1.6;">';
  
  // Greeting
  if (fields.greeting) {
    html += `<h1 style="margin: 0 0 20px 0; font-size: 28px; color: #1c1917;">${fields.greeting}</h1>`;
  }
  
  // Opening paragraph
  if (fields.opening) {
    html += `<p style="margin: 0 0 16px 0; color: #44403c;">${fields.opening}</p>`;
  }
  
  // Main content
  if (fields.mainContent) {
    const paragraphs = fields.mainContent.split('\n\n').filter(p => p.trim());
    paragraphs.forEach(para => {
      html += `<p style="margin: 0 0 16px 0; color: #44403c;">${para.trim().replace(/\n/g, '<br/>')}</p>`;
    });
  }
  
  // Bullet points
  if (fields.bulletPoints && fields.bulletPoints.length > 0) {
    const validPoints = fields.bulletPoints.filter(p => p.trim());
    if (validPoints.length > 0) {
      html += '<ul style="margin: 0 0 20px 0; padding-left: 20px; color: #44403c;">';
      validPoints.forEach(point => {
        html += `<li style="margin-bottom: 8px;">${point.trim()}</li>`;
      });
      html += '</ul>';
    }
  }
  
  // Call to action
  if (fields.callToAction) {
    html += `<p style="margin: 0 0 20px 0; color: #44403c;"><strong>${fields.callToAction}</strong></p>`;
  }
  
  // Closing
  if (fields.closing) {
    html += `<p style="margin: 20px 0 0 0; color: #44403c;">${fields.closing.replace(/\n/g, '<br/>')}</p>`;
  }
  
  // Signature
  if (fields.signature) {
    html += `<p style="margin: 8px 0 0 0; color: #44403c;"><strong>${fields.signature}</strong></p>`;
  }
  
  html += '</div>';
  return html;
}

// Build plain text from structured fields
function buildPlainText(fields) {
  let text = '';
  
  if (fields.greeting) text += fields.greeting + '\n\n';
  if (fields.opening) text += fields.opening + '\n\n';
  if (fields.mainContent) text += fields.mainContent + '\n\n';
  
  if (fields.bulletPoints && fields.bulletPoints.length > 0) {
    const validPoints = fields.bulletPoints.filter(p => p.trim());
    if (validPoints.length > 0) {
      validPoints.forEach(point => {
        text += '• ' + point.trim() + '\n';
      });
      text += '\n';
    }
  }
  
  if (fields.callToAction) text += fields.callToAction + '\n\n';
  if (fields.closing) text += fields.closing + '\n';
  if (fields.signature) text += fields.signature;
  
  return text.trim();
}

export default function CmsEmailCampaignCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    greeting: '',
    opening: '',
    mainContent: '',
    bulletPoints: ['', '', ''],
    callToAction: '',
    closing: '',
    signature: '',
    filterSource: 'all',
    filterTags: '',
    subscribedOnly: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recipientCount, setRecipientCount] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    fetchRecipientCount();
  }, [formData.filterSource, formData.filterTags, formData.subscribedOnly]);

  const fetchRecipientCount = async () => {
    try {
      const params = new URLSearchParams();
      if (formData.subscribedOnly) params.append('subscribed', 'true');
      if (formData.filterSource !== 'all') params.append('source', formData.filterSource);
      
      if (formData.filterTags) {
        const tags = formData.filterTags.split(',').map(t => t.trim()).filter(t => t);
        if (tags.length > 0) {
          params.append('limit', '1000');
        }
      }

      const response = await fetch(`/backend/email-captures?${params.toString()}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        
        if (formData.filterTags) {
          const tags = formData.filterTags.split(',').map(t => t.trim()).filter(t => t);
          if (tags.length > 0 && data.data) {
            const filtered = data.data.filter(subscriber => 
              subscriber.tags && subscriber.tags.some(tag => tags.includes(tag))
            );
            setRecipientCount(filtered.length);
          } else {
            setRecipientCount(data.pagination?.total || 0);
          }
        } else {
          setRecipientCount(data.pagination?.total || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching recipient count:', error);
    }
  };

  const updateBulletPoint = (index, value) => {
    const newPoints = [...formData.bulletPoints];
    newPoints[index] = value;
    setFormData({ ...formData, bulletPoints: newPoints });
  };

  const addBulletPoint = () => {
    setFormData({ ...formData, bulletPoints: [...formData.bulletPoints, ''] });
  };

  const removeBulletPoint = (index) => {
    const newPoints = formData.bulletPoints.filter((_, i) => i !== index);
    setFormData({ ...formData, bulletPoints: newPoints });
  };

  const loadTemplate = () => {
    if (formData.greeting || formData.opening || formData.mainContent) {
      if (!window.confirm('Replace current content with template?')) return;
    }
    
    setFormData({
      ...formData,
      greeting: 'Hello {{name}},',
      opening: 'Thank you for being part of our community.',
      mainContent: 'Here is your update for this week. We have some exciting news to share with you.',
      bulletPoints: ['Insight 1', 'Insight 2', 'Insight 3'],
      callToAction: '',
      closing: 'With gratitude,',
      signature: 'Om Shree Guidance'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Build HTML and text content from fields
      const htmlContent = buildEmailHtml(formData);
      const textContent = buildPlainText(formData);

      if (!htmlContent.trim()) {
        throw new Error('Email content is required');
      }

      const response = await fetch('/backend/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          subject: formData.subject,
          htmlContent: htmlContent,
          textContent: textContent,
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
        throw new Error(data.message || 'Failed to create campaign');
      }

      navigate('/shreeweb/cms/email-campaigns');
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cmsTheme.pageWrap}>
      {/* Header */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-serif text-stone-800">Create Email Campaign</h1>
            <p className="text-sm text-stone-600 mt-1">Design and configure your email campaign</p>
          </div>
          <button
            type="button"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg font-serif text-stone-800">Email Content</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadTemplate}
                className={cmsTheme.btnGhost}
              >
                Load Template
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={cmsTheme.btnGhost}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Email Content Fields */}
            <div className="space-y-4">
              <div>
                <label className={cmsTheme.label}>Greeting</label>
                <input
                  type="text"
                  className={cmsTheme.input}
                  value={formData.greeting}
                  onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                  placeholder="e.g., Hello {{name}},"
                />
                <p className="text-xs text-stone-500 mt-1">Use {'{{name}}'} to personalize</p>
              </div>

              <div>
                <label className={cmsTheme.label}>Opening Paragraph</label>
                <textarea
                  className={cmsTheme.textarea}
                  rows={2}
                  value={formData.opening}
                  onChange={(e) => setFormData({ ...formData, opening: e.target.value })}
                  placeholder="e.g., Thank you for being part of our community."
                />
              </div>

              <div>
                <label className={cmsTheme.label}>Main Content *</label>
                <textarea
                  className={cmsTheme.textarea}
                  rows={4}
                  value={formData.mainContent}
                  onChange={(e) => setFormData({ ...formData, mainContent: e.target.value })}
                  placeholder="Write your main message here..."
                  required
                />
                <p className="text-xs text-stone-500 mt-1">Use double line breaks for new paragraphs</p>
              </div>

              <div>
                <label className={cmsTheme.label}>Bullet Points (Optional)</label>
                <div className="space-y-2">
                  {formData.bulletPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className={cmsTheme.input}
                        value={point}
                        onChange={(e) => updateBulletPoint(index, e.target.value)}
                        placeholder={`Point ${index + 1}`}
                      />
                      {formData.bulletPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBulletPoint(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBulletPoint}
                    className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                  >
                    + Add Bullet Point
                  </button>
                </div>
              </div>

              <div>
                <label className={cmsTheme.label}>Call to Action (Optional)</label>
                <input
                  type="text"
                  className={cmsTheme.input}
                  value={formData.callToAction}
                  onChange={(e) => setFormData({ ...formData, callToAction: e.target.value })}
                  placeholder="e.g., Book your session today!"
                />
              </div>

              <div>
                <label className={cmsTheme.label}>Closing</label>
                <textarea
                  className={cmsTheme.textarea}
                  rows={2}
                  value={formData.closing}
                  onChange={(e) => setFormData({ ...formData, closing: e.target.value })}
                  placeholder="e.g., With gratitude,"
                />
              </div>

              <div>
                <label className={cmsTheme.label}>Signature</label>
                <input
                  type="text"
                  className={cmsTheme.input}
                  value={formData.signature}
                  onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                  placeholder="e.g., Om Shree Guidance"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-900 font-medium mb-1">Available Variables:</p>
                <div className="flex flex-wrap gap-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border border-amber-300">{'{{name}}'}</code>
                  <code className="text-xs bg-white px-2 py-1 rounded border border-amber-300">{'{{email}}'}</code>
                </div>
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div>
                <label className={cmsTheme.label}>Live Preview</label>
                <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm sticky top-4">
                  <div className="px-4 py-3 border-b border-stone-200 bg-stone-50">
                    <div className="text-xs text-stone-600">
                      <div><strong>Subject:</strong> {formData.subject || '(no subject)'}</div>
                      <div className="mt-1"><strong>To:</strong> {'{{name}} <{{email}}>'}</div>
                    </div>
                  </div>
                  <div className="p-6 bg-stone-50 max-h-[600px] overflow-y-auto">
                    <div 
                      className="bg-white rounded-lg border border-stone-200 p-6"
                      dangerouslySetInnerHTML={{ 
                        __html: buildEmailHtml(formData) || '<p style="color:#78716c;font-style:italic;">Your email preview will appear here...</p>' 
                      }}
                    />
                    <div className="mt-4 pt-4 border-t border-stone-200 text-center">
                      <p className="text-xs text-stone-500">
                        You are receiving this email because you subscribed.
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        <a href="#" className="text-amber-700 hover:underline">Unsubscribe</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

            <div className={`p-4 border rounded-lg ${recipientCount === 0 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <p className={`text-sm ${recipientCount === 0 ? 'text-red-900' : 'text-amber-900'}`}>
                <strong>Estimated Recipients:</strong> {recipientCount} {recipientCount === 1 ? 'subscriber' : 'subscribers'}
              </p>
              {recipientCount === 0 && (
                <p className="text-xs text-red-700 mt-2">
                  ⚠️ No subscribers match your current filters. This campaign will not be sent to anyone.
                </p>
              )}
            </div>
          </div>
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
              disabled={loading || recipientCount === 0}
              className={cmsTheme.btnPrimary}
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
