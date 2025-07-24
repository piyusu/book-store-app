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
exports.chekcUserAuth = exports.logout = exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const responseHandler_1 = require("../utils/responseHandler");
const crypto_1 = __importDefault(require("crypto"));
const emailConfig_1 = require("../config/emailConfig");
const generateToken_1 = require("../utils/generateToken");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, agreeTerms } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return (0, responseHandler_1.response)(res, 400, "User already exists");
        }
        const varificationToken = crypto_1.default.randomBytes(20).toString("hex");
        const user = new User_1.default({
            name,
            email,
            password,
            varificationToken,
            agreeTerms
        });
        yield user.save();
        const result = yield (0, emailConfig_1.sendVerificationToEmail)(user.email, varificationToken);
        console.log(result);
        return (0, responseHandler_1.response)(res, 200, "User registered successfully, Please check your email box to verify your account");
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again");
    }
});
exports.register = register;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const user = yield User_1.default.findOne({ varificationToken: token });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "Invalid or expired verification token");
        }
        user.isVerified = true;
        user.varificationToken = undefined;
        const accessToken = (0, generateToken_1.generateToken)(user);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        yield user.save();
        return (0, responseHandler_1.response)(res, 200, "Email verified successfully");
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again");
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            return (0, responseHandler_1.response)(res, 400, "Invalid email or Password");
        }
        if (!user.isVerified) {
            return (0, responseHandler_1.response)(res, 400, 'Please verify your email before logging in. Check your email inbox to verify');
        }
        const accessToken = (0, generateToken_1.generateToken)(user);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return (0, responseHandler_1.response)(res, 200, "User logged in successfully", { user: { name: user.name, email: user.email } });
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again");
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, 'No account found with this email address');
        }
        const resetPasswordToken = crypto_1.default.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpire = new Date(Date.now() + 3600000);
        yield user.save();
        yield (0, emailConfig_1.sendResetPasswordLinkToEmail)(user.email, resetPasswordToken);
        return (0, responseHandler_1.response)(res, 200, 'A Password reset link has been sent to your email address');
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, 'Internal Server error, please try again');
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = yield User_1.default.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "Invalid or expired reset password token");
        }
        user.password = newPassword;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        yield user.save();
        return (0, responseHandler_1.response)(res, 200, "Your password reset successfully, you can now login with your new password");
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again");
    }
});
exports.resetPassword = resetPassword;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        return (0, responseHandler_1.response)(res, 200, "User logged out successfully");
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again");
    }
});
exports.logout = logout;
const chekcUserAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req === null || req === void 0 ? void 0 : req.id;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, 'Unauthenticated please login to access our data.');
        }
        const user = yield User_1.default.findById(userId).select('-password -varificationToken -resetPasswordToken -resetPasswordExpire');
        if (!user) {
            return (0, responseHandler_1.response)(res, 403, 'User not found');
        }
        return (0, responseHandler_1.response)(res, 200, "User authenticated successfully", user);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again");
    }
});
exports.chekcUserAuth = chekcUserAuth;
