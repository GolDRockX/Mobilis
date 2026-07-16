import { useState, useEffect, useCallback } from 'react';
import { Package, Plus, MapPin, ArrowRightLeft, History } from 'lucide-react';
import { SimAccountSelector } from './SimShared';
import api from '../../services/api';

export default function SupplyChainTab() {
  const [accounts, setAccounts] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [products, setProducts] = useState([]);
  const [createForm, setCreateForm] = useState({ name: '', location: '' });
  const [checkpointForms, setCheckpointForms] = useState({});
  const [transferForms, setTransferForms] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [accRes, prodRes] = await Promise.all([api.get('/sim/accounts'), api.get('/sim/supply/products')]);
      setAccounts(accRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const accountLabel = (id) => accounts.find(a => a.id === id)?.label || `Account #${id}`;

  const toggleHistory = async (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    const res = await api.get(`/sim/supply/products/${id}/history`);
    setHistory(prev => ({ ...prev, [id]: res.data }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    setLoading('create');
    setMsg(null);
    try {
      await api.post('/sim/supply/products', { account_id: selectedId, name: createForm.name, location: createForm.location || 'Unknown origin' });
      setMsg({ type: 'success', text: `Product "${createForm.name}" created` });
      setCreateForm({ name: '', location: '' });
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleAddCheckpoint = async (id) => {
    const f = checkpointForms[id];
    if (!f?.status?.trim()) return;
    setLoading(`cp-${id}`);
    setMsg(null);
    try {
      await api.post('/sim/supply/checkpoint', { account_id: selectedId, product_id: id, status: f.status, location: f.location || '' });
      setMsg({ type: 'success', text: `Checkpoint added to #${id}` });
      setCheckpointForms({ ...checkpointForms, [id]: { status: '', location: '' } });
      if (expandedId === id) {
        const res = await api.get(`/sim/supply/products/${id}/history`);
        setHistory(prev => ({ ...prev, [id]: res.data }));
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleTransfer = async (id) => {
    const newHolder = transferForms[id];
    if (newHolder === undefined || newHolder === '') return;
    setLoading(`transfer-${id}`);
    setMsg(null);
    try {
      await api.post('/sim/supply/transfer', { account_id: selectedId, product_id: id, new_holder_account_id: parseInt(newHolder) });
      setMsg({ type: 'success', text: `Custody of #${id} transferred` });
      setTransferForms({ ...transferForms, [id]: '' });
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading('');
    }
  };

  return (
    <div>
      <SimAccountSelector accounts={accounts} selectedId={selectedId} setSelectedId={setSelectedId} />

      <div className="card" style={{ marginTop: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Package size={18} color="var(--accent)" />
          <h3 className="section-title" style={{ margin: 0 }}>Create Product</h3>
        </div>
        <form onSubmit={handleCreate} className="chain-inline-form">
          <input type="text" placeholder="Product name (e.g. Coffee Beans Batch #42)" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} required />
          <input type="text" placeholder="Origin location" value={createForm.location} onChange={e => setCreateForm({ ...createForm, location: e.target.value })} style={{ maxWidth: 180 }} />
          <button className="btn-primary" disabled={loading === 'create'} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <Plus size={15} /> {loading === 'create' ? 'Creating...' : 'Create'}
          </button>
        </form>
        {msg && <div className={`wallet-msg ${msg.type}`} style={{ marginTop: 12 }}>{msg.text}</div>}
      </div>

      <div className="card">
        <h3 className="section-title">Products ({products.length})</h3>
        {products.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '30px 0' }}>No products tracked yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {products.map(p => {
              const isMine = p.current_holder_account_id === selectedId;
              return (
                <div key={p.id} className="dao-proposal-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700 }}>#{p.id} {p.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Holder: {isMine ? <span style={{ color: 'var(--accent)' }}>You</span> : accountLabel(p.current_holder_account_id)}
                      </p>
                    </div>
                    <button className="btn-ghost" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px' }} onClick={() => toggleHistory(p.id)}>
                      <History size={13} /> {expandedId === p.id ? 'Hide' : 'History'}
                    </button>
                  </div>

                  {expandedId === p.id && history[p.id] && (
                    <div className="supply-history">
                      {history[p.id].map((cp) => (
                        <div key={cp.id} className="supply-history-item">
                          <MapPin size={12} color="var(--accent)" />
                          <div>
                            <span style={{ fontWeight: 600 }}>{cp.status}</span>
                            {cp.location && <span style={{ color: 'var(--text-muted)' }}> · {cp.location}</span>}
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(cp.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isMine && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                      <div className="chain-inline-form">
                        <input type="text" placeholder="Checkpoint status (e.g. Shipped)" value={checkpointForms[p.id]?.status || ''} onChange={e => setCheckpointForms({ ...checkpointForms, [p.id]: { ...checkpointForms[p.id], status: e.target.value } })} />
                        <input type="text" placeholder="Location" value={checkpointForms[p.id]?.location || ''} onChange={e => setCheckpointForms({ ...checkpointForms, [p.id]: { ...checkpointForms[p.id], location: e.target.value } })} style={{ maxWidth: 140 }} />
                        <button className="admin-btn edit" onClick={() => handleAddCheckpoint(p.id)} disabled={loading === `cp-${p.id}`}><MapPin size={13} /></button>
                      </div>
                      <div className="chain-inline-form">
                        <select
                          value={transferForms[p.id] ?? ''}
                          onChange={e => setTransferForms({ ...transferForms, [p.id]: e.target.value })}
                          style={{ flex: 1, minWidth: 150, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14 }}
                        >
                          <option value="">Transfer custody to...</option>
                          {accounts.filter(a => a.id !== selectedId).map(a => (
                            <option key={a.id} value={a.id}>{a.label}</option>
                          ))}
                        </select>
                        <button className="admin-btn edit" onClick={() => handleTransfer(p.id)} disabled={loading === `transfer-${p.id}`}><ArrowRightLeft size={13} /></button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
