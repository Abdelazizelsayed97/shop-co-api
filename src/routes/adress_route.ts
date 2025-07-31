
import express from 'express';
import {
    createAddress,
    getAddressesByUser,
    getAddressById,
    updateAddress,
    deleteAddress,
} from '../services/adress_service';
import { protect as authMiddleware } from '../middlewares/auth.middleware';

interface AuthRequest extends express.Request {
    user?: any;
}

const router = express.Router();

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const address = await createAddress(req.user._id, req.body);
        res.status(201).json(address);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const addresses = await getAddressesByUser(req.user._id);
        res.status(200).json(addresses);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const address = await getAddressById(req.params.id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const address = await updateAddress(req.params.id, req.body);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
        await deleteAddress(req.user._id, req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

export default router;
