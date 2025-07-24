import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email is ready to send');
    }
});

const sendEmail = async (to: string, subject: string, body: string) => {
        await transporter.sendMail({
            from: `"Your BookKArt" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: body,
        });
}

export const sendVerificationToEmail = async (to: string, token: string) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    const html = `
        <h1>Welcome to BookKArt! Verify Your Email</h1>
        <p>Thank you for registering with us. Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>
    `;
    await sendEmail(to, 'Email Verification', html);
}

export const sendResetPasswordLinkToEmail = async (to: string, token: string) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const html = `
        <h1>Welcome to BookKArt! Reset your Password</h1>
        <p>You have requested to reset your password. click the link below to set a new password:</p>
        <a href="${verificationUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged</p>
    `;
    await sendEmail(to, 'Reset Password', html);
}