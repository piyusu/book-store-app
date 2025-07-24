import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import User from "../models/User";

export const updateUserProfile = async (req:Request, res:Response) => {
    try {
        const {userId} = req.params;
        if(!userId){
            return response(res, 400, 'User ID is required');
        }

        const {name, email, phoneNumber} = req.body;
        const updateUser = await User.findByIdAndUpdate(userId,
            {name, email, phoneNumber},
            {new: true, runValidators: true}
        ).select('-password -varificationToken -resetPasswordToken -resetPasswordExpire');
        if (!updateUser) {
            return response(res, 400, 'User not found');
        }
        return response(res, 201, 'User Profile Updated successfully', updateUser);
    } catch (error) {
        console.log(error);
        return response(res, 500, 'Internal server error, Please try again late');
    }
}


