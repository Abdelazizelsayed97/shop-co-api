

//do the crud operations for the category
import CategoryModel from '../models/category_model';
import express from 'express';
import slugify from 'slugify';

export interface Category {
    name: string;
    _id?: string;
}

export const getAllCategories = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const categories: Category[] = await CategoryModel.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

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
