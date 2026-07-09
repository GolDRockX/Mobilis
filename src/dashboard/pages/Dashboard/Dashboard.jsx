import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import { useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import { TrendingUp, DollarSign, Bitcoin, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { onMenuToggle } = useOutletContext();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [btcPrice, setBtcPrice] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/admin/stats').then(res => setStats(res.data)).catch(() => {});
    }
    // Quick fetch of BTC price from Binance public API
    fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
      .then(r => r.json())
      .then(d => setBtcPrice({ price: parseFloat(d.lastPrice), change: parseFloat(d.priceChangePercent) }))
      .catch(() => {});
  }, [user]);

  const positive = btcPrice?.change >= 0;

  return (
    <div className="page">
      <Header title="Dashboard" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <div className="dash-grid">
          <div className="card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-dim)' }}>
              <Bitcoin size={20} color="var(--accent)" />
            </div>
            <div>
              <p className="stat-label">BTC Price</p>
              <p className="stat-value">${btcPrice ? btcPrice.price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}</p>
              {btcPrice && (
                <span className={`stat-change ${positive ? 'positive' : 'negative'}`}>
                  {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(btcPrice.change).toFixed(2)}% today
                </span>
              )}
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-icon" style={{ background: 'var(--green-dim)' }}>
              <DollarSign size={20} color="var(--green)" />
            </div>
            <div>
              <p className="stat-label">USD Balance</p>
              <p className="stat-value">${parseFloat(user?.usd_balance || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-dim)' }}>
              <TrendingUp size={20} color="var(--accent)" />
            </div>
            <div>
              <p className="stat-label">BTC Balance</p>
              <p className="stat-value">{parseFloat(user?.btc_balance || 0).toFixed(8)} BTC</p>
              {btcPrice && <p className="stat-sub">≈ ${(parseFloat(user?.btc_balance || 0) * btcPrice.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>}
            </div>
          </div>

          {user?.role === 'admin' && stats && (
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <TrendingUp size={20} color="#8b5cf6" />
              </div>
              <div>
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{stats.totalUsers}</p>
                <p className="stat-sub">{stats.totalTrades} total trades</p>
              </div>
            </div>
          )}
        </div>

        {user?.wallet_address && (
          <div className="card wallet-banner">
            <p className="wallet-label">Connected Wallet ({user.wallet_type})</p>
            <p className="wallet-addr">{user.wallet_address}</p>
          </div>
        )}

        {user?.role === 'admin' && stats?.recentTrades?.length > 0 && (
          <div className="card" style={{ marginTop: 24 }}>
            <h3 className="section-title">Recent Trades</h3>
            <div className="table-wrap">
              <table className="dash-table">
                <thead>
                  <tr><th>User</th><th>Type</th><th>BTC</th><th>USD</th><th>Price</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {stats.recentTrades.map(t => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td><span className={`tag-${t.type}`}>{t.type.toUpperCase()}</span></td>
                      <td>{parseFloat(t.btc_amount).toFixed(6)}</td>
                      <td>${parseFloat(t.usd_amount).toLocaleString()}</td>
                      <td>${parseFloat(t.price_at_trade).toLocaleString()}</td>
                      <td>{new Date(t.created_at).toLocaleDateString()}</td>
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
