import express from 'express';

import { getAllProducts, createProduct, updateProduct, deleteProduct, getProductById } from '../services/product_service';
const router = express.Router();

router.get("/", getAllProducts).post("/", createProduct)
    .put("/:id", updateProduct)
    .delete("/:id", deleteProduct).get("/:id", getProductById);

export default router;

