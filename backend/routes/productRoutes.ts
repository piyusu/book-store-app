import express from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudnaryConfig";
import * as productController from "../controllers/productController";
const router = express.Router();

router.post("/", authenticatedUser, multerMiddleware, productController.createProduct);
router.get('/', authenticatedUser, productController.getAllProduts);
router.get('/:id', authenticatedUser, productController.getProductById);
router.delete('/seller/:productId', authenticatedUser, productController.deleteProduct)
router.get('/seller/:sellerId', authenticatedUser, productController.getProductBySellerId)

export default router;