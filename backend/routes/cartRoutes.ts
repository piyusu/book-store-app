import express  from "express";
import * as cartController from "../controllers/cartController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/add', authenticatedUser, cartController.addToCart);
router.delete('/remove/:productId', authenticatedUser, cartController.removeFromCart);
router.get('/:userId', authenticatedUser, cartController.getCartByUser);

export default router;