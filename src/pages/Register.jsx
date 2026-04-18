import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      setLoading(true);
      await api.post('/auth/register', form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧺</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.5px', marginBottom: 4 }}>
            LaundryPro
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Create your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}>
          {error && <div className="error-text" style={{ marginBottom: 20 }}>⚠️ {error}</div>}
          {success && (
            <div className="success-box" style={{ marginBottom: 20 }}>
              <p className="success-title">✅ {success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Rahul Sharma" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min. 6 characters" required />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={(e) => update('role', e.target.value)}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4 }}
            >
              {loading ? '⏳ Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-3)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
