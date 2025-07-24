'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserData } from '@/lib/types/type';
import { useUpdateUserMutation } from '@/store/api';
import { setUser } from '@/store/slice/userSlice';
import { RootState } from '@/store/store';
import { Phone, User, Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const [updateUser, {isLoading}] = useUpdateUserMutation();
  const dispatch = useDispatch();

  const { register, handleSubmit, reset} = useForm<UserData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    }
  });
  useEffect(() =>{
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    })
  }, [user, isEditing, reset]);

  const handleProfileEdit = async (data:UserData) =>{
    const {name, phoneNumber} = data;
    try {
      const result = await updateUser({userId:user?._id, userData:{name, phoneNumber}})
    if(result && result.data){
      dispatch(setUser(result?.data))
      dispatch(setUser(result?.data?.user));
      setIsEditing(false);
      toast.success('Profile Updated Succesfully')
    }else{
      throw new Error('Failed to update profile')
    }
    } catch (error) {
      console.error(error);
      toast.error('failed to update profile');
    }
  }

  return (
    <div className='space-y-6'>
      <div className='bg-gradient-to-r from-pink-500 to-rose-500 text-white p-8 rounded-lg shadow-lg'>
        <h1 className='text-4xl font-bold mb-2'>My Profile</h1>
        <p className='text-pink-100'>Manage your personal information and prefrences</p>
      </div>
      <Card className='border-t-4 border-t-pink-500 shadow-lg'>
        <CardHeader className='bg-gradient-to-r from-pink-50 to-rose-50'>
          <CardTitle className='mt-2'>
            Personal Information
          </CardTitle>
          <CardDescription className='mb-2'>
            Update your profile details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4 pt-6'>
          <form onSubmit={handleSubmit(handleProfileEdit)}>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                  <Input
                  id='username'
                  placeholder='john'
                  disabled={!isEditing}
                  className='pl-10'  
                  {...register('name')}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                  <Input
                  id='email'
                  placeholder='john.doe@example.com'
                  disabled={!isEditing || isEditing}
                  className='pl-10'  
                  {...register('email')}
                  />
                </div>
              </div>
              <div className='space-y-2 '>
                <Label htmlFor='phoneNumber'>Phone Number</Label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                  <Input
                  id='phoneNumber'
                  placeholder='+91-8295684775'
                  disabled={!isEditing}
                  className='pl-10'  
                  {...register('phoneNumber')}
                  />
                </div>
              </div>
            </div>
            <CardFooter className='bg-pink-100 mt-4 flex justify-between mb-5'>
              {isEditing ? (
                <>
                <Button
                type ="button"
                variant='outline'
                className='mt-4 mb-4'
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
                >
                  Discard Changes
                </Button>
                <Button
                type ="submit"
                variant='outline'
                className='bg-gradient-to-r from-pink-500 to-rose-500 text-white mt-4 mb-4'
                disabled={isLoading}
                >
                  {isLoading ? 'saving...' : 'Save Changes...'}
                </Button>
                </>
              ) : (
                <>
                <Button
                type ="button"
                variant='outline'
                className='bg-gradient-to-r mt-4 from-pink-600 to-rose-600 text-white mb-4'
                onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
                </>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default page;
