import { NextFunction, Request, Response, Router } from "express"
import * as authController from "../controllers/authController";
import { authenticatedUser } from "../middleware/authMiddleware";
import passport from "passport";
import { IUSER } from "../models/User";
import { generateToken } from "../utils/generateToken";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email/:token", authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/logout', authController.logout);

router.get('/verify-auth', authenticatedUser ,authController.chekcUserAuth);

router.get('/google',passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account', // force manual account selection
}));

//google callback route
router.get('/google/callback',passport.authenticate('google', {failureRedirect:`${process.env.FRONTEND_URL}`,
    session: false
}),
async (req:Request, res: Response, next:NextFunction) : Promise<void> => {
    try {
        const user = req.user as IUSER;
        const accessToken = await generateToken(user)
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            sameSite:"none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (error) {
        next(error);
    }
}
)

export default router;