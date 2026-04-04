import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { cmsTheme } from '../shreewebCmsTheme';
import { useAuth } from '../../contexts/AuthContext';

const CHART_COLORS = ['#57534e', '#92400e', '#b45309', '#d97706', '#78716c', '#a8a29e', '#44403c'];

const tooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.96)',
  border: '1px solid #e7e5e4',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#292524',
};

export default function CmsOverview() {
  const { admin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overviewData, setOverviewData] = useState(null);

  // Fetch overview data from API
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('/backend/shreeweb-overview', {
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to fetch overview data');
        }
        
        if (data.success) {
          setOverviewData(data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching overview data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-w-0 space-y-8">
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-stone-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
              <div className="animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-stone-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-stone-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full min-w-0 space-y-8">
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">Failed to Load Dashboard</h3>
            <p className="text-stone-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data available
  if (!overviewData) {
    return (
      <div className="w-full min-w-0 space-y-8">
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
          <div className="text-center py-12">
            <p className="text-stone-600">No dashboard data available</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, contentInventory, pieData, dailyActivity, recentActivity, contentCards, kpiCards } = overviewData;

  return (
    <div className="w-full min-w-0 space-y-8">
      {/* Welcome Section */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`${cmsTheme.title} text-2xl`}>
              Welcome back, {admin?.profile?.firstName || admin?.username || 'Administrator'}!
            </h1>
            <p className={`${cmsTheme.subtitle} mt-2`}>
              Snapshot of your Japandi public site: content inventory, audience signals, and embed status. 
              {admin?.role === 'super_admin' && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Super Admin
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="text-stone-600">Last login</p>
              <p className="font-medium text-stone-900">
                {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'First time'}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
              {admin?.profile?.firstName?.[0] || admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h1 className={`${cmsTheme.title} text-2xl`}>Content Overview</h1>
        <p className={`${cmsTheme.subtitle} mt-2`}>
          Real-time data from your database. All changes are synced automatically.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpiCards.map((k) => (
          <Link
            key={k.title}
            to={k.to}
            className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 transition hover:border-amber-300/60 hover:shadow-md`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{k.title}</p>
            <p className="mt-2 font-serif text-3xl text-stone-900">{k.value}</p>
            <p className="mt-1 text-xs text-stone-600">{k.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${cmsTheme.card} min-w-0 overflow-hidden p-0`}>
          <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
            <h2 className={`${cmsTheme.title} text-xl`}>Content inventory</h2>
            <p className="mt-1 text-sm text-stone-600">Counts per CMS collection.</p>
          </div>
          <div className="h-72 w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentInventory} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={{ stroke: '#d6d3d1' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(251, 191, 36, 0.08)' }} />
                <Bar dataKey="value" name="Count" fill="#57534e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cmsTheme.card} min-w-0 overflow-hidden p-0`}>
          <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
            <h2 className={`${cmsTheme.title} text-xl`}>Mix (non-zero)</h2>
            <p className="mt-1 text-sm text-stone-600">Share of testimonials, offerings, FAQ, and inbound.</p>
          </div>
          <div className="h-72 w-full p-4">
            {pieData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-stone-500">No segments yet — add content or capture leads.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={pieData[i].name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className={`${cmsTheme.card} min-w-0 overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
          <h2 className={`${cmsTheme.title} text-xl`}>Audience activity (14 days)</h2>
          <p className="mt-1 text-sm text-stone-600">Email captures vs contact form messages by day.</p>
        </div>
        <div className="h-80 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyActivity} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cmsCap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#92400e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#92400e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cmsMsg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#57534e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#57534e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={{ stroke: '#d6d3d1' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="captures" name="Captures" stroke="#92400e" fill="url(#cmsCap)" strokeWidth={2} />
              <Area type="monotone" dataKey="messages" name="Messages" stroke="#44403c" fill="url(#cmsMsg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
          <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
            <h2 className={`${cmsTheme.title} text-xl`}>Content at a glance</h2>
            <p className="mt-1 text-sm text-stone-600">Open a row to manage that area.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-100/80 text-xs font-semibold uppercase tracking-wider text-stone-600">
                <tr>
                  <th className="px-4 py-3">Area</th>
                  <th className="w-24 px-4 py-3 text-right">Count</th>
                  <th className="w-28 px-4 py-3 text-right"> </th>
                </tr>
              </thead>
              <tbody>
                {contentCards.map((c) => (
                  <tr key={c.label} className="border-b border-stone-100 hover:bg-amber-50/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900">{c.label}</div>
                      <div className="text-xs text-stone-500">{c.hint}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-serif text-lg text-stone-900">{c.value}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={c.to} className="text-sm font-medium text-amber-900 underline decoration-amber-400/70 hover:text-stone-900">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0`}>
          <h2 className={`${cmsTheme.title} text-xl`}>Recent activity</h2>
          <p className="mt-1 text-sm text-stone-600">Latest captures and contact submissions.</p>
          {recentActivity.length === 0 ? (
            <p className="mt-6 text-sm text-stone-500">Nothing yet — forms will appear here with timestamps.</p>
          ) : (
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1 text-sm">
              {recentActivity.map((r, i) => (
                <li key={`${r.kind}-${r.at}-${i}`} className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3 last:border-0">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-900/90">{r.kind}</span>
                    <p className="truncate font-medium text-stone-900">{r.detail}</p>
                    <p className="text-xs text-stone-500">{r.at ? new Date(r.at).toLocaleString() : '—'}</p>
                  </div>
                  <Link to={r.to} className="shrink-0 text-xs font-medium text-amber-900 underline decoration-amber-400/70">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>


    </div>
  );
}
