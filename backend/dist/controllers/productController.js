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
exports.getProductBySellerId = exports.deleteProduct = exports.getProductById = exports.getAllProduts = exports.createProduct = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const cloudnaryConfig_1 = require("../config/cloudnaryConfig");
const Products_1 = __importDefault(require("../models/Products"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, subject, category, condition, classType, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body;
        const sellerId = req.id;
        const images = req.files;
        if (!images || images.length === 0) {
            return (0, responseHandler_1.response)(res, 400, "Images are required");
        }
        let parsedPaymentDetails = JSON.parse(paymentDetails);
        if (paymentMode === 'UPI' && (!parsedPaymentDetails || !parsedPaymentDetails.upiId)) {
            return (0, responseHandler_1.response)(res, 400, "UPI details are required for payment");
        }
        if (paymentMode === 'Bank Account' &&
            (!parsedPaymentDetails || !parsedPaymentDetails.bankdetails ||
                !parsedPaymentDetails.bankdetails.accountNumber ||
                !parsedPaymentDetails.bankdetails.ifscCode ||
                !parsedPaymentDetails.bankdetails.bankName)) {
            return (0, responseHandler_1.response)(res, 400, "Bank account details are required for payment");
        }
        const uploadPromise = images.map(file => (0, cloudnaryConfig_1.uploadToCloudinary)(file));
        const uploadedImages = yield Promise.all(uploadPromise);
        const imageUrl = uploadedImages.map(image => image.secure_url);
        const product = new Products_1.default({
            title,
            subject,
            category,
            condition,
            classType,
            price,
            author,
            edition,
            description,
            finalPrice,
            shippingCharge,
            seller: sellerId,
            paymentMode,
            paymentDetails: parsedPaymentDetails,
            images: imageUrl
        });
        yield product.save();
        return (0, responseHandler_1.response)(res, 200, "Product created successfully", product);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again");
    }
});
exports.createProduct = createProduct;
const getAllProduts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Products_1.default.find()
            .sort({ createdAt: -1 })
            .populate('seller', 'name email');
        return (0, responseHandler_1.response)(res, 200, 'Products fetched Successfully', products);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, 'Internal server error , Please try again later.');
    }
});
exports.getAllProduts = getAllProduts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Products_1.default.findById(req.params.id)
            .populate({
            path: "seller",
            select: "name email profilePicture phoneNumber addresses",
            populate: {
                path: "addresses",
                model: "Address"
            }
        });
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, 'Product not found');
        }
        return (0, responseHandler_1.response)(res, 200, 'Products fetched by Id Successfully', product);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, 'Internal server error , Please try again later.');
    }
});
exports.getProductById = getProductById;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Products_1.default.findByIdAndDelete(req.params.productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, 'Product not found for this id');
        }
        return (0, responseHandler_1.response)(res, 200, 'Products deleted Successfully', product);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, 'Internal server error , Please try again later.');
    }
});
exports.deleteProduct = deleteProduct;
const getProductBySellerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.params.sellerId;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 400, 'seller not Found please provide vlaid seller id');
        }
        const product = yield Products_1.default.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .populate('seller', 'name email profilePicture phoneNumber addresses');
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, 'Product not found for this seller ');
        }
        return (0, responseHandler_1.response)(res, 200, 'Products fetched by seller Id Successfully', product);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, 'Internal server error , Please try again later.');
    }
});
exports.getProductBySellerId = getProductBySellerId;
