import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import CartItmes, { IcartItem } from "../models/CartItmes";
import WishList from "../models/WishList";



export const addToWishList = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const {productId} = req.body;
        const product = await Products.findById(productId);
        if (!product) {
            return response(res, 404, "Product not found"); 
        }

        let wishList = await WishList.findOne({user: userId});
        if(!wishList) {
            wishList = new WishList({user: userId, products: []});
        }
        if(!wishList.products.includes(productId)) {
            wishList.products.push(productId);
            await wishList.save();
        }
        return response(res, 200, "Product added to WishList successfully",wishList);
    } catch (error) {
        console.error("Error adding to cart:", error);
        return response(res, 500, "Internal server error, Plesase try again later");
    }
}


export const removeFromWishList = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId} = req.params;
        let wishList = await WishList.findOne({user: userId});
        if(!wishList) {
            return response(res, 404, "WishList not found for this user");
        }
        wishList.products = wishList.products.filter((id) => id.toString() !== productId);
        await wishList.save();
        return response(res, 200, "Product removed from WishList successfully");
    } catch (error) {
        console.error("Error adding to cart:", error);
        return response(res, 500, "Internal server error, Plesase try again later");
    }
}

export const getWishListByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        let wishList = await WishList.findOne({user: userId}).populate("products");
        if(!wishList) {
            return response(res, 404, "WishList is Empty", {Products:[]});
        }
        await wishList.save();
        return response(res, 200, "User WishList get successfully", wishList);
    } catch (error) {
        console.error("Error adding to cart:", error);
        return response(res, 500, "Internal server error, Plesase try again later");
    }
}