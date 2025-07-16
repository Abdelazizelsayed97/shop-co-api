import express from 'express';
import { getAllOrders, createOrder, updateOrder, deleteOrder, getOrderById } from '../services/order_service';

const router = express.Router();

// Define routes for order operations
router.get('/', getAllOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
