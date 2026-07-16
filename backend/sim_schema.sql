-- Simulated Web3 Sandbox tables — pure database simulation, no real blockchain.
-- Run this once in phpMyAdmin (local) AND in TiDB Cloud's SQL editor (production).

USE mobilisdb;

-- 5 fixed demo "accounts" that simulate different market participants.
-- Shared across all real dashboard users — this is a public sandbox, like the
-- old shared local Hardhat accounts were.
CREATE TABLE IF NOT EXISTS sim_accounts (
  id INT PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  eth_balance DECIMAL(30,18) NOT NULL DEFAULT 100.000000000000000000
);
INSERT INTO sim_accounts (id, label, eth_balance) VALUES
  (0, 'Account #0', 100),
  (1, 'Account #1', 100),
  (2, 'Account #2', 100),
  (3, 'Account #3', 100),
  (4, 'Account #4', 100)
ON DUPLICATE KEY UPDATE id = id;

-- ── NFT Marketplace ──
CREATE TABLE IF NOT EXISTS sim_nfts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  owner_account_id INT NOT NULL,
  minted_by_account_id INT NOT NULL,
  listed_price DECIMAL(30,18) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── DeFi ──
CREATE TABLE IF NOT EXISTS sim_defi_balances (
  account_id INT PRIMARY KEY,
  mtt_balance DECIMAL(30,18) NOT NULL DEFAULT 0,
  deposit_principal DECIMAL(30,18) NOT NULL DEFAULT 0,
  deposit_last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  borrow_principal DECIMAL(30,18) NOT NULL DEFAULT 0,
  borrow_last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO sim_defi_balances (account_id) VALUES (0),(1),(2),(3),(4)
ON DUPLICATE KEY UPDATE account_id = account_id;

CREATE TABLE IF NOT EXISTS sim_defi_pool (
  id INT PRIMARY KEY DEFAULT 1,
  liquidity DECIMAL(30,18) NOT NULL DEFAULT 50000
);
INSERT INTO sim_defi_pool (id, liquidity) VALUES (1, 50000)
ON DUPLICATE KEY UPDATE id = id;

-- ── DAO Voting ──
CREATE TABLE IF NOT EXISTS sim_dao_proposals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  proposer_account_id INT NOT NULL,
  votes_for INT NOT NULL DEFAULT 0,
  votes_against INT NOT NULL DEFAULT 0,
  deadline TIMESTAMP NOT NULL,
  executed BOOLEAN NOT NULL DEFAULT FALSE,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sim_dao_votes (
  proposal_id INT NOT NULL,
  account_id INT NOT NULL,
  support BOOLEAN NOT NULL,
  PRIMARY KEY (proposal_id, account_id)
);

-- ── Supply Chain ──
CREATE TABLE IF NOT EXISTS sim_supply_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  current_holder_account_id INT NOT NULL,
  origin_creator_account_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sim_supply_checkpoints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  status VARCHAR(100) NOT NULL,
  location VARCHAR(150) DEFAULT '',
  recorded_by_account_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Identity ──
CREATE TABLE IF NOT EXISTS sim_identities (
  account_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  metadata_uri VARCHAR(255) DEFAULT '',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sim_credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  credential_type VARCHAR(100) NOT NULL,
  issuer_account_id INT NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS sim_issuers (
  account_id INT PRIMARY KEY
);
INSERT INTO sim_issuers (account_id) VALUES (0)
ON DUPLICATE KEY UPDATE account_id = account_id;
