"use client";
import NoData from "@/app/components/NoData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BookLoader from "@/lib/BookLoader";
import { Order } from "@/lib/types/type";
import { useGetUserOrdersQuery } from "@/store/api";
import { Calendar, CreditCard, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import OrderDetailsdialog from "./OrderDetailsdialog";

const page = () => {
  const { data: orderData, isLoading } = useGetUserOrdersQuery({});
  const [showAllOrders, setShowAllOrders] = useState(false);
  const router = useRouter();
  if (isLoading) {
    return <BookLoader />;
  }

  const orders: Order[] = orderData?.data || [];
  const displayOrders = showAllOrders ? orders : orders.slice(0, 4);

  if (orders.length === 0) {
    return (
      <div className="my-10 max-w-3xl justify-center mx-auto">
        <NoData
          imageUrl="/images/no-book.jpg"
          message="You haven't order any books yet."
          description="Start order your books to reach potential buyers. order your first book now!"
          onClick={() => router.push("/books")}
          buttonText="Order Your First Book"
        />
      </div>
    );
  }
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="bg-gradient-to-r from bg-orange-500 to-amber-500 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 mt-2">My Orders</h1>
        <p className="text-purple-100">view and manage your recent purchases</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {displayOrders.map((order) => (
          <Card className="flex flex-col" key={order?._id}>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-lg sm:text-xl text-purple-700 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Order #{order?._id.slice(-6)}
              </CardTitle>
              <CardDescription className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 mb-3" />
                {new Date(order?.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <p className="font-medium">
                  {order.items.map((item) => item.product.title).join(", ")}
                </p>
                <div className="text-sm flex gap-2 text-gray-600">
                  <span>
                    {order.items.map((item) => item.product.subject).join(", ")}
                  </span>
                  <span>
                    ({order.items.map((item) => item.product.author).join(", ")}
                    )
                  </span>
                </div>
                <p className="text-sm flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Total: ₹{order?.totalAmount}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order?.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order?.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order?.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  > {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-purple-50 mb-4">
              <OrderDetailsdialog order={order}/>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button 
        onClick={() => setShowAllOrders(!showAllOrders)} 
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          {showAllOrders ? 'show Less' : 'View All orders'}
        </Button>
      </div>
    </div>
  );
};

export default page;
