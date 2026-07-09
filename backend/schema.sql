CREATE DATABASE IF NOT EXISTS mobilisdb;
USE mobilisdb;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  wallet_address VARCHAR(255) DEFAULT NULL,
  wallet_type VARCHAR(50) DEFAULT NULL,
  btc_balance DECIMAL(18, 8) DEFAULT 0.00000000,
  usd_balance DECIMAL(18, 2) DEFAULT 10000.00,
  avatar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('buy', 'sell') NOT NULL,
  btc_amount DECIMAL(18, 8) NOT NULL,
  usd_amount DECIMAL(18, 2) NOT NULL,
  price_at_trade DECIMAL(18, 2) NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS price_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  target_price DECIMAL(18, 2) NOT NULL,
  direction ENUM('above', 'below') NOT NULL,
  triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  api_key VARCHAR(64) NOT NULL UNIQUE,
  label VARCHAR(100) DEFAULT 'My API Key',
  last_used TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Default admin (password: password)
INSERT INTO users (name, email, password, role, usd_balance)
VALUES (
  'Admin',
  'admin@mobilis.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'admin',
  999999.00
) ON DUPLICATE KEY UPDATE id=id;
