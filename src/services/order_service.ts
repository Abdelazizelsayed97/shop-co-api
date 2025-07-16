import OrderModel from '../models/order_model';
import express from 'express';

// CRUD operations for orders

export const getAllOrders = async (req: express.Request, res: express.Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    try {
        const orders = await OrderModel.find({})
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({ orders, page, limit });
    } catch (error) {
        console.log(`Error fetching orders: ${error}`);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

export const getOrderById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ message: `Order with ID ${id} not found` });
        }
        res.json({ order });
    } catch (error) {
        console.log(`Error fetching order: ${error}`);
        res.status(500).json({ message: 'Error fetching order' });
    }
};

export const createOrder = async (req: express.Request, res: express.Response) => {
    try {
        const newOrder = new OrderModel(req.body);
        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error(`Error creating order: ${error}`);
        res.status(500).json({ message: 'Error creating order' });
    }
};

export const updateOrder = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const orderData = req.body;
    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(id, orderData, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: `Order with ID ${id} not found` });
        }
        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        console.log(`Error updating order: ${error}`);
        res.status(500).json({ message: 'Error updating order' });
    }
};

export const deleteOrder = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const deletedOrder = await OrderModel.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: `Order with ID ${id} not found` });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.log(`Error deleting order: ${error}`);
        res.status(500).json({ message: 'Error deleting order' });
    }
};
