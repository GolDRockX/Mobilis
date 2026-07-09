import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// Generate a new API key
export const generateApiKey = async (req, res) => {
  try {
    const { label } = req.body;
    // Check how many keys this user has (max 5)
    const [existing] = await pool.query('SELECT COUNT(*) as count FROM api_keys WHERE user_id = ?', [req.user.id]);
    if (existing[0].count >= 5) {
      return res.status(400).json({ message: 'Maximum 5 API keys allowed. Delete an existing one first.' });
    }
    const apiKey = `mbls_${uuidv4().replace(/-/g, '')}`;
    await pool.query(
      'INSERT INTO api_keys (user_id, api_key, label) VALUES (?, ?, ?)',
      [req.user.id, apiKey, label || 'My API Key']
    );
    res.status(201).json({
      message: 'API key generated. Save it now — it will not be shown again in full.',
      api_key: apiKey,
      label: label || 'My API Key'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List all API keys for user (masked)
export const listApiKeys = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, label, CONCAT(LEFT(api_key, 12), "...", RIGHT(api_key, 4)) as api_key_masked, last_used, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete an API key
export const deleteApiKey = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM api_keys WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'API key not found' });
    res.json({ message: 'API key deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
