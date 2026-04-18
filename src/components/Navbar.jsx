import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">🧺 LaundryPro</div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          📋 Orders
        </NavLink>
        <NavLink to="/create-order" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          ✚ New Order
        </NavLink>
      </div>

      {/* User info + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: '#fff',
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>{user.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0, textTransform: 'capitalize' }}>{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: 12 }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
