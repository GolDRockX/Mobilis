import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bitcoin, Wallet, User, Users, LayoutDashboard, TrendingUp, FlaskConical, X } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/bitcoin', icon: Bitcoin, label: 'Bitcoin' },
  { to: '/dashboard/bitcoin-test', icon: FlaskConical, label: 'Bitcoin Test' },
  { to: '/dashboard/wallet', icon: Wallet, label: 'Wallet' },
  // { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

const adminItems = [
  { to: '/dashboard/admin', icon: Users, label: 'All Users' },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <TrendingUp size={22} color="var(--accent)" />
          <span>Mobilis<span className="logo-accent"> Pro</span></span>
          <button className="sidebar-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="sidebar-section-label">Menu</div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <div className="sidebar-section-label" style={{ marginTop: 16 }}>Admin</div>
              {adminItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className={user?.role === 'admin' ? 'badge-admin' : 'badge-user'}>{user?.role}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
