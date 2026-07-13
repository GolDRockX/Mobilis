import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/Header/Header';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { TrendingUp, TrendingDown, FlaskConical, RotateCcw, DollarSign, Image, Droplet, Vote, Package, UserCheck } from 'lucide-react';
import { useBlockchain } from '../../blockchain/useBlockchain';
import NFTTab from '../../blockchain/components/NFTTab';
import DeFiTab from '../../blockchain/components/DeFiTab';
import DAOTab from '../../blockchain/components/DAOTab';
import SupplyChainTab from '../../blockchain/components/SupplyChainTab';
import IdentityTab from '../../blockchain/components/IdentityTab';
import './BitcoinTest.css';

const SUB_TABS = [
  { key: 'trading', label: 'BTC Trading', icon: FlaskConical },
  { key: 'nft', label: 'NFT Marketplace', icon: Image },
  { key: 'defi', label: 'DeFi', icon: Droplet },
  { key: 'dao', label: 'DAO Voting', icon: Vote },
  { key: 'supplychain', label: 'Supply Chain', icon: Package },
  { key: 'identity', label: 'Identity', icon: UserCheck },
];

const STARTING_USD = 10000;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-price">${payload[0].value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        <p className="chart-tooltip-time">{payload[0].payload.time}</p>
      </div>
    );
  }
  return null;
};

export default function BitcoinTest() {
  const { onMenuToggle } = useOutletContext();
  const [activeTab, setActiveTab] = useState('trading');
  const chain = useBlockchain();

  // Simulated wallet state (in memory only)
  const [simUsd, setSimUsd] = useState(STARTING_USD);
  const [simBtc, setSimBtc] = useState(0);
  const [trades, setTrades] = useState([]);
  const [price, setPrice] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [form, setForm] = useState({ type: 'buy', amount: '' });
  const [msg, setMsg] = useState(null);
  const [entryValue] = useState(STARTING_USD); // starting portfolio value

  useEffect(() => {
    // Poll Binance public API every 10s
    const fetchPrice = () => {
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
        .then(r => r.json())
        .then(d => {
          const p = {
            price: parseFloat(d.lastPrice),
            change: parseFloat(d.priceChangePercent),
            high: parseFloat(d.highPrice),
            low: parseFloat(d.lowPrice),
            volume: parseFloat(d.volume),
          };
          setPrice(p);
          setPriceData(prev => {
            const time = new Date().toLocaleTimeString();
            return [...prev, { time, price: p.price }].slice(-60);
          });
        }).catch(() => {});
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  const portfolioValue = simUsd + simBtc * (price?.price || 0);
  const pnl = portfolioValue - entryValue;
  const pnlPct = ((pnl / entryValue) * 100).toFixed(2);
  const positive = pnl >= 0;

  const handleTrade = (e) => {
    e.preventDefault();
    if (!price) return setMsg({ type: 'error', text: 'Price not loaded yet' });
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return;
    const usdCost = amount * price.price;

    if (form.type === 'buy') {
      if (usdCost > simUsd) return setMsg({ type: 'error', text: 'Insufficient test USD balance' });
      setSimUsd(prev => prev - usdCost);
      setSimBtc(prev => prev + amount);
    } else {
      if (amount > simBtc) return setMsg({ type: 'error', text: 'Insufficient test BTC balance' });
      setSimBtc(prev => prev - amount);
      setSimUsd(prev => prev + usdCost);
    }

    const trade = {
      id: Date.now(),
      type: form.type,
      btc: amount,
      usd: usdCost,
      price: price.price,
      time: new Date().toLocaleTimeString(),
    };
    setTrades(prev => [trade, ...prev]);
    setMsg({ type: 'success', text: `Test ${form.type.toUpperCase()} executed — ${amount} BTC at $${price.price.toLocaleString()}` });
    setForm({ ...form, amount: '' });
  };

  const reset = () => {
    setSimUsd(STARTING_USD);
    setSimBtc(0);
    setTrades([]);
    setMsg({ type: 'success', text: 'Test account reset to $10,000' });
  };

  return (
    <div className="page">
      <Header title="Bitcoin Test Trading" onMenuToggle={onMenuToggle} />
      <div className="page-content">

        {/* Sub-tab navigation */}
        <div className="chain-tabs">
          {SUB_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`chain-tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'nft' && <NFTTab chain={chain} />}
        {activeTab === 'defi' && <DeFiTab chain={chain} />}
        {activeTab === 'dao' && <DAOTab chain={chain} />}
        {activeTab === 'supplychain' && <SupplyChainTab chain={chain} />}
        {activeTab === 'identity' && <IdentityTab chain={chain} />}

        {activeTab === 'trading' && (
        <>
        <div className="test-banner">
          <FlaskConical size={18} color="var(--accent)" />
          <span>This is a <strong>simulated environment</strong> — no real money or wallet is involved. Practice trading safely.</span>
        </div>

        {/* P&L Summary */}
        <div className="test-pnl-grid">
          <div className="card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-dim)' }}>
              <DollarSign size={20} color="var(--accent)" />
            </div>
            <div>
              <p className="stat-label">Test USD</p>
              <p className="stat-value">${simUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-dim)' }}>
              <TrendingUp size={20} color="var(--accent)" />
            </div>
            <div>
              <p className="stat-label">Test BTC</p>
              <p className="stat-value">{simBtc.toFixed(6)}</p>
              {price && <p className="stat-sub">≈ ${(simBtc * price.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>}
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon" style={{ background: positive ? 'var(--green-dim)' : 'var(--red-dim)' }}>
              {positive ? <TrendingUp size={20} color="var(--green)" /> : <TrendingDown size={20} color="var(--red)" />}
            </div>
            <div>
              <p className="stat-label">Total P&L</p>
              <p className="stat-value" style={{ color: positive ? 'var(--green)' : 'var(--red)' }}>
                {positive ? '+' : ''}${pnl.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
              <p className="stat-sub" style={{ color: positive ? 'var(--green)' : 'var(--red)' }}>
                {positive ? '+' : ''}{pnlPct}%
              </p>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <DollarSign size={20} color="#8b5cf6" />
            </div>
            <div>
              <p className="stat-label">Portfolio Value</p>
              <p className="stat-value">${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
              <p className="stat-sub">Started: ${STARTING_USD.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="btc-layout">
          {/* Chart */}
          <div className="card btc-chart-card">
            <h3 className="section-title">Live BTC Price (10s updates)</h3>
            {priceData.length < 2 ? (
              <div className="chart-loading"><div className="spinner" /><p>Loading live data...</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="testGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={2} fill="url(#testGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {price && (
              <div className="btc-ticker-row">
                <span>Current: <strong>${price.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong></span>
                <span className={price.change >= 0 ? 'positive' : 'negative'}>
                  {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}% today
                </span>
              </div>
            )}
          </div>

          {/* Test Trade Form */}
          <div className="card btc-trade-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 className="section-title" style={{ margin: 0 }}>Place Test Order</h3>
              <button className="btn-ghost reset-btn" onClick={reset}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            <div className="trade-balances">
              <div className="trade-bal"><span>USD</span><strong>${simUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong></div>
              <div className="trade-bal"><span>BTC</span><strong>{simBtc.toFixed(6)}</strong></div>
            </div>

            <form onSubmit={handleTrade} className="trade-form">
              <div className="trade-type-toggle">
                <button type="button" className={`trade-type-btn buy ${form.type === 'buy' ? 'active' : ''}`} onClick={() => setForm({ ...form, type: 'buy' })}>Buy BTC</button>
                <button type="button" className={`trade-type-btn sell ${form.type === 'sell' ? 'active' : ''}`} onClick={() => setForm({ ...form, type: 'sell' })}>Sell BTC</button>
              </div>

              <div className="form-group">
                <label>BTC Amount</label>
                <input type="number" step="0.00001" min="0.00001" placeholder="0.001"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
              </div>

              {form.amount && price && (
                <div className="trade-estimate">
                  ≈ ${(parseFloat(form.amount) * price.price).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                </div>
              )}

              {msg && <div className={`trade-msg ${msg.type}`}>{msg.text}</div>}

              <button type="submit" className={`trade-submit ${form.type}`} disabled={!price}>
                {form.type === 'buy' ? 'Test Buy' : 'Test Sell'}
              </button>
            </form>
          </div>
        </div>

        {/* Test Trade History */}
        {trades.length > 0 && (
          <div className="card" style={{ marginTop: 24 }}>
            <h3 className="section-title">Test Trade History</h3>
            <div className="table-wrap">
              <table className="dash-table">
                <thead>
                  <tr><th>Type</th><th>BTC</th><th>USD</th><th>Price</th><th>Time</th><th>P&L Impact</th></tr>
                </thead>
                <tbody>
                  {trades.map((t, i) => {
                    // Rough P&L: compare sell price vs average buy price
                    const impact = t.type === 'sell'
                      ? ((t.price - (trades.filter(x => x.type === 'buy').reduce((a, b) => a + b.price, 0) / (trades.filter(x => x.type === 'buy').length || 1))) * t.btc)
                      : null;
                    return (
                      <tr key={t.id}>
                        <td><span className={`tag-${t.type}`}>{t.type.toUpperCase()}</span></td>
                        <td>{t.btc.toFixed(6)}</td>
                        <td>${t.usd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                        <td>${t.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                        <td>{t.time}</td>
                        <td>
                          {impact !== null
                            ? <span style={{ color: impact >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                                {impact >= 0 ? '+' : ''}${impact.toFixed(2)}
                              </span>
                            : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
