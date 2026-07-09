import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateApiKey, listApiKeys, deleteApiKey } from '../controllers/apiKeyController.js';

const router = express.Router();

router.use(authenticate);

router.post('/generate', generateApiKey);
router.get('/', listApiKeys);
router.delete('/:id', deleteApiKey);

export default router;
