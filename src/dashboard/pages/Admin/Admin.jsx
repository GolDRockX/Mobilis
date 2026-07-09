import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import { Trash2, Edit, RefreshCw, X, Check } from 'lucide-react';
import './Admin.css';

export default function Admin() {
  const { onMenuToggle } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [msg, setMsg] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role, usd_balance: user.usd_balance });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/admin/users/${id}`, editForm);
      setMsg({ type: 'success', text: 'User updated' });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setMsg({ type: 'success', text: 'User deleted' });
      fetchUsers();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
    }
  };

  return (
    <div className="page">
      <Header title="All Users" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <div className="admin-toolbar">
          <h3 className="section-title" style={{ margin: 0 }}>User Accounts ({users.length})</h3>
          <button className="btn-ghost" onClick={fetchUsers} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {msg && <div className={`wallet-msg ${msg.type}`} style={{ marginBottom: 16 }}>{msg.text}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrap">
              <table className="dash-table admin-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
                    <th>USD Balance</th><th>BTC Balance</th><th>Wallet</th><th>Joined</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ color: 'var(--text-muted)' }}>#{u.id}</td>
                      <td>
                        {editingId === u.id
                          ? <input className="admin-inline-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                          : u.name}
                      </td>
                      <td>
                        {editingId === u.id
                          ? <input className="admin-inline-input" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                          : u.email}
                      </td>
                      <td>
                        {editingId === u.id
                          ? <select className="admin-inline-input" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          : <span className={u.role === 'admin' ? 'badge-admin' : 'badge-user'}>{u.role}</span>}
                      </td>
                      <td>
                        {editingId === u.id
                          ? <input className="admin-inline-input" type="number" value={editForm.usd_balance} onChange={e => setEditForm({ ...editForm, usd_balance: e.target.value })} />
                          : `$${parseFloat(u.usd_balance).toLocaleString()}`}
                      </td>
                      <td>{parseFloat(u.btc_balance).toFixed(6)}</td>
                      <td style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {u.wallet_address ? `${u.wallet_address.slice(0, 10)}...` : '—'}
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-actions">
                          {editingId === u.id ? (
                            <>
                              <button className="admin-btn save" onClick={() => saveEdit(u.id)}><Check size={14} /></button>
                              <button className="admin-btn cancel" onClick={() => setEditingId(null)}><X size={14} /></button>
                            </>
                          ) : (
                            <>
                              <button className="admin-btn edit" onClick={() => startEdit(u)}><Edit size={14} /></button>
                              <button className="admin-btn delete" onClick={() => deleteUser(u.id)}><Trash2 size={14} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
