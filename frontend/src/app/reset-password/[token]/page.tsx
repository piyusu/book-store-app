"use client";
import { useResetPasswordMutation } from "@/store/api";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggledLoginDialog } from "@/store/slice/userSlice";

interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
const page: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  // console.log("forgot Password token",token);
  const router = useRouter();
  const dispatch = useDispatch();
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPassword] = useResetPasswordMutation();
  const [resetPasswordStatus, setResetPasswordStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    setResetPasswordLoading(true);
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      setResetPasswordLoading(false);
      return;
    }
    try {
      await resetPassword({
        token: token,
        newPassword: data.newPassword,
      }).unwrap();
      setResetPasswordStatus(true);
      toast.success("Password reset successfully!");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    }finally{
        setResetPasswordLoading(false);
    }
  };

    const handleLoginClick = () => {
        dispatch(toggledLoginDialog())
    };
  return (
    <div className="p-20 flex itmes-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md"
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Reset your Password
        </h2>
        {!resetPasswordStatus ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                {...register("newPassword", {
                  required: "New Password is required",
                })}
                placeholder="New Password"
                type={showPassword ? "text" : "password"}
                className="pl-10"
              />
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              {showPassword ? (
                <EyeOff
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            {errors.newPassword && (
              <p className="text-red-500">{errors.newPassword.message}</p>
            )}
            <Input
              {...register("confirmPassword", {
                required: "Please confirm your new password",
              })}
              placeholder="Confirm new Password"
              type="password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}

            <Button type="submit" className="w-full font-bold cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
              {resetPasswordLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        ) : (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
            >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Password Reset Successfully</h2>
                                    <p className='text-gray-500'>Your Password has been reset successfully, You can now login with new password.</p>
                                    <Button
                                    onClick={handleLoginClick}
                                    className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mt-4'
                                    >
                                        Go To Login
                                    </Button>
            </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default page;
