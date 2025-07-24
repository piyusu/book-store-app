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
exports.getAddressByUserId = exports.createOrUpdateAddressByUserId = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const Address_1 = __importDefault(require("../models/Address"));
const User_1 = __importDefault(require("../models/User"));
const createOrUpdateAddressByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { addressLine1, addressLine2, city, state, pincode, phoneNumber, addressId } = req.body;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, 'User ID is required');
        }
        if (!addressLine1 || !city || !state || !pincode || !phoneNumber) {
            return (0, responseHandler_1.response)(res, 400, 'All fields are required');
        }
        if (addressId) {
            const existingAddress = yield Address_1.default.findById(addressId);
            if (!existingAddress) {
                return (0, responseHandler_1.response)(res, 404, 'Address not found');
            }
            existingAddress.addressLine1 = addressLine1;
            existingAddress.addressLine2 = addressLine2;
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.pincode = pincode;
            existingAddress.phoneNumber = phoneNumber;
            yield existingAddress.save();
            return (0, responseHandler_1.response)(res, 200, 'Address updated successfully', existingAddress);
        }
        else {
            const newAddress = new Address_1.default({
                user: userId,
                addressLine1,
                addressLine2,
                city,
                state,
                pincode,
                phoneNumber
            });
            yield newAddress.save();
            yield User_1.default.findByIdAndUpdate(userId, { $push: { addresses: newAddress._id } }, { new: true });
            return (0, responseHandler_1.response)(res, 201, 'Address created successfully', newAddress);
        }
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, 'Internal server error, Please try again late');
    }
});
exports.createOrUpdateAddressByUserId = createOrUpdateAddressByUserId;
const getAddressByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, 'User ID is required');
        }
        const adddress = yield User_1.default.findById(userId)
            .populate('addresses');
        if (!adddress) {
            return (0, responseHandler_1.response)(res, 404, 'No address found for this user');
        }
        return (0, responseHandler_1.response)(res, 200, 'Address fetched successfully', adddress.addresses);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, 'Internal server error, Please try again late');
    }
});
exports.getAddressByUserId = getAddressByUserId;
