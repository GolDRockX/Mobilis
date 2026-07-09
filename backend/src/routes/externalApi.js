import express from 'express';
import { authenticateApiKey, adminOnly } from '../middleware/auth.js';
import pool from '../config/db.js';

const router = express.Router();

// All external API routes require API key
router.use(authenticateApiKey);

/**
 * GET /api/v1/trades
 * Returns the authenticated user's trade history
 * Query params: limit (max 100), offset
 */
router.get('/trades', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const type = req.query.type; // optional: 'buy' or 'sell'

    let query = 'SELECT id, type, btc_amount, usd_amount, price_at_trade, status, created_at FROM trades WHERE user_id = ?';
    const params = [req.user.id];

    if (type && ['buy', 'sell'].includes(type)) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM trades WHERE user_id = ?', [req.user.id]);

    res.json({
      success: true,
      data: rows,
      pagination: { total, limit, offset, has_more: offset + limit < total }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/v1/wallet
 * Returns the authenticated user's wallet info
 */
router.get('/wallet', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT wallet_address, wallet_type, btc_balance, usd_balance FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/v1/btc-price
 * Returns the latest BTC price (Kraken primary, CoinGecko fallback)
 */
router.get('/btc-price', async (req, res) => {
  try {
    const krakenRes = await fetch('https://api.kraken.com/0/public/Ticker?pair=XBTUSD');
    if (!krakenRes.ok) throw new Error('Kraken unavailable');
    const kd = await krakenRes.json();
    if (kd.error?.length) throw new Error('Kraken error');
    const t = kd.result[Object.keys(kd.result)[0]];
    const price = parseFloat(t.c[0]);
    const open = parseFloat(t.o);
    return res.json({
      success: true,
      data: {
        price,
        change_24h: ((price - open) / open) * 100,
        high_24h: parseFloat(t.h[1]),
        low_24h: parseFloat(t.l[1]),
        volume_24h: parseFloat(t.v[1]),
        timestamp: new Date().toISOString(),
        source: 'kraken'
      }
    });
  } catch {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false',
        { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MobilisApp/1.0)' } }
      );
      const data = await response.json();
      const md = data.market_data;
      res.json({
        success: true,
        data: {
          price: md.current_price.usd,
          change_24h: md.price_change_percentage_24h,
          high_24h: md.high_24h.usd,
          low_24h: md.low_24h.usd,
          volume_24h: md.total_volume.usd,
          timestamp: new Date().toISOString(),
          source: 'coingecko'
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch BTC price from all sources' });
    }
  }
});

/**
 * GET /api/v1/me
 * Returns the authenticated user's profile
 */
router.get('/me', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, wallet_address, wallet_type, btc_balance, usd_balance, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/v1/admin/users  (admin only)
 * Returns all users - admin API key required
 */
router.get('/admin/users', adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, wallet_address, wallet_type, btc_balance, usd_balance, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/v1/admin/stats  (admin only)
 * Returns platform stats - admin API key required
 */
router.get('/admin/stats', adminOnly, async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users WHERE role = "user"');
    const [[{ totalTrades }]] = await pool.query('SELECT COUNT(*) as totalTrades FROM trades');
    const [[{ totalVolume }]] = await pool.query('SELECT COALESCE(SUM(usd_amount), 0) as totalVolume FROM trades');
    const [[{ totalBtcTraded }]] = await pool.query('SELECT COALESCE(SUM(btc_amount), 0) as totalBtcTraded FROM trades');
    res.json({
      success: true,
      data: { totalUsers, totalTrades, totalVolume: parseFloat(totalVolume), totalBtcTraded: parseFloat(totalBtcTraded) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
