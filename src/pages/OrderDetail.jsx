import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

const STEP_CONFIG = {
  RECEIVED:   { icon: '📥', label: 'Received',   color: '#94a3b8' },
  PROCESSING: { icon: '⚙️', label: 'Processing', color: '#60a5fa' },
  READY:      { icon: '✅', label: 'Ready',       color: '#fbbf24' },
  DELIVERED:  { icon: '🚚', label: 'Delivered',   color: '#34d399' },
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState({ text: '', type: '' });

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true); setError('');
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    const newStatus = e.target.value;
    try {
      setUpdating(true); setUpdateMsg({ text: '', type: '' });
      const res = await api.patch(`/orders/${id}/status`, { status: newStatus });
      setOrder(res.data.data);
      setUpdateMsg({ text: '✅ Status updated!', type: 'success' });
      setTimeout(() => setUpdateMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setUpdateMsg({ text: '❌ ' + (err.response?.data?.message || 'Failed'), type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="page">
      <p className="error-text">⚠️ {error}</p>
      <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/orders')}>← Back</button>
    </div>
  );
  if (!order) return null;

  const currentStep = STATUSES.indexOf(order.status);

  return (
    <div className="page">
      <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/orders')}>
        ← Back to Orders
      </button>

      {/* Header */}
      <div className="detail-card">
        <div className="detail-card-header">
          <div className="order-id-badge">🏷️ {order.orderId}</div>
          <h2>{order.customerName}</h2>
          <p>📞 {order.phone}</p>
        </div>
        <div className="detail-card-body">
          <div className="detail-grid">
            <div>
              <p className="detail-label">Total Amount</p>
              <p className="detail-value" style={{ fontSize: 26, fontWeight: 900, color: '#34d399', letterSpacing: '-1px' }}>
                ₹{order.totalAmount}
              </p>
            </div>
            <div>
              <p className="detail-label">Current Status</p>
              <p className="detail-value" style={{ marginTop: 4 }}><StatusBadge status={order.status} /></p>
            </div>
            <div>
              <p className="detail-label">Estimated Delivery</p>
              <p className="detail-value">
                {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="detail-label">Created At</p>
              <p className="detail-value">
                {new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="progress-card">
        <div className="progress-card-header">🚚 Order Progress</div>
        <div className="progress-card-body">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STATUSES.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              const cfg = STEP_CONFIG[step];
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUSES.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 44, height: 44,
                      borderRadius: '50%',
                      background: done ? cfg.color : 'var(--surface-3)',
                      border: active ? `3px solid ${cfg.color}` : done ? 'none' : '2px solid var(--border-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: done ? 18 : 16,
                      boxShadow: active ? `0 0 20px ${cfg.color}55` : 'none',
                      transition: 'all 0.3s ease',
                      color: done ? '#fff' : 'var(--text-3)',
                    }}>
                      {done ? cfg.icon : i + 1}
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: active ? 800 : 500,
                      color: active ? cfg.color : done ? 'var(--text-2)' : 'var(--text-3)',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.3px',
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                  {i < STATUSES.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: 3,
                      margin: '0 6px',
                      marginBottom: 24,
                      background: i < currentStep
                        ? `linear-gradient(90deg, ${STEP_CONFIG[STATUSES[i]].color}, ${STEP_CONFIG[STATUSES[i+1]].color})`
                        : 'var(--surface-3)',
                      borderRadius: 2,
                      transition: 'background 0.4s ease',
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Garments */}
      <div>
        <h2 className="section-title">👕 Garments Breakdown</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price / Item</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.garments.map((g, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-3)', fontWeight: 700 }}>{i + 1}</td>
                  <td>
                    <span style={{
                      background: 'var(--surface-3)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '3px 10px',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: 'var(--text-1)',
                    }}>
                      {g.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{g.quantity}</td>
                  <td style={{ color: 'var(--text-2)' }}>₹{g.pricePerItem}</td>
                  <td style={{ fontWeight: 800, color: '#34d399', fontSize: 14 }}>₹{g.subtotal}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 700, fontSize: 13 }}>Total Amount</td>
                <td style={{ fontSize: 16, fontWeight: 900 }}>₹{order.totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status */}
      <div className="update-status-card">
        <h2 className="section-title" style={{ marginBottom: 16 }}>🔄 Update Status</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <select
            value={order.status}
            onChange={handleStatusUpdate}
            disabled={updating}
            className="status-select"
            style={{ fontSize: 14, padding: '11px 18px', minWidth: 200 }}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {updating && <span style={{ color: 'var(--text-3)', fontSize: 13 }}>Updating...</span>}
          {updateMsg.text && <span className={`update-msg ${updateMsg.type}`}>{updateMsg.text}</span>}
        </div>
      </div>
    </div>
  );
}
