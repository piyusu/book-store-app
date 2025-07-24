"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddToCartMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";
import { removeFromWishListAction } from "@/store/slice/wishlistSlice";
import { addToCart } from "@/store/slice/cartSlice";
import { BookDetails } from "@/lib/types/type";
import BookLoader from "@/lib/BookLoader";
import NoData from "@/app/components/NoData";
import { Check, Heart, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addToCartMutation] = useAddToCartMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const [isAddToCart, setIsAddToCart] = useState(false);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart.items);
  const { data: wishlistData, isLoading } = useGetWishlistQuery({});
  const [wishlistItems, setWishListItems] = useState<BookDetails[]>([]);

  useEffect(() => {
    if (wishlistData?.success) {
      setWishListItems(wishlistData?.data?.products);
    }
  }, [wishlistData]);

  const handleAddToCart = async (productId: string) => {
    setIsAddToCart(true);
    try {
      const result = await addToCartMutation({
        productId,
        quantity: 1,
      }).unwrap();
      if (result.success && result.data) {
        dispatch(addToCart(result.data));
        toast.success(result.message || "Added to cart successfully");
      } else {
        throw new Error(result.message || "Failed to add to cart");
      }
    } catch (error: any) {
      const errormessage = error?.data?.message;
      toast.error(errormessage);
    } finally {
      setIsAddToCart(false);
    }
  };

  const toggleWishList = async (productId: string) => {
    try {
      const isInWishList = wishlist.some((item) =>
        item.products.includes(productId)
      );

      if (isInWishList) {
        const result = await removeFromWishlistMutation({ productId }).unwrap();
        if (result.success) {
          dispatch(removeFromWishListAction(productId));
          toast.success(
            result.message || "Removed from wishlist successfully."
          );
        } else {
          throw new Error(result.message || "Failed to remove from wishlist.");
        }
      }
    } catch (error: any) {
      const errormessage = error?.data?.message;
      toast.error(errormessage || "Failed to remove to wishlist");
    }
  };

  const isItemInCart = (productId: string) => {
    return cart.some((carItem) => carItem.product._id === productId);
  };

  if (isLoading) return <BookLoader />;

  if (!wishlistItems.length)
    return (
      <NoData
        message="Your wishlist is empty."
        description="Looks like you haven't added any items to your wishlist yet. 
             Browse our collection and save your favorites!"
        buttonText="Browse Books"
        imageUrl="/images/wishlist.webp"
        onClick={() => router.push("/books")}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Heart className="h-6 w-6 text-red-700" />
        <h3 className="text-2xl font-bold">My Wishlist</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {wishlistItems.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <CardTitle className="mt-3">{item.title}</CardTitle>
              <CardDescription className='mt-2'>₹{item.finalPrice.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                className="aspect-square w-full object-cover"
                src={item.images[0]}
                alt={item.title}
              />
            </CardContent>
            <CardFooter className="flex justify-between mb-6">
              <Button
              variant='outline'
              size='icon'
              onClick={()=> toggleWishList(item._id)}
              >
                <Trash2 className="h-4 w-4"/>
              </Button>
                {isItemInCart(item?._id) ? (
                  <Button disabled>
                    <Check className='mr-2 h-5 w-5'/>
                    Item in Cart
                  </Button>
                ) : (
                <Button
                onClick={() => handleAddToCart(item?._id)}
              >
                {isAddToCart ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
                )}
              
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
