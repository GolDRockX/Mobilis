import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, wallet_address, wallet_type, btc_balance, usd_balance, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, wallet_address, wallet_type, btc_balance, usd_balance, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const [trades] = await pool.query('SELECT * FROM trades WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [req.params.id]);
    res.json({ user: rows[0], trades });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role, usd_balance } = req.body;
    await pool.query('UPDATE users SET name = ?, email = ?, role = ?, usd_balance = ? WHERE id = ?', [name, email, role, usd_balance, req.params.id]);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id)
      return res.status(400).json({ message: 'Cannot delete your own account' });
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.params.id]);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users WHERE role = "user"');
    const [[{ totalTrades }]] = await pool.query('SELECT COUNT(*) as totalTrades FROM trades');
    const [[{ totalVolume }]] = await pool.query('SELECT COALESCE(SUM(usd_amount), 0) as totalVolume FROM trades');
    const [recentTrades] = await pool.query('SELECT t.*, u.name, u.email FROM trades t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC LIMIT 10');
    res.json({ totalUsers, totalTrades, totalVolume, recentTrades });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
