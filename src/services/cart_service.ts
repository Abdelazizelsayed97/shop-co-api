import CartModel from '../models/cart_model';
import { ICartItem } from '../models/cart_model';
import ProductModel from '../models/product_model';
import { Request, Response } from 'express';

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        var cart = await CartModel.findOne({ user: userId }).populate('items');


        if (!cart) {
            cart = new CartModel({ user: userId, items: [] });
            await cart.save();
        }
        let products = [];
        for (const item of cart?.items ?? []) {
            const product = await ProductModel.findById(item.product);

            products.push(product, { quantity: item.quantity });
        }
        // const cartItems = cart.items;
        res.status(200).json({ products: products, message: "Operation done successfully" });
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
        console.log(productId);
        console.log(product._id.toString());
        const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
        console.log(itemIndex)

        if (itemIndex > -1) {

            cart.items[itemIndex].quantity += quantity;
            console.log(cart.items[itemIndex].quantity);
        } else {

            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        let products = [];
        for (const item of cart?.items ?? []) {
            const product = await ProductModel.findById(item.product);

            products.push({ product, quantity: item.quantity });
        }

        res.status(200).json({ message: 'Item added to cart successfully', products });
    } catch (error) {
        console.error(`Error adding to cart: ${error}`);
        res.status(500).json({ message: 'Error adding to cart' });
    }
};

// Update cart item quantity
export const updateCartItemQuantity = async (req: Request, res: Response) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;
        console.log(`${userId} ${productId} ${quantity}`)
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
        await cart.populate('items');
        res.status(200).json({ message: 'Cart item quantity updated successfully', cart });
    } catch (error) {
        console.error(`Error updating cart item quantity: ${error}`);
        res.status(500).json({ message: 'Error updating cart item quantity' });
    }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { userId, productId } = req.params;

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
