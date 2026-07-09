import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// JWT auth (for dashboard UI)
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// API key auth (for external API access) — accepts header OR ?api_key= query param
export const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  if (!apiKey) {
    return res.status(401).json({ message: 'API key required. Pass it as X-API-Key header or ?api_key= query param.' });
  }
  try {
    const [rows] = await pool.query(
      'SELECT ak.*, u.id as user_id, u.name, u.email, u.role FROM api_keys ak JOIN users u ON ak.user_id = u.id WHERE ak.api_key = ?',
      [apiKey]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid API key' });
    }
    // Update last_used
    await pool.query('UPDATE api_keys SET last_used = NOW() WHERE api_key = ?', [apiKey]);
    req.user = { id: rows[0].user_id, name: rows[0].name, email: rows[0].email, role: rows[0].role };
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
