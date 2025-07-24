import express from 'express';
import * as addressController from '../controllers/addressController';
import { authenticatedUser } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-or-update', authenticatedUser, addressController.createOrUpdateAddressByUserId);
router.get('/get', authenticatedUser, addressController.getAddressByUserId);


export default router;