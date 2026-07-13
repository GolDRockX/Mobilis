import { useState, useEffect, useCallback } from 'react';
import { Package, Plus, MapPin, ArrowRightLeft, History } from 'lucide-react';
import { ConnectionBanner, AccountSelector } from './Shared';

export default function SupplyChainTab({ chain }) {
  const { connected, error, isDeployed, accounts, selectedAccount, setSelectedAccount, balance, getContract } = chain;
  const [products, setProducts] = useState([]);
  const [createForm, setCreateForm] = useState({ name: '', location: '' });
  const [checkpointForms, setCheckpointForms] = useState({});
  const [transferForms, setTransferForms] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState(null);

  const supplyChain = getContract('MobilisSupplyChain');

  const fetchProducts = useCallback(async () => {
    if (!supplyChain) return;
    try {
      const count = await supplyChain.productCount();
      const items = [];
      for (let i = 1; i <= Number(count); i++) {
        const p = await supplyChain.products(i);
        items.push({
          id: Number(p.id),
          name: p.name,
          currentHolder: p.currentHolder,
          originCreator: p.originCreator,
          createdAt: Number(p.createdAt) * 1000,
        });
      }
      setProducts(items.reverse());
    } catch (err) {
      console.error(err);
    }
  }, [supplyChain]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleHistory = async (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!history[id]) {
      const raw = await supplyChain.getHistory(id);
      setHistory(prev => ({ ...prev, [id]: raw.map(cp => ({
        status: cp.status, location: cp.location, recordedBy: cp.recordedBy, timestamp: Number(cp.timestamp) * 1000
      })) }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    setLoading('create');
    setMsg(null);
    try {
      const tx = await supplyChain.createProduct(createForm.name, createForm.location || 'Unknown origin');
      await tx.wait();
      setMsg({ type: 'success', text: `Product "${createForm.name}" created` });
      setCreateForm({ name: '', location: '' });
      fetchProducts();
    } catch (err) {
      setMsg({ type: 'error', text: err.reason || err.message });
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
      const tx = await supplyChain.addCheckpoint(id, f.status, f.location || '');
      await tx.wait();
      setMsg({ type: 'success', text: `Checkpoint added to #${id}` });
      setCheckpointForms({ ...checkpointForms, [id]: { status: '', location: '' } });
      if (expandedId === id) { setHistory(prev => ({ ...prev, [id]: undefined })); toggleHistory(id); toggleHistory(id); }
    } catch (err) {
      setMsg({ type: 'error', text: err.reason || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleTransfer = async (id) => {
    const newHolder = transferForms[id];
    if (!newHolder?.trim()) return;
    setLoading(`transfer-${id}`);
    setMsg(null);
    try {
      const tx = await supplyChain.transferCustody(id, newHolder.trim());
      await tx.wait();
      setMsg({ type: 'success', text: `Custody of #${id} transferred` });
      setTransferForms({ ...transferForms, [id]: '' });
      fetchProducts();
    } catch (err) {
      setMsg({ type: 'error', text: err.reason || err.message });
    } finally {
      setLoading('');
    }
  };

  return (
    <div>
      <ConnectionBanner connected={connected} error={error} isDeployed={isDeployed} />
      {connected && isDeployed && (
        <>
          <AccountSelector accounts={accounts} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} balance={balance} />

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
                  const isMine = p.currentHolder.toLowerCase() === selectedAccount.address.toLowerCase();
                  return (
                    <div key={p.id} className="dao-proposal-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700 }}>#{p.id} {p.name}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                            Holder: {isMine ? <span style={{ color: 'var(--accent)' }}>You</span> : `${p.currentHolder.slice(0,6)}...${p.currentHolder.slice(-4)}`}
                          </p>
                        </div>
                        <button className="btn-ghost" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px' }} onClick={() => toggleHistory(p.id)}>
                          <History size={13} /> {expandedId === p.id ? 'Hide' : 'History'}
                        </button>
                      </div>

                      {expandedId === p.id && history[p.id] && (
                        <div className="supply-history">
                          {history[p.id].map((cp, i) => (
                            <div key={i} className="supply-history-item">
                              <MapPin size={12} color="var(--accent)" />
                              <div>
                                <span style={{ fontWeight: 600 }}>{cp.status}</span>
                                {cp.location && <span style={{ color: 'var(--text-muted)' }}> · {cp.location}</span>}
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(cp.timestamp).toLocaleString()}</div>
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
                            <input type="text" placeholder="Transfer custody to address (0x...)" value={transferForms[p.id] || ''} onChange={e => setTransferForms({ ...transferForms, [p.id]: e.target.value })} />
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
        </>
      )}
    </div>
  );
}
