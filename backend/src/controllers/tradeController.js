import pool from '../config/db.js';

export const getTradeHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;
    const [rows] = await pool.query(
      'SELECT * FROM trades WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [req.user.id, limit, offset]
    );
    res.json({ data: rows, limit, offset });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const executeTrade = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { type, btc_amount, current_price } = req.body;
    if (!type || !btc_amount || !current_price)
      return res.status(400).json({ message: 'type, btc_amount, and current_price are required' });
    const amount = parseFloat(btc_amount);
    const price = parseFloat(current_price);
    const usd_amount = parseFloat((amount * price).toFixed(2));
    await conn.beginTransaction();
    const [userRows] = await conn.query('SELECT usd_balance, btc_balance FROM users WHERE id = ? FOR UPDATE', [req.user.id]);
    const user = userRows[0];
    if (type === 'buy') {
      if (parseFloat(user.usd_balance) < usd_amount)
        return conn.rollback().then(() => res.status(400).json({ message: 'Insufficient USD balance' }));
      await conn.query('UPDATE users SET usd_balance = usd_balance - ?, btc_balance = btc_balance + ? WHERE id = ?', [usd_amount, amount, req.user.id]);
    } else if (type === 'sell') {
      if (parseFloat(user.btc_balance) < amount)
        return conn.rollback().then(() => res.status(400).json({ message: 'Insufficient BTC balance' }));
      await conn.query('UPDATE users SET btc_balance = btc_balance - ?, usd_balance = usd_balance + ? WHERE id = ?', [amount, usd_amount, req.user.id]);
    } else {
      return conn.rollback().then(() => res.status(400).json({ message: 'Invalid trade type' }));
    }
    const [tradeResult] = await conn.query(
      'INSERT INTO trades (user_id, type, btc_amount, usd_amount, price_at_trade, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, type, amount, usd_amount, price, 'completed']
    );
    await conn.commit();
    const [updatedUser] = await conn.query('SELECT usd_balance, btc_balance FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: `${type.toUpperCase()} order executed`, trade_id: tradeResult.insertId, usd_balance: updatedUser[0].usd_balance, btc_balance: updatedUser[0].btc_balance });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Trade failed', error: err.message });
  } finally {
    conn.release();
  }
};

export const connectWallet = async (req, res) => {
  try {
    const { wallet_address, wallet_type } = req.body;
    if (!wallet_address || !wallet_type)
      return res.status(400).json({ message: 'wallet_address and wallet_type required' });
    await pool.query('UPDATE users SET wallet_address = ?, wallet_type = ? WHERE id = ?', [wallet_address, wallet_type, req.user.id]);
    res.json({ message: 'Wallet connected', wallet_address, wallet_type });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const disconnectWallet = async (req, res) => {
  try {
    await pool.query('UPDATE users SET wallet_address = NULL, wallet_type = NULL WHERE id = ?', [req.user.id]);
    res.json({ message: 'Wallet disconnected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
