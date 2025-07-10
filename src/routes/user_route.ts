import express from 'express';
import mongoose from 'mongoose';


import { getAllUsers, createUser, updateUser, deleteUser } from '../services/user_service';

export const router = express.Router();
router.get('/', getAllUsers)
	.post('/', createUser)
	.put('/:id', updateUser)
	.delete('/:id', deleteUser);

export default router;