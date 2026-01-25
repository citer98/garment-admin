import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderProgress,
  deleteOrder
} from '../controllers/orderController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateOrder } from '../middlewares/validate.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Customer can create orders, others can view
router.post('/', authorize('customer', 'admin'), validateOrder, createOrder);

// Everyone can view orders (with different filters)
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

// Only operators, managers, admins can update progress
router.put('/:id/progress', authorize('operator', 'manager', 'admin'), updateOrderProgress);

// Only admins can delete orders
router.delete('/:id', authorize('admin'), deleteOrder);

export default router;