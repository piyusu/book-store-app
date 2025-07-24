'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForgotPasswordMutation, useLoginMutation, useRegisterMutation } from '@/store/api';
import { authStatus, setUser, toggledLoginDialog } from '@/store/slice/userSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '@/store/api';

interface LoginProps{
    isLoginOpen: boolean;
    setIsLoginOpen: (open:boolean)=>void;
}

interface LoginFormData{
    email: string;
    password: string;
}
interface SignUpFormData{
    name: string;
    email: string;
    password: string;
    agreeTerms: boolean;
}
interface ForgotPasswordFormData{
    email: string;
}

const AuthPage:React.FC<LoginProps> = ({isLoginOpen, setIsLoginOpen}) => {
    const [currentTab, setCurrentTab] = useState<"login" | "signup" | "forgot">("login")
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordSuccess, setforgotPasswordSuccess] =useState(false);
    const [loginLoading, SetloginLoading] =useState(false);
    const [signUpLoading, SetSignUpLoading] =useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
    
    const [register] = useRegisterMutation()
    const [login] = useLoginMutation()
    const [forgotPassword] = useForgotPasswordMutation()
    const dispatch = useDispatch();
    const router = useRouter();
    
    const {register:registerLogin, handleSubmit:handleLoginSubmit, formState: {errors: loginError}} = useForm<LoginFormData>()
    const {register:registerSignUp, handleSubmit:handleSignUpSubmit, formState: {errors: signUpError}} = useForm<SignUpFormData>()
    const {register:registerForgotPassword, handleSubmit:handleForgotPasswordSubmit, formState: {errors: forgotPasswordError}} = useForm<ForgotPasswordFormData>()

    const submitSignUp= async(data:SignUpFormData)=>{
        SetSignUpLoading(true);
        try {
            const {name, email, password} = data;
            console.log("SignUp Data:", data);
            const result = await register({name, email, password}).unwrap();
            console.log("SignUp Success:", result);
            if(result.success){
                toast.success("VErification link sent to your email. Please verify your email to login.");
                dispatch(toggledLoginDialog());
            }
            router.push('/');
        } catch (error) {
            console.error("SignUp Error:", error);
            toast.error("Email already registered.");
        }
        finally  {
            SetSignUpLoading(false);
        }
    }
    const submitLogin= async(data:LoginFormData)=>{
        SetloginLoading(true);
        try {
            const result = await login(data).unwrap();
            console.log("Login Success:", result);
            if(result.success){
                dispatch(setUser(result.data.user));  // <-- add this line
                dispatch(authStatus());
                toast.success("User Login Successfully");
                dispatch(toggledLoginDialog());
                router.push('/');
            }
        } catch (error) {
            toast.error("Email or Password is incorrect.");
        }
        finally  {
            SetloginLoading(false);
        }
    }

    const handleGoogleLogin = async()=>{
        setGoogleLoading(true);
        try{
            router.push(`${BASE_URL}/auth/google`);
            dispatch(authStatus());
            dispatch(toggledLoginDialog());
        setTimeout(() => {
            toast.success("User Login Successfully with Google");
            setIsLoginOpen(false);
            router.push('/');
        }, 2000);
        }catch(error){
            console.error("Google Login Error:", error);
            toast.error("Google login failed. Please try again.");
        }finally{
            setGoogleLoading(false);
        }
    }

    const onSubmitForgotPassword= async(data:ForgotPasswordFormData)=>{
        setForgotPasswordLoading(true); 
        try {
            const result = await forgotPassword(data.email).unwrap();
            if(result.success){
                toast.success("Password Link sent to your email Successfully");
                setforgotPasswordSuccess(true);
            }
        } catch (error) {
            toast.error("FAiled to send password reset link. Please try again.");
            console.error("Forgot Password Error:", error);
        }
        finally  {
            setForgotPasswordLoading(false);
        }
    }


    return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className='sm:max-w-[425px] p-6'>
            <DialogHeader>
                <DialogTitle className='text-center text-2xl font-bold mb-4'>
                    Welcome To BookKart
                </DialogTitle>
                <Tabs 
                value={currentTab}
                onValueChange={(value) => setCurrentTab(value as "login" | "signup" | "forgot" )}
                className=''
                >
                    <TabsList className='grid w-full grid-cols-3 mb-6'>
                        <TabsTrigger value='login'>Login</TabsTrigger>
                        <TabsTrigger value='signup'>Sign UP</TabsTrigger>
                        <TabsTrigger value='forgot'>Forgot</TabsTrigger>
                    </TabsList>
                    <AnimatePresence mode='wait'>
                        <motion.div
                        key={currentTab}
                        initial={{opacity:0, y:20}}
                        animate={{opacity:1, y: 0}}
                        exit={{opacity:0, y:-20}}
                        transition={{duration:0.3}}
                        >
                            <TabsContent value='login' className='space-y-4'>
                                <form
                                onSubmit={handleLoginSubmit(submitLogin)}
                                className='space-y-4'
                                >
                                    <div className='relative'>
                                        <Input 
                                        {...registerLogin("email",{
                                            required:"Email is required"
                                        })}
                                        placeholder='Email'
                                        type='email'
                                        className='pl-10'
                                        />
                                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' size={20}/>
                                    </div>
                                    {loginError.email &&(
                                        <p className='text-red-500'>
                                            {loginError.email.message}
                                        </p>
                                    )}
                                    <div className='relative'>
                                        <Input 
                                        {...registerLogin("password",{
                                            required:"Password is required"
                                        })}
                                        placeholder='Password'
                                        type={showPassword ? "text": "password"}
                                        className='pl-10'
                                        />
                                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' size={20}/>
                                        {showPassword ? (
                                            <EyeOff className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500' 
                                            size={20}
                                            onClick={() => setShowPassword(false)}
                                            />
                                        ):(
                                            <Eye className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500' 
                                            size={20}
                                            onClick={() => setShowPassword(true)}
                                            />
                                        )}
                                    </div>
                                    {loginError.password &&(
                                        <p className='text-red-500'>
                                            {loginError.password.message}
                                        </p>
                                    )}

                                    <Button type="submit" className='w-full font-bold cursor-pointer'>
                                        {loginLoading ? (
                                            <Loader2 className='animate-spin mr-2'
                                            size={20}
                                            />
                                        ):(
                                            "Login"
                                        )}
                                    </Button>
                                </form>
                                <div className='flex items-center my-4'>
                                    <div className='flex-1 h-px bg-gray-300'></div>
                                    <p className='mx-2 text-gray-500 text-sm'>Or</p>
                                    <div className='flex-1 h-px bg-gray-300'></div>
                                </div>
                                <Button
                                onClick={handleGoogleLogin}
                                className='w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-200 cursor-pointer'
                                >
                                    {googleLoading?(
                                        <>
                                        <Loader2 className='animate-spin mr-2'
                                            size={20}
                                            />
                                            Login with google...
                                        </>
                                    ):(
                                        <>
                                        <Image
                                    src='/icons/google.svg'
                                    alt='google'
                                    width={20}
                                    height={20}
                                    />
                                    Login with google
                                        </>
                                    )}
                                </Button>
                            </TabsContent>
                            <TabsContent value='signup' className='space-y-4'>
                            <form
                            onSubmit={handleSignUpSubmit(submitSignUp)}
                                className='space-y-4'
                                >
                                    <div className='relative'>
                                        <Input 
                                        {...registerSignUp("name",{
                                            required:"Name is required"
                                        })}
                                        placeholder='Name'
                                        type='text'
                                        className='pl-10'
                                        />
                                        <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' size={20}/>
                                    </div>
                                    {signUpError.name &&(
                                        <p className='text-red-500'>
                                            {signUpError.name.message}
                                        </p>
                                    )}
                                    <div className='relative'>
                                        <Input 
                                        {...registerSignUp("email",{
                                            required:"Email is required"
                                        })}
                                        placeholder='Email'
                                        type='email'
                                        className='pl-10'
                                        />
                                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' size={20}/>
                                    </div>
                                    {signUpError.email &&(
                                        <p className='text-red-500'>
                                            {signUpError.email.message}
                                        </p>
                                    )}
                                    <div className='relative'>
                                        <Input 
                                        {...registerSignUp("password",{
                                            required:"Password is required"
                                        })}
                                        placeholder='Password'
                                        type={showPassword ? "text": "password"}
                                        className='pl-10'
                                        />
                                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' size={20}/>
                                        {showPassword ? (
                                            <EyeOff className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500' 
                                            size={20}
                                            onClick={() => setShowPassword(false)}
                                            />
                                        ):(
                                            <Eye className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500' 
                                            size={20}
                                            onClick={() => setShowPassword(true)}
                                            />
                                        )}
                                    </div>
                                    {signUpError.password &&(
                                        <p className='text-red-500'>
                                            {signUpError.password.message}
                                        </p>
                                    )}

                                    <div className='flex items-center'>
                                        <input
                                        type='checkbox'
                                        {...registerSignUp('agreeTerms',{
                                            required:"you must agree to the terms and conditions"
                                        })}
                                        className='mr-2'
                                        />
                                        <label className='text-sm text-gray-700'>I agree to the Terms & Condiiton</label>
                                    </div>
                                    {signUpError.agreeTerms &&(
                                        <p className='text-red-500'>
                                            {signUpError.agreeTerms.message}
                                        </p>
                                    )}

                                    <Button type="submit" className='w-full font-bold cursor-pointer'>
                                        {signUpLoading ? (
                                            <Loader2 className='animate-spin mr-2'
                                            size={20}
                                            />
                                        ):(
                                            "SignUp"
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value='forgot' className='space-y-4'>
                                {!forgotPasswordSuccess ? (
                                    <form
                                    onSubmit={handleForgotPasswordSubmit(onSubmitForgotPassword)}
                                    className='space-y-4'
                                    >
                                        <div className='relative'>
                                            <Input 
                                            {...registerForgotPassword("email",{
                                                required:"Email is required"
                                            })}
                                            placeholder='Email'
                                            type='email'
                                            className='pl-10'
                                            />
                                            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' size={20}/>
                                        </div>
                                        {forgotPasswordError.email &&(
                                            <p className='text-red-500'>
                                                {forgotPasswordError.email.message}
                                            </p>
                                        )}
                                        
    
                                        <Button type="submit" className='w-full font-bold cursor-pointer'>
                                            {forgotPasswordLoading ? (
                                                <Loader2 className='animate-spin mr-2'
                                                size={20}
                                                />
                                            ):(
                                                "Send Reset Link"
                                            )}
                                        </Button>
                                    </form>
                                ):(
                                    <motion.div
                                    initial={{opacity:0, y:20}}
                                    animate={{opacity:1, y:0}}
                                    className='text-center space-y-4'
                                    >
                                        <CheckCircle className='w-16 h-16 text-green-500 mx-auto'/>
                                        <h3 className='text-xl font-semibold text-gray-700'>
                                            Reset Link Send
                                        </h3>
                                        <p className='text-gray-500 '>
                                            We've  sent a password link to your email. please check your inbox and follow the instructions to reset your password.
                                        </p>
                                        <Button onClick={() => setforgotPasswordSuccess(false)} className='w-full '>
                                            Send another Link to email
                                        </Button>
                                    </motion.div>
                                )}
                                
                            </TabsContent>

                        </motion.div>
                    </AnimatePresence>
                </Tabs>
                <p className='text-sm text-center mt-3 text-gray-600'> 
                    By clicking "agree", you agree to our {" "}
                    <Link href='/terms-of-use' className='text-blue-500 hover:underline'>
                    Terms Of Use
                    </Link>
                    ,{" "}
                    <Link href='/privacy-policy' className='text-blue-500 hover:underline'>
                    Privacy Policy
                    </Link>
                </p>
            </DialogHeader>
        </DialogContent>
        {/* <Toaster position="top-center" /> */}
    </Dialog>
  )
}

export default AuthPage
