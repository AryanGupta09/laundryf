import { NavLink } from 'react-router-dom';

export default function Navbar() {
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
    </nav>
  );
}
