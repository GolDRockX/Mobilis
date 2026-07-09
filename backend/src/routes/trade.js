import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getTradeHistory, executeTrade, connectWallet, disconnectWallet } from '../controllers/tradeController.js';

const router = express.Router();

router.use(authenticate);

router.get('/history', getTradeHistory);
router.post('/execute', executeTrade);
router.post('/wallet/connect', connectWallet);
router.post('/wallet/disconnect', disconnectWallet);

export default router;
