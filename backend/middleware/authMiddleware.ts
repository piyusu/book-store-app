import { NextFunction, Response, Request } from "express";
import { response } from "../utils/responseHandler";
import jwt from "jsonwebtoken";

declare global{
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

const authenticatedUser = async (req: Request, res: Response, next:NextFunction) => {
    const token = req.cookies.access_token;
    if (!token) {
        return response(res, 401, "Unauthorized, Please login to access this resource");
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        if(!decode) {
            return response(res, 401, "Unauthorized, User not found or token expired");
        }
        req.id = decode.userId;
        // console.log("User ID from token:", req.id);
        next();
    } catch (error) {
        return response(res, 401, "Unauthorized, token is not valid or expired");
    }
}
export {authenticatedUser}