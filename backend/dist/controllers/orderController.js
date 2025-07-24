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
exports.handleRazorpayPayWebhook = exports.createPaymentWithRazorpay = exports.getOrdersByUser = exports.getOrderById = exports.createOrUpdateOrder = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const CartItmes_1 = __importDefault(require("../models/CartItmes"));
const Order_1 = __importDefault(require("../models/Order"));
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const createOrUpdateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        // if (!req.body || typeof req.body !== 'object') {
        //   return response(res, 400, "Invalid request body");
        // }
        // console.log("useRId", userId)j 
        const { orderId, items, totalAmount, shippingAddress, paymentMethod, paymentDetails, } = req.body;
        // console.log("Incoming req.body:", req.body);
        const cart = yield CartItmes_1.default.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return (0, responseHandler_1.response)(res, 400, "Cart is empty, Please add items to the cart");
        }
        let order = yield Order_1.default.findOne({ _id: orderId });
        if (order) {
            order.totalAmount = totalAmount || order.totalAmount;
            order.shippingAddress = shippingAddress || order.shippingAddress;
            order.paymentMethod = paymentMethod || order.paymentMethod;
            if (paymentDetails) {
                order.paymentDetails = paymentDetails;
                order.paymentStatus = "complete";
                order.status = "processing";
            }
        }
        else {
            order = new Order_1.default({
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
        yield order.save();
        if (paymentDetails) {
            // Clear the cart after successful payment
            yield CartItmes_1.default.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
        }
        return (0, responseHandler_1.response)(res, 201, "Order created or updated successfully", order);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again later");
    }
});
exports.createOrUpdateOrder = createOrUpdateOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.default.findById(req.params.id)
            .populate("user", "name email")
            .populate("shippingAddress")
            .populate({ path: "items.product", model: "Product" });
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Order retrieved successfully", order);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again later");
    }
});
exports.getOrderById = getOrderById;
const getOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        // console.log("userId", userId);
        const order = yield Order_1.default.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "name email")
            .populate("shippingAddress")
            .populate({ path: "items.product", model: "Product" });
        if (!order || order.length === 0) {
            return (0, responseHandler_1.response)(res, 404, "No orders found for this user");
        }
        return (0, responseHandler_1.response)(res, 200, "USesr Orders retrieved successfully", order);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again later");
    }
});
exports.getOrdersByUser = getOrdersByUser;
const createPaymentWithRazorpay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        const order = yield Order_1.default.findById(orderId);
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order is required");
        }
        const razorPayOrder = yield razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100), // Amount in paise
            currency: "INR",
            receipt: order === null || order === void 0 ? void 0 : order._id.toString(),
        });
        return (0, responseHandler_1.response)(res, 200, "Razorpay order and Payment created successfully", { order: razorPayOrder });
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again later");
    }
});
exports.createPaymentWithRazorpay = createPaymentWithRazorpay;
const handleRazorpayPayWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const shasum = crypto_1.default.createHmac("sha256", secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");
        if (digest === req.headers["x-razorpay-signature"]) {
            const paymentId = req.body.payload.entity.id;
            const orderId = req.body.payload.entity.order.id;
            yield Order_1.default.findOneAndUpdate({ "paymentDetails.razorpay_order_id": orderId }, {
                paymentStatus: "complete",
                status: "processing",
                "paymentDetails.razorpay_payment_id": paymentId,
            });
            return (0, responseHandler_1.response)(res, 200, "Webhook processed successfully");
        }
        else {
            return (0, responseHandler_1.response)(res, 400, "Invalid Signature");
        }
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again later");
    }
});
exports.handleRazorpayPayWebhook = handleRazorpayPayWebhook;
