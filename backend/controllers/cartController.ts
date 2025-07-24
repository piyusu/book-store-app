import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import CartItmes, { IcartItem } from "../models/CartItmes";



export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;
        const product = await Products.findById(productId);
        if (!product) {
            return response(res, 404, "Product not found"); 
        }
        if(product.seller.toString() === userId) {
            return response(res, 400, "You cannot add your own product to the cart");
        }

        let cart = await CartItmes.findOne({user: userId});
        if(!cart) {
            cart = new CartItmes({user: userId, items: []});
        }

        const existingItem = cart.items.find((item) => item.product.toString() === productId)
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const newItem = {
                product: productId,
                quantity: quantity
            }
            cart.items.push(newItem as IcartItem);
        }
        await cart.save();
        return response(res, 200, "Product added to cart successfully",cart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        return response(res, 500, "Internal server error, Plesase try again later");
    }
}


export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId} = req.params;
        let cart = await CartItmes.findOne({user: userId});
        if(!cart) {
            return response(res, 404, "Cart not found");
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        return response(res, 200, "Product removed from cart successfully");
    } catch (error) {
        console.error("Error adding to cart:", error);
        return response(res, 500, "Internal server error, Plesase try again later");
    }
}

export const getCartByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        let cart = await CartItmes.findOne({user: userId}).populate("items.product")
        // console.log("cart", cart)
        if(!cart) {
            return response(res, 404, "Cart is Empty", {items:[]});
        }
        await cart.save();
        return response(res, 200, "User Cart get successfully",cart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        return response(res, 500, "Internal server error, Plesase try again later");
    }
}