import express from 'express';
import { getCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from '../services/cart_service';

const router = express.Router();

// Get user's cart
router.get('/:userId', getCart);

// Add item to cart
router.post('/:userId/items', addToCart);

// Update cart item quantity
router.put('/:userId/items', updateCartItemQuantity);

// Remove item from cart
router.delete('/:userId/items', removeFromCart);

// Clear user's cart
router.delete('/:userId', clearCart);

export default router;
