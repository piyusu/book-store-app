'use client';

import { useVerifyEmailMutation } from '@/store/api';
import { authStatus, setIsEmailVerified } from '@/store/slice/userSlice';
import { RootState } from '@/store/store';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const page:React.FC = () => {
    const {token} = useParams<{token:string}>()
    // console.log("forgot Password token",token);
    const router = useRouter()
    const dispatch = useDispatch();
    const [verifyEmail] = useVerifyEmailMutation();
    const isVerifyEmail = useSelector((state:RootState) => state.user.isEmailVerified);

    const [varificationStatus, setVerificationStatus] = useState<"loading" | "success" | "alreadyVerified" | "failed">("loading");

    useEffect(() => {
        const verifyEmailToken = async () => {
            if(isVerifyEmail) {
                setVerificationStatus("alreadyVerified");
                return;
            }
            try {
                const result = await verifyEmail(token).unwrap();
                if (result.success) {
                    dispatch(setIsEmailVerified(true));
                    setVerificationStatus("success");
                    dispatch(authStatus());
                    toast.success("Email verified successfully!");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 3000);
                }else{
                    throw new Error(result.message || "Email verification failed");
                }
            } catch (error) {
                // toast.error("Email verification failed. Please try again.");
                console.error("Error verifying email:", error);
            }
        }
        if(token){
            verifyEmailToken();
        }
    },[token, isVerifyEmail, verifyEmail, dispatch]);
    return (
    <div className='p-20 flex itmes-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen'>
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md'
        transition={{ duration: 0.5 }}
    >
        {varificationStatus === "loading" && (
            <div className='flex flex-col items-center'>
                <Loader2 className='h-16 w-16 text-blue-500 animate-spin mb-4'/>
                <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Varifying your Email</h2>
                <p className='text-gray-500'>Please wait while we confirm your email address.....</p>
            </div>
        )}
        {varificationStatus === "success" && (
        <motion.div
        initial={{scale: 0.8}}
        animate={{scale: 1}}
        className='bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md'
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
            <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4'/>
                <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Email Varified</h2>
                <p className='text-gray-500'>Your Email has been successfully verified, You'll be redirecting to the homepage shortly.</p>
        </motion.div>
        )}
        {varificationStatus === "alreadyVerified" && (
            <motion.div
            initial={{scale: 0.8}}
            animate={{scale: 1}}
            className='bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md'
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
                <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4'/>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Email Already Varified</h2>
                    <p className='text-gray-500'>Your Email is already verified you can use our services.</p>
                    <Button
                    onClick={() => router.push('/')}
                    className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mt-4'
                    >
                        Go to Homepage
                    </Button>
            </motion.div>
        )}
    </motion.div>
    </div>
    )
}

export default page
