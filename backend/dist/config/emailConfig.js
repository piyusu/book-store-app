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
exports.sendResetPasswordLinkToEmail = exports.sendVerificationToEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // or another email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    }
    else {
        console.log('Email is ready to send');
    }
});
const sendEmail = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: `"Your BookKArt" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: body,
    });
});
const sendVerificationToEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    const html = `
        <h1>Welcome to BookKArt! Verify Your Email</h1>
        <p>Thank you for registering with us. Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>
    `;
    yield sendEmail(to, 'Email Verification', html);
});
exports.sendVerificationToEmail = sendVerificationToEmail;
const sendResetPasswordLinkToEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const html = `
        <h1>Welcome to BookKArt! Reset your Password</h1>
        <p>You have requested to reset your password. click the link below to set a new password:</p>
        <a href="${verificationUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged</p>
    `;
    yield sendEmail(to, 'Reset Password', html);
});
exports.sendResetPasswordLinkToEmail = sendResetPasswordLinkToEmail;
