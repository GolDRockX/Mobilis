import { useState, useEffect, useCallback } from 'react';
import { UserCheck, ShieldCheck, ShieldX, Search, Award } from 'lucide-react';
import { ConnectionBanner, AccountSelector } from './Shared';

export default function IdentityTab({ chain }) {
  const { connected, error, isDeployed, accounts, selectedAccount, setSelectedAccount, balance, getContract } = chain;
  const [myIdentity, setMyIdentity] = useState(null);
  const [myCredentials, setMyCredentials] = useState([]);
  const [regForm, setRegForm] = useState({ name: '', metadata: '' });
  const [issueForm, setIssueForm] = useState({ address: '', type: '' });
  const [verifyForm, setVerifyForm] = useState({ address: '', type: '' });
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState(null);

  const identity = getContract('MobilisIdentity');

  const refresh = useCallback(async () => {
    if (!identity || !selectedAccount) return;
    try {
      const id = await identity.identities(selectedAccount.address);
      setMyIdentity(id.registered ? { name: id.name, metadataURI: id.metadataURI, registeredAt: Number(id.registeredAt) * 1000 } : null);
      const creds = await identity.getCredentials(selectedAccount.address);
      setMyCredentials(creds.map((c, i) => ({ index: i, type: c.credentialType, issuer: c.issuer, issuedAt: Number(c.issuedAt) * 1000, revoked: c.revoked })));
    } catch (err) {
      console.error(err);
    }
  }, [identity, selectedAccount]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading('register');
    setMsg(null);
    try {
      const tx = await identity.registerIdentity(regForm.name, regForm.metadata || '');
      await tx.wait();
      setMsg({ type: 'success', text: 'Identity registered!' });
      refresh();
    } catch (err) {
      setMsg({ type: 'error', text: err.reason || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setLoading('issue');
    setMsg(null);
    try {
      const tx = await identity.issueCredential(issueForm.address, issueForm.type);
      await tx.wait();
      setMsg({ type: 'success', text: `Credential "${issueForm.type}" issued` });
      setIssueForm({ address: '', type: '' });
      refresh();
    } catch (err) {
      setMsg({ type: 'error', text: err.reason || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading('verify');
    setVerifyResult(null);
    try {
      const [valid, issuer, issuedAt] = await identity.verifyCredential(verifyForm.address, verifyForm.type);
      setVerifyResult({ valid, issuer, issuedAt: Number(issuedAt) * 1000 });
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
                  {myIdentity.metadataURI && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{myIdentity.metadataURI}</p>}
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Registered {new Date(myIdentity.registeredAt).toLocaleDateString()}</p>

                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Credentials ({myCredentials.length})</p>
                    {myCredentials.length === 0 ? (
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No credentials issued yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {myCredentials.map(c => (
                          <div key={c.index} className="apikey-item">
                            <div className="apikey-item-info">
                              <span className="apikey-item-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Award size={13} color={c.revoked ? 'var(--red)' : 'var(--green)'} /> {c.type}
                              </span>
                              <span className="apikey-item-meta">Issued {new Date(c.issuedAt).toLocaleDateString()} by {c.issuer.slice(0,6)}...{c.issuer.slice(-4)}</span>
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

            {/* Issue credential (deployer account is issuer by default) */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <ShieldCheck size={18} color="var(--accent)" />
                <h3 className="section-title" style={{ margin: 0 }}>Issue Credential</h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Only issuer accounts can do this. Account #0 (deployer) is issuer by default.</p>
              <form onSubmit={handleIssue} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="text" placeholder="Recipient address (0x...)" value={issueForm.address} onChange={e => setIssueForm({ ...issueForm, address: e.target.value })} required style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14 }} />
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
              <input type="text" placeholder="Address to check (0x...)" value={verifyForm.address} onChange={e => setVerifyForm({ ...verifyForm, address: e.target.value })} required />
              <input type="text" placeholder="Credential type" value={verifyForm.type} onChange={e => setVerifyForm({ ...verifyForm, type: e.target.value })} required style={{ maxWidth: 180 }} />
              <button className="btn-primary" disabled={loading === 'verify'}>{loading === 'verify' ? 'Checking...' : 'Verify'}</button>
            </form>

            {verifyResult && (
              <div className={`wallet-msg ${verifyResult.valid ? 'success' : 'error'}`} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                {verifyResult.valid ? <ShieldCheck size={16} /> : <ShieldX size={16} />}
                {verifyResult.valid
                  ? `Valid credential — issued by ${verifyResult.issuer.slice(0,6)}...${verifyResult.issuer.slice(-4)} on ${new Date(verifyResult.issuedAt).toLocaleDateString()}`
                  : 'No valid credential of this type found for this address'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
