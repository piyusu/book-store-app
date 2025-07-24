import { Request, Response } from 'express';
import { response } from '../utils/responseHandler';
import { uploadToCloudinary } from '../config/cloudnaryConfig';
import Products from '../models/Products';


export const createProduct = async (req: Request, res: Response) => {
    try {
        const { title, subject, category, condition, classType, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body;
        const sellerId = req.id;
        const images = req.files as Express.Multer.File[];
        if(!images || images.length === 0) {
            return response(res, 400, "Images are required");
        }

        let parsedPaymentDetails = JSON.parse(paymentDetails);
        if(paymentMode === 'UPI' && (!parsedPaymentDetails || !parsedPaymentDetails.upiId)) {
            return response(res, 400, "UPI details are required for payment");
        }
        if(paymentMode === 'Bank Account' && 
            (!parsedPaymentDetails || !parsedPaymentDetails.bankdetails || 
                !parsedPaymentDetails.bankdetails.accountNumber || 
                !parsedPaymentDetails.bankdetails.ifscCode ||
                !parsedPaymentDetails.bankdetails.bankName
            )) {
                return response(res, 400, "Bank account details are required for payment");
            }

            const uploadPromise = images.map(file => uploadToCloudinary(file as any));
            const uploadedImages = await Promise.all(uploadPromise);
            const imageUrl = uploadedImages.map(image => image.secure_url);

            const product = new Products({
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
            })
            await product.save();
            return response(res, 200, "Product created successfully", product);
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal server error, Please try again");
    }
}

export const getAllProduts = async (req: Request, res: Response) => {
    try{
        const products = await Products.find()
        .sort({createdAt :-1})
        .populate('seller', 'name email')

        return response(res, 200, 'Products fetched Successfully', products);
    }catch(error){
        console.log(error);
        return response(res, 500, 'Internal server error , Please try again later.')
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try{
        const product = await Products.findById(req.params.id)
        .populate({
            path:"seller",
            select:"name email profilePicture phoneNumber addresses",
            populate:{
                path:"addresses",
                model:"Address"
            }
    })
    if(!product){
        return response(res, 404, 'Product not found');
    }
        return response(res, 200, 'Products fetched by Id Successfully', product);
    }catch(error){
        console.log(error);
        return response(res, 500, 'Internal server error , Please try again later.')
    }
}

export const deleteProduct  = async (req:Request, res: Response) => {
    try{
        const product = await Products.findByIdAndDelete(req.params.productId);
        if(!product){
            return response(res, 404, 'Product not found for this id');
        }
        return response(res, 200, 'Products deleted Successfully', product);
    }catch(error){
        console.log(error);
        return response(res, 500, 'Internal server error , Please try again later.')
    }
}

export const getProductBySellerId = async(req: Request, res: Response) => {
    try{
        const sellerId = req.params.sellerId;
        if(!sellerId){
            return response(res, 400, 'seller not Found please provide vlaid seller id')
        }
        const product = await Products.find({seller:sellerId})
        .sort({createdAt :-1})
        .populate('seller', 'name email profilePicture phoneNumber addresses')
    if(!product){
        return response(res, 404, 'Product not found for this seller ');
    }
        return response(res, 200, 'Products fetched by seller Id Successfully', product);
    }catch(error){
        console.log(error);
        return response(res, 500, 'Internal server error , Please try again later.')
    }
}