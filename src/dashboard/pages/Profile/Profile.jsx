import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import { useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import { User, Save, Key, Plus, Trash2, Copy, Check, Eye } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const { user, setUser, onMenuToggle } = useOutletContext ? { ...useOutletContext(), ...useAuth() } : useAuth();
  const ctx = useOutletContext();
  const { onMenuToggle: menuToggle } = ctx || {};
  const { user: authUser, setUser: authSetUser } = useAuth();

  const [form, setForm] = useState({ name: authUser?.name || '', avatar: authUser?.avatar || '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState([]);
  const [keyLabel, setKeyLabel] = useState('');
  const [newKey, setNewKey] = useState(null);
  const [keyMsg, setKeyMsg] = useState(null);
  const [keyLoading, setKeyLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchKeys(); }, []);

  const fetchKeys = async () => {
    try {
      const res = await api.get('/keys');
      setApiKeys(res.data);
    } catch {}
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.put('/auth/profile', form);
      authSetUser(prev => ({ ...prev, ...res.data }));
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async () => {
    setKeyLoading(true);
    setKeyMsg(null);
    setNewKey(null);
    try {
      const res = await api.post('/keys/generate', { label: keyLabel || 'My API Key' });
      setNewKey(res.data.api_key);
      setKeyLabel('');
      fetchKeys();
      setKeyMsg({ type: 'success', text: 'Key generated! Copy it now — it won\'t be shown again.' });
    } catch (err) {
      setKeyMsg({ type: 'error', text: err.response?.data?.message || 'Failed to generate key' });
    } finally {
      setKeyLoading(false);
    }
  };

  const deleteKey = async (id) => {
    if (!confirm('Delete this API key?')) return;
    try {
      await api.delete(`/keys/${id}`);
      fetchKeys();
    } catch {}
  };

  const copyKey = () => {
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page">
      <Header title="My Profile" onMenuToggle={menuToggle} />
      <div className="page-content">
        <div className="profile-layout">
          {/* Profile card */}
          <div className="card profile-card">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-big">{authUser?.name?.[0]?.toUpperCase()}</div>
              <div>
                <h2 className="profile-name">{authUser?.name}</h2>
                <p className="profile-email">{authUser?.email}</p>
                <span className={authUser?.role === 'admin' ? 'badge-admin' : 'badge-user'}>{authUser?.role}</span>
              </div>
            </div>
            <div className="profile-stats">
              <div className="profile-stat"><span>USD Balance</span><strong>${parseFloat(authUser?.usd_balance || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong></div>
              <div className="profile-stat"><span>BTC Balance</span><strong>{parseFloat(authUser?.btc_balance || 0).toFixed(8)}</strong></div>
              <div className="profile-stat"><span>Wallet</span><strong>{authUser?.wallet_type || 'Not connected'}</strong></div>
              <div className="profile-stat"><span>Member Since</span><strong>{authUser?.created_at ? new Date(authUser.created_at).toLocaleDateString() : '—'}</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Edit profile */}
            <div className="card">
              <h3 className="section-title">Edit Profile</h3>
              <form onSubmit={handleSave} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={authUser?.email || ''} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                  <small style={{ color: 'var(--text-muted)', fontSize: 11 }}>Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label>Avatar URL (optional)</label>
                  <input type="url" placeholder="https://..." value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} />
                </div>
                {msg && <div className={`wallet-msg ${msg.type}`}>{msg.text}</div>}
                <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Save size={16} />{loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* API Keys */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Key size={18} color="var(--accent)" />
                <h3 className="section-title" style={{ margin: 0 }}>API Keys</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                Use API keys to access your data from external apps. Pass the key as an <code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>X-API-Key</code> header, or add <code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>?api_key=YOUR_KEY</code> to the URL to test it directly in your browser.
              </p>

              {/* Generate new key */}
              <div className="apikey-generate-row">
                <input
                  type="text"
                  placeholder="Key label (e.g. My App)"
                  value={keyLabel}
                  onChange={e => setKeyLabel(e.target.value)}
                  className="apikey-label-input"
                  maxLength={50}
                />
                <button className="btn-primary" onClick={generateKey} disabled={keyLoading} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <Plus size={15} />{keyLoading ? 'Generating...' : 'Generate Key'}
                </button>
              </div>

              {keyMsg && <div className={`wallet-msg ${keyMsg.type}`} style={{ marginTop: 10 }}>{keyMsg.text}</div>}

              {/* Show new key once */}
              {newKey && (
                <div className="apikey-reveal">
                  <Eye size={14} color="var(--accent)" />
                  <code className="apikey-value">{newKey}</code>
                  <button className="apikey-copy-btn" onClick={copyKey}>
                    {copied ? <Check size={14} color="var(--green)" /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}

              {/* Existing keys list */}
              {apiKeys.length > 0 && (
                <div className="apikey-list">
                  {apiKeys.map(k => (
                    <div key={k.id} className="apikey-item">
                      <div className="apikey-item-info">
                        <span className="apikey-item-label">{k.label}</span>
                        <code className="apikey-item-masked">{k.api_key_masked}</code>
                        <span className="apikey-item-meta">
                          Created {new Date(k.created_at).toLocaleDateString()}
                          {k.last_used && ` · Last used ${new Date(k.last_used).toLocaleDateString()}`}
                        </span>
                      </div>
                      <button className="admin-btn delete" onClick={() => deleteKey(k.id)}><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}

              {apiKeys.length === 0 && !newKey && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No API keys yet. Generate one above.</p>
              )}

              {/* Quick reference */}
              <div className="apikey-docs">
                <p className="apikey-docs-title">Quick Reference</p>
                <div className="apikey-docs-grid">
                  {[
                    { method: 'GET', path: '/api/v1/me', desc: 'Your profile' },
                    { method: 'GET', path: '/api/v1/btc-price', desc: 'Live BTC price' },
                    { method: 'GET', path: '/api/v1/trades', desc: 'Trade history' },
                    { method: 'GET', path: '/api/v1/wallet', desc: 'Wallet info' },
                  ].map(e => (
                    <div key={e.path} className="apikey-docs-item">
                      <span className="apikey-method">{e.method}</span>
                      <code className="apikey-path">{e.path}</code>
                      <span className="apikey-desc">{e.desc}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
                  Full docs available at <code style={{ fontSize: 11 }}>GET /api/v1</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
