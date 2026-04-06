import express from 'express';
import { handleOrderCreated, testWebhook } from '../controllers/shopifyWebhook.controller.js';

const router = express.Router();

// Test endpoint
router.get('/test', testWebhook);

// Shopify order creation webhook
// Note: This endpoint should NOT use express.json() middleware
// because we need the raw body for signature verification
router.post('/order-confirmation', handleOrderCreated);

export default router;
