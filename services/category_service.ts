

//do the crud operations for the category
import CategoryModel from '../models/category_model';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

export const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const newCategory = new CategoryModel({ name });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category' });
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, { name }, { new: true });
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await CategoryModel.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
};
