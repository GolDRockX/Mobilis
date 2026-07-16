import { useState, useEffect, useCallback } from 'react';
import { UserCheck, ShieldCheck, ShieldX, Search, Award } from 'lucide-react';
import { SimAccountSelector } from './SimShared';
import api from '../../services/api';

export default function IdentityTab() {
  const [accounts, setAccounts] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [myIdentity, setMyIdentity] = useState(null);
  const [myCredentials, setMyCredentials] = useState([]);
  const [regForm, setRegForm] = useState({ name: '', metadata: '' });
  const [issueForm, setIssueForm] = useState({ target_id: '', type: '' });
  const [verifyForm, setVerifyForm] = useState({ account_id: '', type: '' });
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [accRes, idRes] = await Promise.all([
        api.get('/sim/accounts'),
        api.get('/sim/identity/me', { params: { account_id: selectedId } }),
      ]);
      setAccounts(accRes.data);
      setMyIdentity(idRes.data.identity);
      setMyCredentials(idRes.data.credentials);
    } catch (err) {
      console.error(err);
    }
  }, [selectedId]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading('register');
    setMsg(null);
    try {
      await api.post('/sim/identity/register', { account_id: selectedId, name: regForm.name, metadata: regForm.metadata });
      setMsg({ type: 'success', text: 'Identity registered!' });
      refresh();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setLoading('issue');
    setMsg(null);
    try {
      await api.post('/sim/identity/issue', { issuer_account_id: selectedId, target_account_id: parseInt(issueForm.target_id), credential_type: issueForm.type });
      setMsg({ type: 'success', text: `Credential "${issueForm.type}" issued` });
      setIssueForm({ target_id: '', type: '' });
      refresh();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading('verify');
    setVerifyResult(null);
    try {
      const res = await api.get('/sim/identity/verify', { params: { account_id: parseInt(verifyForm.account_id), type: verifyForm.type } });
      setVerifyResult(res.data);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading('');
    }
  };

  return (
    <div>
      <SimAccountSelector accounts={accounts} selectedId={selectedId} setSelectedId={setSelectedId} />

      {msg && <div className={`wallet-msg ${msg.type}`} style={{ marginTop: 12 }}>{msg.text}</div>}

      <div className="btc-layout" style={{ marginTop: 20 }}>
        {/* My Identity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <UserCheck size={18} color="var(--accent)" />
            <h3 className="section-title" style={{ margin: 0 }}>My Identity</h3>
          </div>

          {myIdentity ? (
            <div>
              <p style={{ fontSize: 15, fontWeight: 700 }}>{myIdentity.name}</p>
              {myIdentity.metadata_uri && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{myIdentity.metadata_uri}</p>}
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Registered {new Date(myIdentity.registered_at).toLocaleDateString()}</p>

              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Credentials ({myCredentials.length})</p>
                {myCredentials.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No credentials issued yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {myCredentials.map(c => (
                      <div key={c.id} className="apikey-item">
                        <div className="apikey-item-info">
                          <span className="apikey-item-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Award size={13} color={c.revoked ? 'var(--red)' : 'var(--green)'} /> {c.credential_type}
                          </span>
                          <span className="apikey-item-meta">Issued {new Date(c.issued_at).toLocaleDateString()} by Account #{c.issuer_account_id}</span>
                        </div>
                        <span className={c.revoked ? 'tag-sell' : 'tag-buy'}>{c.revoked ? 'Revoked' : 'Valid'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Not registered yet. Create your identity:</p>
              <input type="text" placeholder="Your name" value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} required style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14 }} />
              <input type="text" placeholder="Metadata URI (optional)" value={regForm.metadata} onChange={e => setRegForm({ ...regForm, metadata: e.target.value })} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14 }} />
              <button className="btn-primary" disabled={loading === 'register'} style={{ width: 'fit-content' }}>{loading === 'register' ? 'Registering...' : 'Register Identity'}</button>
            </form>
          )}
        </div>

        {/* Issue credential */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <ShieldCheck size={18} color="var(--accent)" />
            <h3 className="section-title" style={{ margin: 0 }}>Issue Credential</h3>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Only issuer accounts can do this. Account #0 is issuer by default.</p>
          <form onSubmit={handleIssue} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <select
              value={issueForm.target_id}
              onChange={e => setIssueForm({ ...issueForm, target_id: e.target.value })}
              required
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14 }}
            >
              <option value="">Select recipient account...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
            <input type="text" placeholder="Credential type (e.g. KYC Verified)" value={issueForm.type} onChange={e => setIssueForm({ ...issueForm, type: e.target.value })} required style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14 }} />
            <button className="btn-primary" disabled={loading === 'issue'} style={{ width: 'fit-content' }}>{loading === 'issue' ? 'Issuing...' : 'Issue Credential'}</button>
          </form>
        </div>
      </div>

      {/* Verify */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Search size={18} color="var(--accent)" />
          <h3 className="section-title" style={{ margin: 0 }}>Verify Credential</h3>
        </div>
        <form onSubmit={handleVerify} className="chain-inline-form">
          <select
            value={verifyForm.account_id}
            onChange={e => setVerifyForm({ ...verifyForm, account_id: e.target.value })}
            required
            style={{ flex: 1, minWidth: 150, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14 }}
          >
            <option value="">Select account to check...</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
          <input type="text" placeholder="Credential type" value={verifyForm.type} onChange={e => setVerifyForm({ ...verifyForm, type: e.target.value })} required style={{ maxWidth: 180 }} />
          <button className="btn-primary" disabled={loading === 'verify'}>{loading === 'verify' ? 'Checking...' : 'Verify'}</button>
        </form>

        {verifyResult && (
          <div className={`wallet-msg ${verifyResult.valid ? 'success' : 'error'}`} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            {verifyResult.valid ? <ShieldCheck size={16} /> : <ShieldX size={16} />}
            {verifyResult.valid
              ? `Valid credential — issued by Account #${verifyResult.issuer_account_id} on ${new Date(verifyResult.issued_at).toLocaleDateString()}`
              : 'No valid credential of this type found for this account'}
          </div>
        )}
      </div>
    </div>
  );
}
