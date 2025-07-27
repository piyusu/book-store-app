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

const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Prefer Authorization header first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.access_token) {
    // Fallback: use cookie if available
    token = req.cookies.access_token;
  }

  if (!token) {
    return response(res, 401, "Unauthorized, Please login to access this resource");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    

    if (!decoded) {
      return response(res, 401, "Unauthorized, User not found or token expired");
    }

    req.id = decoded.userId;
    next();
  } catch (err) {
    return response(res, 401, "Unauthorized, token is not valid or expired");
  }
};

export {authenticatedUser}