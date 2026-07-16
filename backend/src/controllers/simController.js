import pool from '../config/db.js';

const SUPPLY_APR_BPS = 500;   // 5.00%
const BORROW_APR_BPS = 1000;  // 10.00%
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
const VOTING_PERIOD_SECONDS = 5 * 60; // 5 minutes, same as the old contract

const accrue = (principal, lastUpdated, aprBps) => {
  if (!principal || principal <= 0) return 0;
  const elapsed = (Date.now() - new Date(lastUpdated).getTime()) / 1000;
  return (principal * aprBps * elapsed) / (10000 * SECONDS_PER_YEAR);
};

// ── Accounts ──
export const getAccounts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sim_accounts ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── NFT Marketplace ──
export const getNfts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sim_nfts ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const mintNft = async (req, res) => {
  try {
    const { account_id, name } = req.body;
    if (account_id === undefined || !name?.trim()) return res.status(400).json({ message: 'account_id and name required' });
    const [result] = await pool.query(
      'INSERT INTO sim_nfts (name, owner_account_id, minted_by_account_id) VALUES (?, ?, ?)',
      [name.trim(), account_id, account_id]
    );
    res.status(201).json({ message: 'Minted', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listNft = async (req, res) => {
  try {
    const { account_id, token_id, price } = req.body;
    const [rows] = await pool.query('SELECT * FROM sim_nfts WHERE id = ?', [token_id]);
    if (!rows.length) return res.status(404).json({ message: 'NFT not found' });
    if (rows[0].owner_account_id !== account_id) return res.status(403).json({ message: 'Not the owner' });
    await pool.query('UPDATE sim_nfts SET listed_price = ? WHERE id = ?', [price, token_id]);
    res.json({ message: 'Listed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelListing = async (req, res) => {
  try {
    const { account_id, token_id } = req.body;
    const [rows] = await pool.query('SELECT * FROM sim_nfts WHERE id = ?', [token_id]);
    if (!rows.length) return res.status(404).json({ message: 'NFT not found' });
    if (rows[0].owner_account_id !== account_id) return res.status(403).json({ message: 'Not the owner' });
    await pool.query('UPDATE sim_nfts SET listed_price = NULL WHERE id = ?', [token_id]);
    res.json({ message: 'Listing cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const buyNft = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { account_id, token_id } = req.body;
    await conn.beginTransaction();

    const [nftRows] = await conn.query('SELECT * FROM sim_nfts WHERE id = ? FOR UPDATE', [token_id]);
    if (!nftRows.length || nftRows[0].listed_price === null) {
      await conn.rollback();
      return res.status(400).json({ message: 'Not listed' });
    }
    const nft = nftRows[0];
    const price = parseFloat(nft.listed_price);

    const [buyerRows] = await conn.query('SELECT * FROM sim_accounts WHERE id = ? FOR UPDATE', [account_id]);
    if (parseFloat(buyerRows[0].eth_balance) < price) {
      await conn.rollback();
      return res.status(400).json({ message: 'Insufficient ETH balance' });
    }

    await conn.query('UPDATE sim_accounts SET eth_balance = eth_balance - ? WHERE id = ?', [price, account_id]);
    await conn.query('UPDATE sim_accounts SET eth_balance = eth_balance + ? WHERE id = ?', [price, nft.owner_account_id]);
    await conn.query('UPDATE sim_nfts SET owner_account_id = ?, listed_price = NULL WHERE id = ?', [account_id, token_id]);

    await conn.commit();
    res.json({ message: 'Bought successfully' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

// ── DeFi ──
export const getDefiState = async (req, res) => {
  try {
    const accountId = parseInt(req.query.account_id);
    const [[bal]] = await pool.query('SELECT * FROM sim_defi_balances WHERE account_id = ?', [accountId]);
    const [[pool_]] = await pool.query('SELECT * FROM sim_defi_pool WHERE id = 1');

    const depositBalance = parseFloat(bal.deposit_principal) + accrue(parseFloat(bal.deposit_principal), bal.deposit_last_updated, SUPPLY_APR_BPS);
    const borrowBalance = parseFloat(bal.borrow_principal) + accrue(parseFloat(bal.borrow_principal), bal.borrow_last_updated, BORROW_APR_BPS);

    res.json({
      mtt_balance: parseFloat(bal.mtt_balance),
      deposit_balance: depositBalance,
      borrow_balance: borrowBalance,
      pool_liquidity: parseFloat(pool_.liquidity),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const faucet = async (req, res) => {
  try {
    const { account_id, amount } = req.body;
    const amt = Math.min(parseFloat(amount) || 0, 10000);
    if (amt <= 0) return res.status(400).json({ message: 'Invalid amount' });
    await pool.query('UPDATE sim_defi_balances SET mtt_balance = mtt_balance + ? WHERE account_id = ?', [amt, account_id]);
    res.json({ message: `Received ${amt} MTT` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deposit = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { account_id, amount } = req.body;
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return res.status(400).json({ message: 'Invalid amount' });

    await conn.beginTransaction();
    const [[bal]] = await conn.query('SELECT * FROM sim_defi_balances WHERE account_id = ? FOR UPDATE', [account_id]);
    if (parseFloat(bal.mtt_balance) < amt) {
      await conn.rollback();
      return res.status(400).json({ message: 'Insufficient MTT balance' });
    }
    const interest = accrue(parseFloat(bal.deposit_principal), bal.deposit_last_updated, SUPPLY_APR_BPS);
    const newPrincipal = parseFloat(bal.deposit_principal) + interest + amt;

    await conn.query(
      'UPDATE sim_defi_balances SET mtt_balance = mtt_balance - ?, deposit_principal = ?, deposit_last_updated = NOW() WHERE account_id = ?',
      [amt, newPrincipal, account_id]
    );
    await conn.query('UPDATE sim_defi_pool SET liquidity = liquidity + ? WHERE id = 1', [amt]);
    await conn.commit();
    res.json({ message: `Deposited ${amt} MTT` });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

export const withdraw = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { account_id, amount } = req.body;
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return res.status(400).json({ message: 'Invalid amount' });

    await conn.beginTransaction();
    const [[bal]] = await conn.query('SELECT * FROM sim_defi_balances WHERE account_id = ? FOR UPDATE', [account_id]);
    const interest = accrue(parseFloat(bal.deposit_principal), bal.deposit_last_updated, SUPPLY_APR_BPS);
    const available = parseFloat(bal.deposit_principal) + interest;
    if (amt > available) {
      await conn.rollback();
      return res.status(400).json({ message: 'Insufficient deposit balance' });
    }

    await conn.query(
      'UPDATE sim_defi_balances SET mtt_balance = mtt_balance + ?, deposit_principal = ?, deposit_last_updated = NOW() WHERE account_id = ?',
      [amt, available - amt, account_id]
    );
    await conn.query('UPDATE sim_defi_pool SET liquidity = liquidity - ? WHERE id = 1', [amt]);
    await conn.commit();
    res.json({ message: `Withdrew ${amt} MTT` });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

export const borrow = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { account_id, amount } = req.body;
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return res.status(400).json({ message: 'Invalid amount' });

    await conn.beginTransaction();
    const [[pool_]] = await conn.query('SELECT * FROM sim_defi_pool WHERE id = 1 FOR UPDATE');
    if (parseFloat(pool_.liquidity) < amt) {
      await conn.rollback();
      return res.status(400).json({ message: 'Insufficient pool liquidity' });
    }

    const [[bal]] = await conn.query('SELECT * FROM sim_defi_balances WHERE account_id = ? FOR UPDATE', [account_id]);
    const interest = accrue(parseFloat(bal.borrow_principal), bal.borrow_last_updated, BORROW_APR_BPS);
    const newPrincipal = parseFloat(bal.borrow_principal) + interest + amt;

    await conn.query(
      'UPDATE sim_defi_balances SET mtt_balance = mtt_balance + ?, borrow_principal = ?, borrow_last_updated = NOW() WHERE account_id = ?',
      [amt, newPrincipal, account_id]
    );
    await conn.query('UPDATE sim_defi_pool SET liquidity = liquidity - ? WHERE id = 1', [amt]);
    await conn.commit();
    res.json({ message: `Borrowed ${amt} MTT` });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

export const repay = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { account_id, amount } = req.body;
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return res.status(400).json({ message: 'Invalid amount' });

    await conn.beginTransaction();
    const [[bal]] = await conn.query('SELECT * FROM sim_defi_balances WHERE account_id = ? FOR UPDATE', [account_id]);
    const interest = accrue(parseFloat(bal.borrow_principal), bal.borrow_last_updated, BORROW_APR_BPS);
    const owed = parseFloat(bal.borrow_principal) + interest;
    const payAmount = Math.min(amt, owed);

    if (parseFloat(bal.mtt_balance) < payAmount) {
      await conn.rollback();
      return res.status(400).json({ message: 'Insufficient MTT balance' });
    }

    await conn.query(
      'UPDATE sim_defi_balances SET mtt_balance = mtt_balance - ?, borrow_principal = ?, borrow_last_updated = NOW() WHERE account_id = ?',
      [payAmount, owed - payAmount, account_id]
    );
    await conn.query('UPDATE sim_defi_pool SET liquidity = liquidity + ? WHERE id = 1', [payAmount]);
    await conn.commit();
    res.json({ message: `Repaid ${payAmount.toFixed(4)} MTT` });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

// ── DAO Voting ──
export const getProposals = async (req, res) => {
  try {
    const accountId = parseInt(req.query.account_id);
    const [proposals] = await pool.query('SELECT * FROM sim_dao_proposals ORDER BY id DESC');
    const [votes] = await pool.query('SELECT proposal_id FROM sim_dao_votes WHERE account_id = ?', [accountId]);
    const votedIds = new Set(votes.map(v => v.proposal_id));
    res.json(proposals.map(p => ({ ...p, voted: votedIds.has(p.id) })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProposal = async (req, res) => {
  try {
    const { account_id, title, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Title required' });
    const [result] = await pool.query(
      'INSERT INTO sim_dao_proposals (title, description, proposer_account_id, deadline) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))',
      [title.trim(), description || '', account_id, VOTING_PERIOD_SECONDS]
    );
    res.status(201).json({ message: 'Proposal created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const voteProposal = async (req, res) => {
  try {
    const { account_id, proposal_id, support } = req.body;
    const [[proposal]] = await pool.query('SELECT * FROM sim_dao_proposals WHERE id = ?', [proposal_id]);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    if (new Date(proposal.deadline) < new Date()) return res.status(400).json({ message: 'Voting period ended' });

    const [existing] = await pool.query('SELECT * FROM sim_dao_votes WHERE proposal_id = ? AND account_id = ?', [proposal_id, account_id]);
    if (existing.length) return res.status(400).json({ message: 'Already voted' });

    await pool.query('INSERT INTO sim_dao_votes (proposal_id, account_id, support) VALUES (?, ?, ?)', [proposal_id, account_id, support]);
    await pool.query(
      support ? 'UPDATE sim_dao_proposals SET votes_for = votes_for + 1 WHERE id = ?' : 'UPDATE sim_dao_proposals SET votes_against = votes_against + 1 WHERE id = ?',
      [proposal_id]
    );
    res.json({ message: `Voted ${support ? 'YES' : 'NO'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const executeProposal = async (req, res) => {
  try {
    const { proposal_id } = req.body;
    const [[proposal]] = await pool.query('SELECT * FROM sim_dao_proposals WHERE id = ?', [proposal_id]);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    if (new Date(proposal.deadline) > new Date()) return res.status(400).json({ message: 'Voting still active' });
    if (proposal.executed) return res.status(400).json({ message: 'Already executed' });

    const passed = proposal.votes_for > proposal.votes_against;
    await pool.query('UPDATE sim_dao_proposals SET executed = TRUE, passed = ? WHERE id = ?', [passed, proposal_id]);
    res.json({ message: `Proposal ${passed ? 'passed' : 'rejected'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Supply Chain ──
export const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sim_supply_products ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductHistory = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sim_supply_checkpoints WHERE product_id = ? ORDER BY id ASC', [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { account_id, name, location } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name required' });
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO sim_supply_products (name, current_holder_account_id, origin_creator_account_id) VALUES (?, ?, ?)',
      [name.trim(), account_id, account_id]
    );
    await conn.query(
      'INSERT INTO sim_supply_checkpoints (product_id, status, location, recorded_by_account_id) VALUES (?, ?, ?, ?)',
      [result.insertId, 'Created', location || '', account_id]
    );
    await conn.commit();
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

export const addCheckpoint = async (req, res) => {
  try {
    const { account_id, product_id, status, location } = req.body;
    const [[product]] = await pool.query('SELECT * FROM sim_supply_products WHERE id = ?', [product_id]);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.current_holder_account_id !== account_id) return res.status(403).json({ message: 'Only current holder can add checkpoint' });

    await pool.query(
      'INSERT INTO sim_supply_checkpoints (product_id, status, location, recorded_by_account_id) VALUES (?, ?, ?, ?)',
      [product_id, status, location || '', account_id]
    );
    res.json({ message: 'Checkpoint added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const transferCustody = async (req, res) => {
  try {
    const { account_id, product_id, new_holder_account_id } = req.body;
    const [[product]] = await pool.query('SELECT * FROM sim_supply_products WHERE id = ?', [product_id]);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.current_holder_account_id !== account_id) return res.status(403).json({ message: 'Only current holder can transfer' });

    await pool.query('UPDATE sim_supply_products SET current_holder_account_id = ? WHERE id = ?', [new_holder_account_id, product_id]);
    await pool.query(
      'INSERT INTO sim_supply_checkpoints (product_id, status, location, recorded_by_account_id) VALUES (?, ?, ?, ?)',
      [product_id, 'Custody Transferred', '', account_id]
    );
    res.json({ message: 'Custody transferred' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Identity ──
export const getIdentity = async (req, res) => {
  try {
    const accountId = parseInt(req.query.account_id);
    const [[identity]] = await pool.query('SELECT * FROM sim_identities WHERE account_id = ?', [accountId]);
    const [credentials] = await pool.query('SELECT * FROM sim_credentials WHERE account_id = ? ORDER BY id', [accountId]);
    res.json({ identity: identity || null, credentials });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const registerIdentity = async (req, res) => {
  try {
    const { account_id, name, metadata } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name required' });
    const [existing] = await pool.query('SELECT * FROM sim_identities WHERE account_id = ?', [account_id]);
    if (existing.length) return res.status(400).json({ message: 'Already registered' });
    await pool.query('INSERT INTO sim_identities (account_id, name, metadata_uri) VALUES (?, ?, ?)', [account_id, name.trim(), metadata || '']);
    res.status(201).json({ message: 'Identity registered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const issueCredential = async (req, res) => {
  try {
    const { issuer_account_id, target_account_id, credential_type } = req.body;
    const [issuerRows] = await pool.query('SELECT * FROM sim_issuers WHERE account_id = ?', [issuer_account_id]);
    if (!issuerRows.length) return res.status(403).json({ message: 'Only an issuer account can issue credentials' });

    const [identityRows] = await pool.query('SELECT * FROM sim_identities WHERE account_id = ?', [target_account_id]);
    if (!identityRows.length) return res.status(400).json({ message: 'Target has no registered identity' });

    await pool.query(
      'INSERT INTO sim_credentials (account_id, credential_type, issuer_account_id) VALUES (?, ?, ?)',
      [target_account_id, credential_type, issuer_account_id]
    );
    res.status(201).json({ message: 'Credential issued' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyCredential = async (req, res) => {
  try {
    const accountId = parseInt(req.query.account_id);
    const type = req.query.type;
    const [rows] = await pool.query(
      'SELECT * FROM sim_credentials WHERE account_id = ? AND credential_type = ? AND revoked = FALSE ORDER BY id DESC LIMIT 1',
      [accountId, type]
    );
    if (!rows.length) return res.json({ valid: false });
    res.json({ valid: true, issuer_account_id: rows[0].issuer_account_id, issued_at: rows[0].issued_at });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
