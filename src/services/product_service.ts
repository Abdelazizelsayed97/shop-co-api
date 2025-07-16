import ProductModel from '../models/product_model';
import CategoryModel from '../models/category_model';
import express from 'express';


//crud operations for the product

export const getAllProducts = async (req: express.Request, res: express.Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { search, category, price, rating, sort } = req.query;

    try {
        let query: any = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            const categoryObj = await CategoryModel.findOne({ name: category as string });
            if (categoryObj) {
                query.category = categoryObj._id;
            }
        }

        if (price) {
            query.price = { $lte: Number(price) };
        }

        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        let sortOption: any = {};
        if (sort === 'A-Z') {
            sortOption.name = 1;
        } else if (sort === 'Z-A') {
            sortOption.name = -1;
        }

        const products = await ProductModel.find(query)
            .populate('category')
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ products, page, limit });
    } catch (error) {
        console.log(`Error fetching products: ${error}`);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const getProductById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findById(id).populate('category');
        res.json({ product });
    } catch (error) {
        throw new Error(`Product with ID ${id} not found`);
    }
};
export const createProduct = async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body);
        const category = await CategoryModel.find({
            name: req.body.category
        });
        const newProduct = new ProductModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: category.map(category => category._id)
        });
        if (!category) {
            return res.status(400).json({ message: 'Category not found' });
        }

        await newProduct.save();
        res.status(201,).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error(`Error creating product: ${error}`);
        res.status(500).json({ message: 'Error creating product' });

    }

};
export const updateProduct = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const productData = req.body;
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, productData, { new: true });
        res.status(201).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.log(`Error updating product: ${error}`);
        res.status(500).json({ message: 'Error updating product' });

    }
};
export const deleteProduct = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findByIdAndDelete(id);
        res.status(201).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(`Error deleting product: ${error}`);
        res.status(500).json({ message: 'Error deleting product' });
    }
}