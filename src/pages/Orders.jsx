import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
const GARMENT_TYPES = ['Shirt', 'Pants', 'Saree', 'Jacket', 'Kurta', 'Suit'];

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [garmentFilter, setGarmentFilter] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/orders', { params });
      setOrders(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (statusFilter) params.status = statusFilter;
    if (garmentFilter) params.garment = garmentFilter;
    fetchOrders(params);
  };

  const clearFilters = () => {
    setSearch(''); setStatusFilter(''); setGarmentFilter('');
    fetchOrders();
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      applyFilters();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const hasFilters = search || statusFilter || garmentFilter;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">
            {loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/create-order')}>
          ✚ New Order
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍  Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={garmentFilter} onChange={(e) => setGarmentFilter(e.target.value)}>
          <option value="">All Garments</option>
          {GARMENT_TYPES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <button className="btn btn-primary btn-sm" onClick={applyFilters}>Search</button>
        {hasFilters && (
          <button className="btn btn-secondary btn-sm" onClick={clearFilters}>✕ Clear</button>
        )}
      </div>

      {loading && <Loader />}
      {error && <p className="error-text">⚠️ {error}</p>}

      {!loading && !error && (
        orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧺</div>
            <p>{hasFilters ? 'No orders match your filters.' : 'No orders yet. Create your first one!'}</p>
            {!hasFilters && (
              <button className="btn btn-primary btn-sm" style={{ marginTop: 20 }} onClick={() => navigate('/create-order')}>
                ✚ Create Order
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Garments</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Est. Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span style={{ fontWeight: 800, color: '#a78bfa', fontSize: 13, letterSpacing: '-0.3px' }}>
                        {order.orderId}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{order.customerName}</td>
                    <td style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: 13 }}>{order.phone}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {order.garments.map((g, i) => (
                          <span key={i} style={{
                            background: 'var(--surface-3)',
                            border: '1px solid var(--border)',
                            borderRadius: 6,
                            padding: '2px 8px',
                            fontSize: 11.5,
                            color: 'var(--text-2)',
                            fontWeight: 600,
                          }}>
                            {g.type} ×{g.quantity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#34d399', fontSize: 14 }}>₹{order.totalAmount}</span>
                    </td>
                    <td><StatusBadge status={order.status} /></td>
                    <td style={{ color: 'var(--text-3)', fontSize: 13 }}>
                      {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="action-cell">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/orders/${order.orderId}`)}
                      >
                        View →
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                        className="status-select"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
