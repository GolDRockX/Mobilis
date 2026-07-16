import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import { useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import './Bitcoin.css';

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

export default function Bitcoin() {
  const { onMenuToggle } = useOutletContext();
  const { user, refreshUser } = useAuth();
  const [price, setPrice] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [form, setForm] = useState({ type: 'buy', amount: '' });
  const [tradeMsg, setTradeMsg] = useState(null);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [trades, setTrades] = useState([]);
  const wsRef = useRef(null);

  const fetchTrades = useCallback(() => {
    api.get('/trade/history').then(r => setTrades(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchTrades();
    // Connect to backend WebSocket for live price.
    // Local dev: VITE_WS_URL is unset, so it uses the current host (Vite proxy handles it) — unchanged behavior.
    // Production: set VITE_WS_URL to your deployed backend's wss:// URL if you have one.
    // Browsers block insecure ws:// connections from https:// pages entirely (throws
    // synchronously, not just a connection error), so we must match the page's own
    // protocol here — wss:// when the page is https://, ws:// otherwise.
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = import.meta.env.VITE_WS_URL || `${wsProtocol}//${window.location.host}/ws/btc-price`;

    const startPolling = () => {
      const poll = setInterval(() => {
        fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
          .then(r => r.json())
          .then(d => {
            const p = {
              price: parseFloat(d.lastPrice),
              change: parseFloat(d.priceChangePercent),
              high: parseFloat(d.highPrice),
              low: parseFloat(d.lowPrice),
              volume: parseFloat(d.volume),
              timestamp: Date.now()
            };
            setPrice(p);
            setPriceData(prev => {
              const time = new Date().toLocaleTimeString();
              return [...prev, { time, price: p.price }].slice(-60);
            });
          }).catch(() => {});
      }, 10000);
      return () => clearInterval(poll);
    };

    let ws;
    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;
    } catch {
      // Construction itself can throw synchronously (e.g. insecure ws:// from
      // an https:// page) — fall straight to polling if so.
      return startPolling();
    }

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'PRICE_UPDATE') {
        const p = msg.data;
        setPrice(p);
        setPriceData(prev => {
          const time = new Date(p.timestamp).toLocaleTimeString();
          const next = [...prev, { time, price: p.price }];
          return next.slice(-60); // keep last 60 data points
        });
      }
    };

    ws.onerror = () => startPolling();

    return () => { ws?.close(); };
  }, [fetchTrades]);

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) return;
    if (!price) return setTradeMsg({ type: 'error', text: 'Price not loaded yet' });

    setTradeLoading(true);
    setTradeMsg(null);
    try {
      const res = await api.post('/trade/execute', {
        type: form.type,
        btc_amount: parseFloat(form.amount),
        current_price: price.price
      });
      setTradeMsg({ type: 'success', text: res.data.message });
      setForm({ ...form, amount: '' });
      fetchTrades();
      await refreshUser();
    } catch (err) {
      setTradeMsg({ type: 'error', text: err.response?.data?.message || 'Trade failed' });
    } finally {
      setTradeLoading(false);
    }
  };

  const positive = price?.change >= 0;

  return (
    <div className="page">
      <Header title="Bitcoin Trading" onMenuToggle={onMenuToggle} />
      <div className="page-content">

        {/* Price ticker */}
        <div className="btc-ticker card">
          <div className="btc-ticker-main">
            <span className="btc-symbol">₿ BTC/USDT</span>
            <span className="btc-price">${price ? price.price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}</span>
            {price && (
              <span className={`btc-change ${positive ? 'positive' : 'negative'}`}>
                {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {positive ? '+' : ''}{price.change.toFixed(2)}%
              </span>
            )}
          </div>
          <div className="btc-stats">
            <div className="btc-stat"><span>24h High</span><strong>${price?.high?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '—'}</strong></div>
            <div className="btc-stat"><span>24h Low</span><strong>${price?.low?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '—'}</strong></div>
            <div className="btc-stat"><span>Volume</span><strong>{price?.volume?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '—'}</strong></div>
            <div className="btc-stat live"><Activity size={12} /><span>Live</span></div>
          </div>
        </div>

        <div className="btc-layout">
          {/* Chart */}
          <div className="card btc-chart-card">
            <h3 className="section-title">Live Price Chart</h3>
            {priceData.length < 2 ? (
              <div className="chart-loading"><div className="spinner" /><p>Loading live data...</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke="var(--accent)" strokeWidth={2} fill="url(#priceGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Trade Form */}
          <div className="card btc-trade-card">
            <h3 className="section-title">Place Order</h3>

            <div className="trade-balances">
              <div className="trade-bal"><span>USD</span><strong>${parseFloat(user?.usd_balance || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong></div>
              <div className="trade-bal"><span>BTC</span><strong>{parseFloat(user?.btc_balance || 0).toFixed(6)}</strong></div>
            </div>

            <form onSubmit={handleTrade} className="trade-form">
              <div className="trade-type-toggle">
                <button type="button" className={`trade-type-btn buy ${form.type === 'buy' ? 'active' : ''}`} onClick={() => setForm({ ...form, type: 'buy' })}>Buy BTC</button>
                <button type="button" className={`trade-type-btn sell ${form.type === 'sell' ? 'active' : ''}`} onClick={() => setForm({ ...form, type: 'sell' })}>Sell BTC</button>
              </div>

              <div className="form-group">
                <label>BTC Amount</label>
                <input type="number" step="0.00001" min="0.00001" placeholder="0.001" value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })} required />
              </div>

              {form.amount && price && (
                <div className="trade-estimate">
                  ≈ ${(parseFloat(form.amount) * price.price).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                </div>
              )}

              {tradeMsg && (
                <div className={`trade-msg ${tradeMsg.type}`}>{tradeMsg.text}</div>
              )}

              <button type="submit" className={`trade-submit ${form.type}`} disabled={tradeLoading || !price}>
                {tradeLoading ? 'Processing...' : `${form.type === 'buy' ? 'Buy' : 'Sell'} Bitcoin`}
              </button>
            </form>
          </div>
        </div>

        {/* Trade History */}
        {trades.length > 0 && (
          <div className="card" style={{ marginTop: 24 }}>
            <h3 className="section-title">My Trade History</h3>
            <div className="table-wrap">
              <table className="dash-table">
                <thead><tr><th>Type</th><th>BTC Amount</th><th>USD Amount</th><th>Price</th><th>Date</th></tr></thead>
                <tbody>
                  {trades.map(t => (
                    <tr key={t.id}>
                      <td><span className={`tag-${t.type}`}>{t.type.toUpperCase()}</span></td>
                      <td>{parseFloat(t.btc_amount).toFixed(6)} BTC</td>
                      <td>${parseFloat(t.usd_amount).toLocaleString()}</td>
                      <td>${parseFloat(t.price_at_trade).toLocaleString()}</td>
                      <td>{new Date(t.created_at).toLocaleString()}</td>
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
