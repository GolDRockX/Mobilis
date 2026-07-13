import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Droplet, TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { ConnectionBanner, AccountSelector } from './Shared';

export default function DeFiTab({ chain }) {
  const { connected, error, isDeployed, accounts, selectedAccount, setSelectedAccount, balance, getContract } = chain;
  const [tokenBalance, setTokenBalance] = useState('0');
  const [depositBalance, setDepositBalance] = useState('0');
  const [borrowBalance, setBorrowBalance] = useState('0');
  const [poolLiquidity, setPoolLiquidity] = useState('0');
  const [amounts, setAmounts] = useState({ deposit: '', withdraw: '', borrow: '', repay: '', faucet: '100' });
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState(null);

  const token = getContract('MobilisToken');
  const pool = getContract('MobilisLendingPool');

  const refresh = useCallback(async () => {
    if (!token || !pool || !selectedAccount) return;
    try {
      const [tb, db, bb, pl] = await Promise.all([
        token.balanceOf(selectedAccount.address),
        pool.getDepositBalance(selectedAccount.address),
        pool.getBorrowBalance(selectedAccount.address),
        pool.poolLiquidity(),
      ]);
      setTokenBalance(ethers.formatUnits(tb, 18));
      setDepositBalance(ethers.formatUnits(db, 18));
      setBorrowBalance(ethers.formatUnits(bb, 18));
      setPoolLiquidity(ethers.formatUnits(pl, 18));
    } catch (err) {
      console.error(err);
    }
  }, [token, pool, selectedAccount]);

  useEffect(() => { refresh(); }, [refresh]);

  const runAction = async (key, fn) => {
    setLoading(key);
    setMsg(null);
    try {
      await fn();
      await refresh();
    } catch (err) {
      setMsg({ type: 'error', text: err.reason || err.message });
    } finally {
      setLoading('');
    }
  };

  const handleFaucet = () => runAction('faucet', async () => {
    const tx = await token.faucet(ethers.parseUnits(amounts.faucet || '100', 18));
    await tx.wait();
    setMsg({ type: 'success', text: `Received ${amounts.faucet} MTT from faucet` });
  });

  const handleDeposit = () => runAction('deposit', async () => {
    const amt = ethers.parseUnits(amounts.deposit, 18);
    const approveTx = await token.approve(await pool.getAddress(), amt);
    await approveTx.wait();
    const tx = await pool.deposit(amt);
    await tx.wait();
    setMsg({ type: 'success', text: `Deposited ${amounts.deposit} MTT — earning 5% APR` });
    setAmounts({ ...amounts, deposit: '' });
  });

  const handleWithdraw = () => runAction('withdraw', async () => {
    const tx = await pool.withdraw(ethers.parseUnits(amounts.withdraw, 18));
    await tx.wait();
    setMsg({ type: 'success', text: `Withdrew ${amounts.withdraw} MTT` });
    setAmounts({ ...amounts, withdraw: '' });
  });

  const handleBorrow = () => runAction('borrow', async () => {
    const tx = await pool.borrow(ethers.parseUnits(amounts.borrow, 18));
    await tx.wait();
    setMsg({ type: 'success', text: `Borrowed ${amounts.borrow} MTT — accruing 10% APR` });
    setAmounts({ ...amounts, borrow: '' });
  });

  const handleRepay = () => runAction('repay', async () => {
    const amt = ethers.parseUnits(amounts.repay, 18);
    const approveTx = await token.approve(await pool.getAddress(), amt);
    await approveTx.wait();
    const tx = await pool.repay(amt);
    await tx.wait();
    setMsg({ type: 'success', text: `Repaid ${amounts.repay} MTT` });
    setAmounts({ ...amounts, repay: '' });
  });

  return (
    <div>
      <ConnectionBanner connected={connected} error={error} isDeployed={isDeployed} />
      {connected && isDeployed && (
        <>
          <AccountSelector accounts={accounts} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} balance={balance} />

          <div className="test-pnl-grid" style={{ marginTop: 16 }}>
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'var(--accent-dim)' }}><Coins size={20} color="var(--accent)" /></div>
              <div><p className="stat-label">MTT Balance</p><p className="stat-value">{parseFloat(tokenBalance).toFixed(2)}</p></div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'var(--green-dim)' }}><TrendingUp size={20} color="var(--green)" /></div>
              <div><p className="stat-label">Deposited (5% APR)</p><p className="stat-value">{parseFloat(depositBalance).toFixed(4)}</p></div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'var(--red-dim)' }}><TrendingDown size={20} color="var(--red)" /></div>
              <div><p className="stat-label">Borrowed (10% APR)</p><p className="stat-value">{parseFloat(borrowBalance).toFixed(4)}</p></div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)' }}><Droplet size={20} color="#8b5cf6" /></div>
              <div><p className="stat-label">Pool Liquidity</p><p className="stat-value">{parseFloat(poolLiquidity).toFixed(0)}</p></div>
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
        </>
      )}
    </div>
  );
}
