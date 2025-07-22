import express from 'express';
import { getCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from '../services/cart_service';

const router = express.Router();

router.get('/:userId', getCart);

router.post('/:userId/items', addToCart);

router.put('/:userId/items/:productId', updateCartItemQuantity);

router.delete('/:userId/items/:productId', removeFromCart);

router.delete('/:userId', clearCart);

export default router;
