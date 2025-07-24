"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartByUser = exports.removeFromCart = exports.addToCart = void 0;
const Products_1 = __importDefault(require("../models/Products"));
const responseHandler_1 = require("../utils/responseHandler");
const CartItmes_1 = __importDefault(require("../models/CartItmes"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;
        const product = yield Products_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        if (product.seller.toString() === userId) {
            return (0, responseHandler_1.response)(res, 400, "You cannot add your own product to the cart");
        }
        let cart = yield CartItmes_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new CartItmes_1.default({ user: userId, items: [] });
        }
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            const newItem = {
                product: productId,
                quantity: quantity
            };
            cart.items.push(newItem);
        }
        yield cart.save();
        return (0, responseHandler_1.response)(res, 200, "Product added to cart successfully", cart);
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Plesase try again later");
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId } = req.params;
        let cart = yield CartItmes_1.default.findOne({ user: userId });
        if (!cart) {
            return (0, responseHandler_1.response)(res, 404, "Cart not found");
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        yield cart.save();
        return (0, responseHandler_1.response)(res, 200, "Product removed from cart successfully");
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Plesase try again later");
    }
});
exports.removeFromCart = removeFromCart;
const getCartByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        let cart = yield CartItmes_1.default.findOne({ user: userId }).populate("items.product");
        // console.log("cart", cart)
        if (!cart) {
            return (0, responseHandler_1.response)(res, 404, "Cart is Empty", { items: [] });
        }
        yield cart.save();
        return (0, responseHandler_1.response)(res, 200, "User Cart get successfully", cart);
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Plesase try again later");
    }
});
exports.getCartByUser = getCartByUser;
