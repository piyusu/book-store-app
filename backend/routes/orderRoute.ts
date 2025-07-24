import express from 'express';
import * as orderController from '../controllers/orderController';
import { authenticatedUser } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-or-update', authenticatedUser, orderController.createOrUpdateOrder);
router.patch('/create-or-update', authenticatedUser, orderController.createOrUpdateOrder);
router.get('/:id', authenticatedUser, orderController.getOrderById);
router.get('/', authenticatedUser, orderController.getOrdersByUser);
router.post('/payment-razorpay', authenticatedUser, orderController.createPaymentWithRazorpay);
router.post('/razorpay-webhook', authenticatedUser, orderController.handleRazorpayPayWebhook);

export default router;