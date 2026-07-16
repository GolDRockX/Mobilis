import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as sim from '../controllers/simController.js';

const router = express.Router();

router.use(authenticate);

router.get('/accounts', sim.getAccounts);

// NFT
router.get('/nft', sim.getNfts);
router.post('/nft/mint', sim.mintNft);
router.post('/nft/list', sim.listNft);
router.post('/nft/cancel', sim.cancelListing);
router.post('/nft/buy', sim.buyNft);

// DeFi
router.get('/defi/state', sim.getDefiState);
router.post('/defi/faucet', sim.faucet);
router.post('/defi/deposit', sim.deposit);
router.post('/defi/withdraw', sim.withdraw);
router.post('/defi/borrow', sim.borrow);
router.post('/defi/repay', sim.repay);

// DAO
router.get('/dao/proposals', sim.getProposals);
router.post('/dao/proposals', sim.createProposal);
router.post('/dao/vote', sim.voteProposal);
router.post('/dao/execute', sim.executeProposal);

// Supply Chain
router.get('/supply/products', sim.getProducts);
router.get('/supply/products/:id/history', sim.getProductHistory);
router.post('/supply/products', sim.createProduct);
router.post('/supply/checkpoint', sim.addCheckpoint);
router.post('/supply/transfer', sim.transferCustody);

// Identity
router.get('/identity/me', sim.getIdentity);
router.post('/identity/register', sim.registerIdentity);
router.post('/identity/issue', sim.issueCredential);
router.get('/identity/verify', sim.verifyCredential);

export default router;
