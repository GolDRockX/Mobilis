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

// Fetches price via CoinGecko's public API — no key required, no region blocking
// (Binance blocks many server regions including the US, so we use CoinGecko instead).
// Polls every 10s.
const fetchPriceFromBinance = async () => {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
    );
    if (!res.ok) throw new Error(`CoinGecko API returned ${res.status}`);
    const d = await res.json();
    const md = d.market_data;
    lastPrice = {
      price: md.current_price.usd,
      change: md.price_change_percentage_24h,
      high: md.high_24h.usd,
      low: md.low_24h.usd,
      volume: md.total_volume.usd,
      timestamp: Date.now()
    };
  } catch (err) {
    console.error('Failed to fetch BTC price from CoinGecko API:', err.message);
  }
};

// Fetch immediately on startup, then every 10 seconds
fetchPriceFromBinance();
setInterval(fetchPriceFromBinance, 10000);

wss.on('connection', (ws) => {
  if (lastPrice) ws.send(JSON.stringify({ type: 'PRICE_UPDATE', data: lastPrice }));
});

// Middleware
// Supports multiple allowed origins via comma-separated CLIENT_URL (e.g. "http://localhost:5173,https://your-app.vercel.app")
// If CLIENT_URL is unset, defaults to localhost only — local dev behavior is unchanged.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Dashboard routes (JWT auth)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/keys', apiKeyRoutes);

// External API routes (API key auth)
app.use('/api/v1', externalApiRoutes);

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
