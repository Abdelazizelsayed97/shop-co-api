// src/routes/user.routes.ts
import express from 'express';
import {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
	getUserById
} from '../services/user_service';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// 🔒 Apply auth middleware to protect all user routes

// router.use(protect);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
