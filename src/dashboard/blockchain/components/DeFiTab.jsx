import { useState, useEffect, useCallback } from 'react';
import { Droplet, TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { SimAccountSelector } from './SimShared';
import api from '../../services/api';

export default function DeFiTab() {
  const [accounts, setAccounts] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [state, setState] = useState({ mtt_balance: 0, deposit_balance: 0, borrow_balance: 0, pool_liquidity: 0 });
  const [amounts, setAmounts] = useState({ deposit: '', withdraw: '', borrow: '', repay: '', faucet: '100' });
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [accRes, stateRes] = await Promise.all([
        api.get('/sim/accounts'),
        api.get('/sim/defi/state', { params: { account_id: selectedId } }),
      ]);
      setAccounts(accRes.data);
      setState(stateRes.data);
    } catch (err) {
      console.error(err);
    }
  }, [selectedId]);

  useEffect(() => { refresh(); }, [refresh]);

  const runAction = async (key, fn) => {
    setLoading(key);
    setMsg(null);
    try {
      const res = await fn();
      setMsg({ type: 'success', text: res.data.message });
      await refresh();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleFaucet = () => runAction('faucet', () => api.post('/sim/defi/faucet', { account_id: selectedId, amount: parseFloat(amounts.faucet || '100') }));
  const handleDeposit = () => runAction('deposit', () => api.post('/sim/defi/deposit', { account_id: selectedId, amount: parseFloat(amounts.deposit) })).then(() => setAmounts(a => ({ ...a, deposit: '' })));
  const handleWithdraw = () => runAction('withdraw', () => api.post('/sim/defi/withdraw', { account_id: selectedId, amount: parseFloat(amounts.withdraw) })).then(() => setAmounts(a => ({ ...a, withdraw: '' })));
  const handleBorrow = () => runAction('borrow', () => api.post('/sim/defi/borrow', { account_id: selectedId, amount: parseFloat(amounts.borrow) })).then(() => setAmounts(a => ({ ...a, borrow: '' })));
  const handleRepay = () => runAction('repay', () => api.post('/sim/defi/repay', { account_id: selectedId, amount: parseFloat(amounts.repay) })).then(() => setAmounts(a => ({ ...a, repay: '' })));

  return (
    <div>
      <SimAccountSelector accounts={accounts} selectedId={selectedId} setSelectedId={setSelectedId} />

      <div className="test-pnl-grid" style={{ marginTop: 16 }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-dim)' }}><Coins size={20} color="var(--accent)" /></div>
          <div><p className="stat-label">MTT Balance</p><p className="stat-value">{parseFloat(state.mtt_balance).toFixed(2)}</p></div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--green-dim)' }}><TrendingUp size={20} color="var(--green)" /></div>
          <div><p className="stat-label">Deposited (5% APR)</p><p className="stat-value">{parseFloat(state.deposit_balance).toFixed(4)}</p></div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--red-dim)' }}><TrendingDown size={20} color="var(--red)" /></div>
          <div><p className="stat-label">Borrowed (10% APR)</p><p className="stat-value">{parseFloat(state.borrow_balance).toFixed(4)}</p></div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)' }}><Droplet size={20} color="#8b5cf6" /></div>
          <div><p className="stat-label">Pool Liquidity</p><p className="stat-value">{parseFloat(state.pool_liquidity).toFixed(0)}</p></div>
        </div>
      </div>

      {msg && <div className={`wallet-msg ${msg.type}`} style={{ marginTop: 12 }}>{msg.text}</div>}

      <div className="btc-layout" style={{ marginTop: 20 }}>
        <div className="card">
          <h3 className="section-title">Faucet</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Get free test MTT tokens (max 10,000 per call)</p>
          <div className="chain-inline-form">
            <input type="number" value={amounts.faucet} onChange={e => setAmounts({ ...amounts, faucet: e.target.value })} />
            <button className="btn-primary" onClick={handleFaucet} disabled={loading === 'faucet'}>{loading === 'faucet' ? 'Requesting...' : 'Get MTT'}</button>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Supply (Earn 5% APR)</h3>
          <div className="chain-inline-form" style={{ marginBottom: 10 }}>
            <input type="number" placeholder="Amount to deposit" value={amounts.deposit} onChange={e => setAmounts({ ...amounts, deposit: e.target.value })} />
            <button className="trade-submit buy" style={{ padding: '10px 16px' }} onClick={handleDeposit} disabled={loading === 'deposit' || !amounts.deposit}>{loading === 'deposit' ? 'Depositing...' : 'Deposit'}</button>
          </div>
          <div className="chain-inline-form">
            <input type="number" placeholder="Amount to withdraw" value={amounts.withdraw} onChange={e => setAmounts({ ...amounts, withdraw: e.target.value })} />
            <button className="btn-ghost" style={{ padding: '10px 16px' }} onClick={handleWithdraw} disabled={loading === 'withdraw' || !amounts.withdraw}>{loading === 'withdraw' ? 'Withdrawing...' : 'Withdraw'}</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="section-title">Borrow (10% APR)</h3>
        <div className="chain-inline-form" style={{ marginBottom: 10 }}>
          <input type="number" placeholder="Amount to borrow" value={amounts.borrow} onChange={e => setAmounts({ ...amounts, borrow: e.target.value })} />
          <button className="trade-submit sell" style={{ padding: '10px 16px' }} onClick={handleBorrow} disabled={loading === 'borrow' || !amounts.borrow}>{loading === 'borrow' ? 'Borrowing...' : 'Borrow'}</button>
        </div>
        <div className="chain-inline-form">
          <input type="number" placeholder="Amount to repay" value={amounts.repay} onChange={e => setAmounts({ ...amounts, repay: e.target.value })} />
          <button className="btn-ghost" style={{ padding: '10px 16px' }} onClick={handleRepay} disabled={loading === 'repay' || !amounts.repay}>{loading === 'repay' ? 'Repaying...' : 'Repay'}</button>
        </div>
      </div>
    </div>
  );
}
