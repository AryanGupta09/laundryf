import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const GARMENT_TYPES = ['Shirt', 'Pants', 'Saree', 'Jacket', 'Kurta', 'Suit'];
const PRICES = { Shirt: 50, Pants: 60, Saree: 120, Jacket: 150, Kurta: 70, Suit: 250 };
const GARMENT_ICONS = { Shirt: '👔', Pants: '👖', Saree: '🥻', Jacket: '🧥', Kurta: '👘', Suit: '🤵' };

const emptyGarment = () => ({ type: 'Shirt', quantity: 1 });

export default function CreateOrder() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [garments, setGarments] = useState([emptyGarment()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const addGarment = () => setGarments([...garments, emptyGarment()]);
  const removeGarment = (i) => setGarments(garments.filter((_, idx) => idx !== i));
  const updateGarment = (i, field, value) =>
    setGarments(garments.map((g, idx) =>
      idx === i ? { ...g, [field]: field === 'quantity' ? Math.max(1, parseInt(value) || 1) : value } : g
    ));

  const estimatedTotal = garments.reduce((sum, g) => sum + (PRICES[g.type] || 0) * g.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(null);
    try {
      setLoading(true);
      const res = await api.post('/orders', { customerName, phone, garments });
      const { orderId, totalAmount, estimatedDelivery } = res.data.data;
      setSuccess({ orderId, totalAmount, estimatedDelivery });
      setCustomerName(''); setPhone(''); setGarments([emptyGarment()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────
  if (success) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 66px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 24,
          padding: '48px 40px',
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(16,185,129,0.1)',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#34d399', marginBottom: 8 }}>
            Order Created!
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 32 }}>
            Your order has been placed successfully
          </p>

          <div style={{
            background: 'var(--surface-2)',
            borderRadius: 16,
            padding: '24px',
            marginBottom: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            textAlign: 'left',
          }}>
            {[
              { label: 'Order ID', value: success.orderId, color: '#a78bfa', big: true },
              { label: 'Total Amount', value: `₹${success.totalAmount}`, color: '#34d399', big: true },
              { label: 'Estimated Delivery', value: new Date(success.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
            ].map(({ label, value, color, big }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</span>
                <span style={{ fontSize: big ? 16 : 14, fontWeight: 800, color: color || 'var(--text-1)' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>
              View All Orders →
            </button>
            <button className="btn btn-secondary" onClick={() => setSuccess(null)}>
              + New Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Form ───────────────────────────────────────────
  return (
    <div style={{
      minHeight: 'calc(100vh - 66px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '16px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 680 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🧺</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.8px', marginBottom: 4 }}>
            Create New Order
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13 }}>
            Fill in customer details and add garments
          </p>
        </div>

        {error && (
          <div className="error-text" style={{ marginBottom: 20 }}>⚠️ {error}</div>
        )}

        {/* Form Card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}>

          {/* Step 1 — Customer Info */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.04))',
            borderBottom: '1px solid var(--border)',
            padding: '24px 32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0,
              }}>1</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Customer Information</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 2 — Garments */}
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>2</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Garments</span>
              </div>

              {/* Live Total */}
              <div style={{
                background: estimatedTotal > 0 ? 'rgba(16,185,129,0.1)' : 'var(--surface-2)',
                border: `1px solid ${estimatedTotal > 0 ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
                borderRadius: 10,
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Est. Total</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: estimatedTotal > 0 ? '#34d399' : 'var(--text-3)', letterSpacing: '-0.5px' }}>
                  ₹{estimatedTotal}
                </span>
              </div>
            </div>

            {/* Column Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 80px 36px',
              gap: 10,
              padding: '0 12px 8px',
            }}>
              {['Type', 'Price', 'Qty', ''].map((h) => (
                <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</span>
              ))}
            </div>

            {/* Garment Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {garments.map((g, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 80px 36px',
                  gap: 10,
                  alignItems: 'center',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  transition: 'border-color 0.15s',
                }}>
                  {/* Type select with icon */}
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 16, pointerEvents: 'none', zIndex: 1,
                    }}>
                      {GARMENT_ICONS[g.type]}
                    </span>
                    <select
                      value={g.type}
                      onChange={(e) => updateGarment(i, 'type', e.target.value)}
                      style={{
                        width: '100%', padding: '9px 12px 9px 36px',
                        border: '1px solid var(--border-2)', borderRadius: 8,
                        fontSize: 13.5, fontFamily: 'inherit',
                        color: 'var(--text-1)', background: 'var(--surface-3)',
                        outline: 'none', cursor: 'pointer',
                      }}
                    >
                      {GARMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Price display */}
                  <div style={{
                    background: 'var(--surface-3)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '9px 12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#a78bfa',
                    textAlign: 'center',
                  }}>
                    ₹{PRICES[g.type]} / pc
                  </div>

                  {/* Quantity */}
                  <input
                    type="number"
                    min="1"
                    value={g.quantity}
                    onChange={(e) => updateGarment(i, 'quantity', e.target.value)}
                    style={{
                      width: '100%', padding: '9px 10px',
                      border: '1px solid var(--border-2)', borderRadius: 8,
                      fontSize: 14, fontFamily: 'inherit', fontWeight: 700,
                      color: 'var(--text-1)', background: 'var(--surface-3)',
                      outline: 'none', textAlign: 'center',
                    }}
                  />

                  {/* Remove */}
                  {garments.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeGarment(i)}
                      style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#f87171', fontSize: 14, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.target.style.background = '#ef4444'; e.target.style.color = '#fff'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(239,68,68,0.1)'; e.target.style.color = '#f87171'; }}
                    >✕</button>
                  ) : <div />}
                </div>
              ))}
            </div>

            {/* Add Garment */}
            <button
              type="button"
              onClick={addGarment}
              style={{
                marginTop: 12,
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border: '1.5px dashed var(--border-2)',
                borderRadius: 10,
                color: 'var(--text-3)',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = '#a78bfa'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.color = 'var(--text-3)'; }}
            >
              + Add Another Garment
            </button>
          </div>

          {/* Footer — Actions */}
          <div style={{
            padding: '20px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--surface-2)',
          }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/orders')}
            >
              ← Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={loading || !customerName || !phone}
              style={{ minWidth: 180, fontSize: 14 }}
            >
              {loading ? '⏳ Creating...' : '✓ Create Order'}
            </button>
          </div>
        </div>

        {/* Price Reference */}
        <div style={{
          marginTop: 20,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '16px 24px',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>
            Price Reference
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {GARMENT_TYPES.map((t) => (
              <div key={t} style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
              }}>
                <span>{GARMENT_ICONS[t]}</span>
                <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{t}</span>
                <span style={{ color: '#a78bfa', fontWeight: 800 }}>₹{PRICES[t]}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
