import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import './Header.css';

export default function Header({ title, onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <button className="hamburger" onClick={onMenuToggle}>
          <span /><span /><span />
        </button>
        <h1 className="dash-header-title">{title}</h1>
      </div>
      <div className="dash-header-right" ref={dropRef}>
        <button className="avatar-btn" onClick={() => setOpen(!open)}>
          <div className="dash-header-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <span className="avatar-name">{user?.name}</span>
          <ChevronDown size={14} className={`avatar-chevron ${open ? 'open' : ''}`} />
        </button>
        {open && (
          <div className="avatar-dropdown">
            <div className="avatar-dropdown-info">
              <p className="avatar-dropdown-name">{user?.name}</p>
              <p className="avatar-dropdown-email">{user?.email}</p>
              <span className={user?.role === 'admin' ? 'badge-admin' : 'badge-user'}>{user?.role}</span>
            </div>
            <div className="avatar-dropdown-divider" />
            <button className="avatar-dropdown-item" onClick={() => { navigate('/dashboard/profile'); setOpen(false); }}>
              <User size={15} /> Profile
            </button>
            <button className="avatar-dropdown-item logout" onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
