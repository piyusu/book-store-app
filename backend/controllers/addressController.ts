import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const createOrUpdateAddressByUserId = async (req:Request, res:Response) => {
    try {
        const userId = req.id;
        const {addressLine1, addressLine2, city, state, pincode, phoneNumber, addressId} = req.body;
        if(!userId){
            return response(res, 400, 'User ID is required');
        }
        if(!addressLine1 || !city || !state || !pincode || !phoneNumber){
            return response(res, 400, 'All fields are required');
        }
        if(addressId){
            const existingAddress = await Address.findById(addressId);
            if(!existingAddress){
                return response(res, 404, 'Address not found'); 
            }
            existingAddress.addressLine1 = addressLine1;
            existingAddress.addressLine2 = addressLine2;
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.pincode = pincode;
            existingAddress.phoneNumber = phoneNumber;
            await existingAddress.save();
            return response(res, 200, 'Address updated successfully', existingAddress);
        }else{
            const newAddress = new Address({
                user: userId,
                addressLine1,
                addressLine2,
                city,
                state,
                pincode,
                phoneNumber
            })
            await newAddress.save();
            await User.findByIdAndUpdate(userId, 
                {$push: { addresses: newAddress._id }},
                { new: true }
            )
            return response(res, 201, 'Address created successfully', newAddress);
        }
    } catch (error) {
        console.log(error);
        return response(res, 500, 'Internal server error, Please try again late');
    }
}


export const getAddressByUserId = async (req:Request, res:Response) => {
    try {
        const userId = req.id;
        if(!userId){
            return response(res, 400, 'User ID is required');
        }
        const adddress = await User.findById(userId)
            .populate('addresses');
        if(!adddress){
            return response(res, 404, 'No address found for this user');
        }
        return response(res, 200, 'Address fetched successfully', adddress.addresses);
    } catch (error) {
        console.log(error);
        return response(res, 500, 'Internal server error, Please try again late');
    }
}