import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsLeads() {
  const [query, setQuery] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [filterSource, setFilterSource] = useState('all');
  const [filterSubscribed, setFilterSubscribed] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, [page, filterSource, filterSubscribed]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50'
      });

      if (filterSource !== 'all') {
        params.append('source', filterSource);
      }

      if (filterSubscribed !== 'all') {
        params.append('subscribed', filterSubscribed);
      }

      if (query.trim()) {
        params.append('search', query.trim());
      }

      const response = await fetch(`/backend/email-captures?${params.toString()}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();

      if (data.success) {
        setLeads(data.data || []);
        setPagination(data.pagination || { total: 0, pages: 1 });
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this email capture?')) {
      return;
    }

    try {
      const response = await fetch(`/backend/email-captures/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete email capture');
      }

      // Refresh the list
      fetchLeads();
    } catch (err) {
      console.error('Error deleting email capture:', err);
      alert(err.message || 'Failed to delete email capture');
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();

      if (filterSource !== 'all') {
        params.append('source', filterSource);
      }

      if (filterSubscribed !== 'all') {
        params.append('subscribed', filterSubscribed);
      }

      const response = await fetch(`/backend/email-captures/export?${params.toString()}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to export leads');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-captures-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting leads:', err);
      alert(err.message || 'Failed to export leads');
    }
  };

  return (
    <div className={cmsTheme.pageWrap}>
      {/* Filters and Search */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={cmsTheme.label}>Search</label>
              <input
                className={cmsTheme.input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by email or name"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Source</label>
              <select
                className={cmsTheme.input}
                value={filterSource}
                onChange={(e) => {
                  setFilterSource(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Sources</option>
                <option value="shreeweb">Shreeweb</option>
                <option value="newsletter">Newsletter</option>
                <option value="contact_form">Contact Form</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={cmsTheme.label}>Status</label>
              <select
                className={cmsTheme.input}
                value={filterSubscribed}
                onChange={(e) => {
                  setFilterSubscribed(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="true">Subscribed</option>
                <option value="false">Unsubscribed</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button type="submit" className={cmsTheme.btnPrimary}>
              Search
            </button>
            <button type="button" onClick={fetchLeads} className={cmsTheme.btnGhost}>
              Refresh
            </button>
            <button type="button" onClick={handleExport} className={cmsTheme.btnGhost}>
              Export CSV
            </button>
          </div>
        </form>
      </div>

      {/* Stats */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-600">Total Email Captures</p>
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

      {/* Leads Table */}
      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-100/80 text-xs font-semibold uppercase tracking-wider text-stone-600">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Context</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Captured</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-stone-500">
                    Loading...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-stone-500">
                    No email captures found. Submissions from the public site will appear here.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-stone-100 hover:bg-white/80">
                    <td className="px-4 py-3 font-medium text-stone-900">{lead.email}</td>
                    <td className="px-4 py-3 text-stone-600">{lead.name || '—'}</td>
                    <td className="px-4 py-3 text-stone-600">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-stone-100 text-stone-700">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {lead.metadata?.context || lead.metadata?.lastContext || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        lead.subscribed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {lead.subscribed ? 'Subscribed' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
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
