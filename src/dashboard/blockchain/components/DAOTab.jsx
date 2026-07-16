import { useState, useEffect, useCallback } from 'react';
import { Vote, Plus, ThumbsUp, ThumbsDown, PlayCircle, Clock } from 'lucide-react';
import { SimAccountSelector } from './SimShared';
import api from '../../services/api';

export default function DAOTab() {
  const [accounts, setAccounts] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const [accRes, propRes] = await Promise.all([
        api.get('/sim/accounts'),
        api.get('/sim/dao/proposals', { params: { account_id: selectedId } }),
      ]);
      setAccounts(accRes.data);
      setProposals(propRes.data);
    } catch (err) {
      console.error(err);
    }
  }, [selectedId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading('create');
    setMsg(null);
    try {
      await api.post('/sim/dao/proposals', { account_id: selectedId, title: form.title, description: form.description });
      setMsg({ type: 'success', text: 'Proposal created!' });
      setForm({ title: '', description: '' });
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleVote = async (id, support) => {
    setLoading(`vote-${id}`);
    setMsg(null);
    try {
      await api.post('/sim/dao/vote', { account_id: selectedId, proposal_id: id, support });
      setMsg({ type: 'success', text: `Voted ${support ? 'YES' : 'NO'} on proposal #${id}` });
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleExecute = async (id) => {
    setLoading(`exec-${id}`);
    setMsg(null);
    try {
      await api.post('/sim/dao/execute', { proposal_id: id });
      setMsg({ type: 'success', text: `Proposal #${id} executed` });
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
          <Vote size={18} color="var(--accent)" />
          <h3 className="section-title" style={{ margin: 0 }}>Create Proposal</h3>
        </div>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="text" placeholder="Proposal title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14 }} />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }} />
          <button className="btn-primary" disabled={loading === 'create'} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', width: 'fit-content' }}>
            <Plus size={15} /> {loading === 'create' ? 'Submitting...' : 'Submit Proposal'}
          </button>
        </form>
        {msg && <div className={`wallet-msg ${msg.type}`} style={{ marginTop: 12 }}>{msg.text}</div>}
      </div>

      <div className="card">
        <h3 className="section-title">Proposals ({proposals.length})</h3>
        {proposals.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '30px 0' }}>No proposals yet. Create one above.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {proposals.map(p => {
              const deadlineMs = new Date(p.deadline).getTime();
              const isActive = now < deadlineMs && !p.executed;
              const totalVotes = p.votes_for + p.votes_against;
              const forPct = totalVotes > 0 ? (p.votes_for / totalVotes) * 100 : 50;
              const secondsLeft = Math.max(0, Math.floor((deadlineMs - now) / 1000));
              return (
                <div key={p.id} className="dao-proposal-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700 }}>#{p.id} {p.title}</p>
                      {p.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{p.description}</p>}
                    </div>
                    {p.executed ? (
                      <span className={p.passed ? 'tag-buy' : 'tag-sell'}>{p.passed ? 'PASSED' : 'REJECTED'}</span>
                    ) : isActive ? (
                      <span className="chain-active-badge"><Clock size={11} /> {secondsLeft}s left</span>
                    ) : (
                      <span className="badge-user">Ended</span>
                    )}
                  </div>

                  <div className="dao-vote-bar">
                    <div className="dao-vote-bar-fill" style={{ width: `${forPct}%` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>{p.votes_for} For</span>
                    <span>{p.votes_against} Against</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {isActive && !p.voted && (
                      <>
                        <button className="trade-submit buy" style={{ flex: 1, padding: 8, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => handleVote(p.id, true)} disabled={loading === `vote-${p.id}`}>
                          <ThumbsUp size={14} /> Vote Yes
                        </button>
                        <button className="trade-submit sell" style={{ flex: 1, padding: 8, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => handleVote(p.id, false)} disabled={loading === `vote-${p.id}`}>
                          <ThumbsDown size={14} /> Vote No
                        </button>
                      </>
                    )}
                    {isActive && p.voted && (
                      <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>You already voted on this proposal</p>
                    )}
                    {!isActive && !p.executed && (
                      <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => handleExecute(p.id)} disabled={loading === `exec-${p.id}`}>
                        <PlayCircle size={14} /> {loading === `exec-${p.id}` ? 'Executing...' : 'Execute Proposal'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
