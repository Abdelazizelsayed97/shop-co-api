import express from 'express';
import mongoose from "mongoose";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/product_service';
const router = express.Router();
// Define routes for product operations
router.get("/", getAllProducts).post("/", createProduct)
    .put("/:id", updateProduct)
    .delete("/:id", deleteProduct);
export default router;

