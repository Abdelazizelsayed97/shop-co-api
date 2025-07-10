import ProductModel from '../models/product_model';
import express from 'express';

//crud operations for the product

export const getAllProducts = async (_: unknown, res: express.Response) => {
    try {
        const products = await ProductModel.find();
        res.json(products);
    } catch (error) {
        console.log(`Error fetching products: ${error}`);
        throw new Error('Error fetching products');
    }
}
export const getProductById = async (id: string) => {
    try {
        return await ProductModel.findById(id).populate('Category', 'name');
    } catch (error) {
        throw new Error(`Product with ID ${id} not found`);
    }
};
export const createProduct = async (productData: any) => {
    const newProduct = new ProductModel(productData);
    // Save the new product
    return await newProduct.save();
};
export const updateProduct = async (id: string, productData: any) => {
    try {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true }).populate('Category', 'name');
    } catch (error) {
        throw new Error(`Error updating product with ID ${id}`);
    }
};
export const deleteProduct = async (id: string) => {
    try {
        return await ProductModel.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(`Error deleting product with ID ${id}`);
    }
}