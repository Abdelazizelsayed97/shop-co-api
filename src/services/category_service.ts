

//do the crud operations for the category
import CategoryModel from '../models/category_model';
import express from 'express';
import slugify from 'slugify';



export const getAllCategories = async (req: express.Request, res: express.Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    try {
        const skip = (page - 1) * limit;

        const categories = await CategoryModel.find({})
            .skip(skip)
            .limit(limit);

        const total = await CategoryModel.countDocuments();

        res.status(200).json({
            message: 'Categories fetched successfully',
            categories,
            page,
            limit,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};
export const getCategoryById = async (req: express.Request, res: express.Response): Promise<void> => {
    const id = req.params.id;
    try {
        console.log(`id: ${id}`);
        const category = await CategoryModel.findById(id);
        res.status(201).json({ message: "Opretion done successfully", category });
    } catch (error) {
        console.log(`Error fetching category: ${error}`);
        res.status(500).json({ message: 'Category not found' });
    }
}

export const createCategory = async (req: express.Request, res: express.Response): Promise<void> => {
    const name = req.body.name;
    try {
        const newCategory = new CategoryModel({ name: name, slug: slugify(name, { lower: true }) });
        console.log(newCategory);
        await newCategory.save();
        console.log(`. hfhgdjsdjnfjsnf${newCategory}`);
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        console.log(`Error creating category: ${error}`);
        res.status(500).json({ message: 'Error creating category' });
    }
};

export const updateCategory = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, { name }, { new: true });
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
};

export const deleteCategory = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params;
    try {
        await CategoryModel.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
};
