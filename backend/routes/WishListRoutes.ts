import express  from "express";
import * as wishListController from "../controllers/WishListController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/add', authenticatedUser, wishListController.addToWishList);
router.delete('/remove/:productId', authenticatedUser, wishListController.removeFromWishList);
router.get('/:userId', authenticatedUser, wishListController.getWishListByUser);

export default router;