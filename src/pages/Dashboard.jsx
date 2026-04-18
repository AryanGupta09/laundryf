import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';

const STAT_CONFIG = [
  {
    key: 'totalOrders',
    label: 'Total Orders',
    icon: '📦',
    iconBg: 'rgba(124,58,237,0.15)',
    iconBorder: 'rgba(124,58,237,0.25)',
    accent: 'linear-gradient(90deg,#7c3aed,#a78bfa)',
    gradient: 'linear-gradient(135deg,rgba(124,58,237,0.08),transparent)',
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: '💰',
    prefix: '₹',
    iconBg: 'rgba(16,185,129,0.15)',
    iconBorder: 'rgba(16,185,129,0.25)',
    accent: 'linear-gradient(90deg,#10b981,#34d399)',
    gradient: 'linear-gradient(135deg,rgba(16,185,129,0.08),transparent)',
  },
  {
    key: 'todaysOrders',
    label: "Today's Orders",
    icon: '🗓️',
    iconBg: 'rgba(6,182,212,0.15)',
    iconBorder: 'rgba(6,182,212,0.25)',
    accent: 'linear-gradient(90deg,#06b6d4,#67e8f9)',
    gradient: 'linear-gradient(135deg,rgba(6,182,212,0.08),transparent)',
  },
  {
    key: 'todaysRevenue',
    label: "Today's Revenue",
    icon: '📈',
    prefix: '₹',
    iconBg: 'rgba(245,158,11,0.15)',
    iconBorder: 'rgba(245,158,11,0.25)',
    accent: 'linear-gradient(90deg,#f59e0b,#fcd34d)',
    gradient: 'linear-gradient(135deg,rgba(245,158,11,0.08),transparent)',
  },
];

const STATUS_CONFIG = {
  RECEIVED:   { color: '#94a3b8', bg: 'rgba(100,116,139,0.12)', icon: '📥' },
  PROCESSING: { color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  icon: '⚙️' },
  READY:      { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',  icon: '✅' },
  DELIVERED:  { color: '#34d399', bg: 'rgba(16,185,129,0.12)',  icon: '🚚' },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/dashboard');
      setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="error-text">⚠️ {error}</p>;
  if (!stats) return null;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back — here's what's happening today</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchDashboard}>↻ Refresh</button>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {STAT_CONFIG.map(({ key, label, icon, prefix, iconBg, iconBorder, accent, gradient }) => (
          <div
            key={key}
            className="stat-card"
            style={{
              '--card-accent': accent,
              '--card-gradient': gradient,
              '--icon-bg': iconBg,
              '--icon-border': iconBorder,
            }}
          >
            <div className="stat-card-top">
              <div className="stat-card-icon">{icon}</div>
            </div>
            <p className="stat-label">{label}</p>
            <p className="stat-value">
              {prefix && <span>{prefix}</span>}
              {(stats[key] ?? 0).toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>

      {/* Orders by Status */}
      <div>
        <h2 className="section-title">📊 Orders by Status</h2>
        <div className="status-grid">
          {Object.entries(stats.ordersByStatus).map(([status, count]) => {
            const cfg = STATUS_CONFIG[status] || { color: '#94a3b8', bg: 'rgba(100,116,139,0.1)', icon: '📦' };
            return (
              <div
                key={status}
                className="status-block"
                style={{ '--s-color': cfg.color, '--s-bg': cfg.bg }}
              >
                <div className="status-icon">{cfg.icon}</div>
                <div className="status-block-info">
                  <p className="status-block-label">{status}</p>
                  <p className="status-block-count">{count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
