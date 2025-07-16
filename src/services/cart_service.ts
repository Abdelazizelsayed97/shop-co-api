import CartModel from '../models/cart_model';
import ProductModel from '../models/product_model';
import { Request, Response } from 'express';

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId; // Assuming userId is passed in params
        let cart = await CartModel.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            // If cart doesn't exist, create a new one
            cart = new CartModel({ user: userId, items: [] });
            await cart.save();
        }
        res.status(200).json({ cart });
    } catch (error) {
        console.error(`Error fetching cart: ${error}`);
        res.status(500).json({ message: 'Error fetching cart' });
    }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { productId, quantity } = req.body;

        let cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            cart = new CartModel({ user: userId, items: [] });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Product not in cart, add new item
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate('items.product');
        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        console.error(`Error adding to cart: ${error}`);
        res.status(500).json({ message: 'Error adding to cart' });
    }
};

// Update cart item quantity
export const updateCartItemQuantity = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { productId, quantity } = req.body;

        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        await cart.save();
        await cart.populate('items.product');
        res.status(200).json({ message: 'Cart item quantity updated successfully', cart });
    } catch (error) {
        console.error(`Error updating cart item quantity: ${error}`);
        res.status(500).json({ message: 'Error updating cart item quantity' });
    }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { productId } = req.body;

        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        await cart.save();
        await cart.populate('items.product');
        res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        console.error(`Error removing from cart: ${error}`);
        res.status(500).json({ message: 'Error removing from cart' });
    }
};

// Clear user's cart
export const clearCart = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        console.error(`Error clearing cart: ${error}`);
        res.status(500).json({ message: 'Error clearing cart' });
    }
};
