import express from 'express';
import { 
  createNGeniusPayment, 
  handleNGeniusWebhook, 
  getPaymentStatus 
} from '../controllers/paymentController.js';

const router = express.Router();

// Public routes
router.post('/ngenius/create/:orderId', createNGeniusPayment);
router.post('/ngenius/webhook', handleNGeniusWebhook);
router.get('/status/:orderId', getPaymentStatus);

export default router;
