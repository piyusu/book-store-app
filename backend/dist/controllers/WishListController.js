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
exports.getWishListByUser = exports.removeFromWishList = exports.addToWishList = void 0;
const Products_1 = __importDefault(require("../models/Products"));
const responseHandler_1 = require("../utils/responseHandler");
const WishList_1 = __importDefault(require("../models/WishList"));
const addToWishList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId } = req.body;
        const product = yield Products_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        let wishList = yield WishList_1.default.findOne({ user: userId });
        if (!wishList) {
            wishList = new WishList_1.default({ user: userId, products: [] });
        }
        if (!wishList.products.includes(productId)) {
            wishList.products.push(productId);
            yield wishList.save();
        }
        return (0, responseHandler_1.response)(res, 200, "Product added to WishList successfully", wishList);
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Plesase try again later");
    }
});
exports.addToWishList = addToWishList;
const removeFromWishList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId } = req.params;
        let wishList = yield WishList_1.default.findOne({ user: userId });
        if (!wishList) {
            return (0, responseHandler_1.response)(res, 404, "WishList not found for this user");
        }
        wishList.products = wishList.products.filter((id) => id.toString() !== productId);
        yield wishList.save();
        return (0, responseHandler_1.response)(res, 200, "Product removed from WishList successfully");
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Plesase try again later");
    }
});
exports.removeFromWishList = removeFromWishList;
const getWishListByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        let wishList = yield WishList_1.default.findOne({ user: userId }).populate("products");
        if (!wishList) {
            return (0, responseHandler_1.response)(res, 404, "WishList is Empty", { Products: [] });
        }
        yield wishList.save();
        return (0, responseHandler_1.response)(res, 200, "User WishList get successfully", wishList);
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Plesase try again later");
    }
});
exports.getWishListByUser = getWishListByUser;
