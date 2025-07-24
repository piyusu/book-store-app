import express from 'express';
import * as userController from '../controllers/userController';
import { authenticatedUser } from '../middleware/authMiddleware';

const router = express.Router();

router.put('/update/:userId', authenticatedUser, userController.updateUserProfile);

export default router;