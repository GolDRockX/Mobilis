import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import tradeRoutes from './routes/trade.js';
import apiKeyRoutes from './routes/apiKeys.js';
import externalApiRoutes from './routes/externalApi.js';
import simRoutes from './routes/sim.js';

dotenv.config();

const app = express();
const server = createServer(app);

// WebSocket for live BTC price
const wss = new WebSocketServer({ server, path: '/ws/btc-price' });
let lastPrice = null;

const broadcastPrice = () => {
  if (!lastPrice) return;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'PRICE_UPDATE', data: lastPrice }));
    }
  });
};

setInterval(broadcastPrice, 10000);

// Fetches BTC price with a fallback chain: Kraken (primary, generous free limits)
// → CoinGecko (backup). This protects against any single provider's rate limits
// or regional blocks, which is common on shared-IP free hosting platforms.
// Polls every 30s.

const fetchFromKraken = async () => {
  const res = await fetch('https://api.kraken.com/0/public/Ticker?pair=XBTUSD');
  if (!res.ok) throw new Error(`Kraken API returned ${res.status}`);
  const d = await res.json();
  if (d.error?.length) throw new Error(`Kraken error: ${d.error.join(', ')}`);
  const t = d.result[Object.keys(d.result)[0]];
  const price = parseFloat(t.c[0]);
  const open = parseFloat(t.o);
  return {
    price,
    change: ((price - open) / open) * 100,
    high: parseFloat(t.h[1]),
    low: parseFloat(t.l[1]),
    volume: parseFloat(t.v[1]),
    timestamp: Date.now()
  };
};

const fetchFromCoinGecko = async () => {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false',
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MobilisApp/1.0)', 'Accept': 'application/json' } }
  );
  if (!res.ok) throw new Error(`CoinGecko API returned ${res.status}`);
  const d = await res.json();
  const md = d.market_data;
  return {
    price: md.current_price.usd,
    change: md.price_change_percentage_24h,
    high: md.high_24h.usd,
    low: md.low_24h.usd,
    volume: md.total_volume.usd,
    timestamp: Date.now()
  };
};

const fetchPriceFromBinance = async () => {
  try {
    lastPrice = await fetchFromKraken();
  } catch (krakenErr) {
    console.warn('Kraken price fetch failed, trying CoinGecko:', krakenErr.message);
    try {
      lastPrice = await fetchFromCoinGecko();
    } catch (geckoErr) {
      console.error('All price sources failed — keeping last known price. CoinGecko error:', geckoErr.message);
    }
  }
};

// Fetch immediately on startup, then every 30 seconds
fetchPriceFromBinance();
setInterval(fetchPriceFromBinance, 30000);

wss.on('connection', (ws) => {
  if (lastPrice) ws.send(JSON.stringify({ type: 'PRICE_UPDATE', data: lastPrice }));
});

// Middleware
// Supports multiple allowed origins via comma-separated CLIENT_URL (e.g. "http://localhost:5173,https://your-app.vercel.app")
// If CLIENT_URL is unset, defaults to localhost only — local dev behavior is unchanged.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

// Vercel generates a unique preview URL for every deployment (e.g.
// mobilis-<hash>-<team>.vercel.app), not just the stable production one.
// This regex allows any *.vercel.app subdomain so preview deploys work too,
// in addition to the exact origins listed in CLIENT_URL above.
const vercelPreviewPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

console.log('CORS allowed origins:', JSON.stringify(allowedOrigins), '+ any *.vercel.app preview URL');

app.use(cors({
  origin: (origin, callback) => {
    const isAllowed = !origin || allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin);
    console.log('Incoming request origin:', JSON.stringify(origin), '| allowed?', isAllowed);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Explicit catch-all OPTIONS handler as a safety net, in case something in
// front of the app (proxy/load balancer) needs an explicit route to forward through.
app.options('*', cors());

app.use(express.json());

// Dashboard routes (JWT auth)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/keys', apiKeyRoutes);

// External API routes (API key auth)
app.use('/api/v1', externalApiRoutes);
app.use('/api/sim', simRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// API docs endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    name: 'Mobilis API',
    version: '1.0.0',
    description: 'External API for Mobilis dashboard data',
    authentication: 'Pass your API key as X-API-Key header, or as ?api_key=YOUR_KEY in the URL (works directly in browser)',
    endpoints: [
      { method: 'GET', path: '/api/v1/me', description: 'Your profile info' },
      { method: 'GET', path: '/api/v1/btc-price', description: 'Live BTC price from Binance' },
      { method: 'GET', path: '/api/v1/trades', description: 'Your trade history', params: 'limit, offset, type (buy/sell)' },
      { method: 'GET', path: '/api/v1/wallet', description: 'Your wallet info and balances' },
      { method: 'GET', path: '/api/v1/admin/users', description: 'All users (admin key only)' },
      { method: 'GET', path: '/api/v1/admin/stats', description: 'Platform stats (admin key only)' },
    ]
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Mobilis backend running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}/ws/btc-price`);
  console.log(`🔑 External API: http://localhost:${PORT}/api/v1`);
});
