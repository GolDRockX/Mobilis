// server.mjs — Vercel-native Node.js server entry point.
//
// This runs your backend in the SAME Vercel project as your frontend, on the
// same domain. That means no CORS is needed for normal use (same-origin
// requests), and there's no separate backend host to manage.
//
// This file is ONLY used for Vercel deployment. Your local dev workflow is
// unaffected — `npm run dev` still runs backend/src/index.js separately via
// its own script, exactly as before.
//
// Reuses your existing route files under backend/src/ so there's no
// duplicated logic to maintain in two places.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './backend/src/routes/auth.js';
import adminRoutes from './backend/src/routes/admin.js';
import tradeRoutes from './backend/src/routes/trade.js';
import apiKeyRoutes from './backend/src/routes/apiKeys.js';
import externalApiRoutes from './backend/src/routes/externalApi.js';

dotenv.config();

const app = express();

// CORS — mostly relevant for local dev testing against this same file,
// or if you ever call this API from a different domain. Same-origin
// requests (your Vercel frontend calling its own /api routes) don't need
// CORS at all, but we keep this configured for flexibility.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());
const vercelPreviewPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    const isAllowed = !origin || allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin);
    callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
  },
  credentials: true
}));

app.use(express.json());

// Routes — identical paths to the local backend, so the frontend's existing
// api.js calls (baseURL: '/api') work without any changes.
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/v1', externalApiRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.get('/api/v1', (req, res) => {
  res.json({
    name: 'Mobilis API',
    version: '1.0.0',
    description: 'External API for Mobilis dashboard data',
    authentication: 'Pass your API key as X-API-Key header, or as ?api_key=YOUR_KEY in the URL (works directly in browser)',
    endpoints: [
      { method: 'GET', path: '/api/v1/me', description: 'Your profile info' },
      { method: 'GET', path: '/api/v1/btc-price', description: 'Live BTC price (Kraken primary, CoinGecko fallback)' },
      { method: 'GET', path: '/api/v1/trades', description: 'Your trade history', params: 'limit, offset, type (buy/sell)' },
      { method: 'GET', path: '/api/v1/wallet', description: 'Your wallet info and balances' },
      { method: 'GET', path: '/api/v1/admin/users', description: 'All users (admin key only)' },
      { method: 'GET', path: '/api/v1/admin/stats', description: 'Platform stats (admin key only)' },
    ]
  });
});

// Note: the live BTC price WebSocket (/ws/btc-price) used by the local
// backend is intentionally NOT included here. Vercel Functions don't
// reliably support broadcasting to multiple pinned connections. The
// dashboard's Bitcoin page already has a built-in fallback that polls
// the /api/v1/btc-price REST endpoint directly when a WebSocket isn't
// available, so live pricing still works — just via polling instead of push.

// @vercel/node's classic builder invokes the exported Express app directly
// per request (it doesn't need app.listen() — Vercel handles the server
// lifecycle itself). We only call listen() when running this file directly
// (e.g. `node server.mjs` locally), which this export default doesn't prevent.
export default app;

if (process.env.VERCEL === undefined) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Mobilis unified server running on port ${PORT}`);
  });
}
