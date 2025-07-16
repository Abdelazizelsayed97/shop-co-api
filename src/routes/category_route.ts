import express from 'express';

import { getAllCategories, createCategory, updateCategory, deleteCategory, getCategoryById } from '../services/category_service';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/:id', getCategoryById);
export default router;
