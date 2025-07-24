import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import CartItmes from "../models/CartItmes";
import Order from "../models/Order";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createOrUpdateOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    // if (!req.body || typeof req.body !== 'object') {
    //   return response(res, 400, "Invalid request body");
    // }
    // console.log("useRId", userId)j 
    const {
      orderId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentDetails,
    } = req.body;
    // console.log("Incoming req.body:", req.body);

    const cart = await CartItmes.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return response(res, 400, "Cart is empty, Please add items to the cart");
    }

    let order = await Order.findOne({ _id: orderId });
    if (order) {
      order.totalAmount = totalAmount || order.totalAmount;
      order.shippingAddress = shippingAddress || order.shippingAddress;
      order.paymentMethod = paymentMethod || order.paymentMethod;
      if (paymentDetails) {
        order.paymentDetails = paymentDetails;
        order.paymentStatus = "complete";
        order.status = "processing";
      }
    } else {
      order = new Order({
        user: userId,
        items: cart.items,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentDetails,
        paymentStatus: paymentDetails ? "complete" : "pending",
        status: "processing",
      });
    }
    await order.save();

    if (paymentDetails) {
      // Clear the cart after successful payment
      await CartItmes.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }
      );
    }
    return response(res, 201, "Order created or updated successfully", order);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Please try again later");
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({ path: "items.product", model: "Product" });
    if (!order) {
      return response(res, 404, "Order not found");
    }

    return response(res, 200, "Order retrieved successfully", order);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Please try again later");
  }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    // console.log("userId", userId);
    const order = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({ path: "items.product", model: "Product" });

    if (!order || order.length === 0) {
      return response(res, 404, "No orders found for this user");
    }

    return response(res, 200, "USesr Orders retrieved successfully", order);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Please try again later");
  }
};

export const createPaymentWithRazorpay = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return response(res, 404, "Order is required");
    }
    const razorPayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100), // Amount in paise
      currency: "INR",
      receipt: order?._id.toString(),
    });

    return response(
      res,
      200,
      "Razorpay order and Payment created successfully",
      { order: razorPayOrder }
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Please try again later");
  }
};

export const handleRazorpayPayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      const paymentId = req.body.payload.entity.id;
      const orderId = req.body.payload.entity.order.id;

      await Order.findOneAndUpdate(
        { "paymentDetails.razorpay_order_id": orderId },
        {
          paymentStatus: "complete",
          status: "processing",
          "paymentDetails.razorpay_payment_id": paymentId,
        }
      );
      return response(res, 200, "Webhook processed successfully");
    } else {
      return response(res, 400, "Invalid Signature");
    }
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Please try again later");
  }
};
