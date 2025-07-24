import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { register } from "module";

export const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const API_URLS = {
  //user Related urls
  REGISTER: `${BASE_URL}/auth/register`,
  LOGIN: `${BASE_URL}/auth/login`,
  VERIFY_EMAIL: (token: string) => `${BASE_URL}/auth/verify-email/${token}`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: (token: string) => `${BASE_URL}/auth/reset-password/${token}`,
  VERIFFY_AUTH: `${BASE_URL}/auth/verify-auth`,
  UPDATE_USER: (userId: string) => `${BASE_URL}/user/update/${userId}`,
  LOGOUT: `${BASE_URL}/auth/logout`,

  //Product related urls
  PRODUCTS: `${BASE_URL}/product`,
  PRODUCT_BY_ID: (id: string) => `${BASE_URL}/product/${id}`,
  GET_PRODUCT_BY_SELLER_ID: (sellerId: string) =>
    `${BASE_URL}/product/seller/${sellerId}`,
  DELETE_PRODUCT_BY_PRODUCT_ID: (productId: string) =>
    `${BASE_URL}/product/seller/${productId}`,

  //cart related urls
  CART: (userId: string) => `${BASE_URL}/cart/${userId}`,
  ADD_TO_CART: `${BASE_URL}/cart/add`,
  REMOVE_FROM_CART: (productId: string) =>
    `${BASE_URL}/cart/remove/${productId}`,

  //order related urls
  CREATE_OR_UPDATE_ORDER: `${BASE_URL}/order/create-or-update`,
  GET_ORDER_BY_ID: (orderId: string) => `${BASE_URL}/order/${orderId}`,
  GET_ORDER: `${BASE_URL}/order/`,
  CREATE_RAZORPAY_PAYMENT: `${BASE_URL}/order/payment-razorpay`,

  //wishList related urls
  WISHLIST: (userId: string) => `${BASE_URL}/wishlist/${userId}`,
  ADD_TO_WISHLIST: `${BASE_URL}/wishlist/add`,
  REMOVE_FROM_WISHLIST: (productId: string) =>
    `${BASE_URL}/wishlist/remove/${productId}`,

  //address related urls
  GET_ADDRESS: `${BASE_URL}/address/get`,
  ADD_ADDRESS: `${BASE_URL}/address/create-or-update`,
};

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  tagTypes: ["User", "Product", "Cart", "Order", "Wishlist", "Address"],
  endpoints: (builder) => ({
    //user Endpoints
    register: builder.mutation({
      query: (userData) => ({
        url: API_URLS.REGISTER,
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: API_URLS.LOGIN,
        method: "POST",
        body: userData,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: API_URLS.VERIFY_EMAIL(token),
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: API_URLS.FORGOT_PASSWORD,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: API_URLS.RESET_PASSWORD(token),
        method: "POST",
        body: { newPassword },
      }),
    }),
    verifyAuth: builder.mutation({
      query: () => ({
        url: API_URLS.VERIFFY_AUTH,
        method: "GET",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_URLS.LOGOUT,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: API_URLS.UPDATE_USER(userId),
        method: "PUT",
        body: userData,
      }),
    }),
    //Product Endpoints
    addProduct: builder.mutation({
      query: (productData) => ({
        url: API_URLS.PRODUCTS,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    getProducts: builder.query({
      query: () => API_URLS.PRODUCTS,
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => API_URLS.PRODUCT_BY_ID(id),
      providesTags: ["Product"],
    }),
    getProductBySellerId: builder.query({
      query: (sellerId) => API_URLS.GET_PRODUCT_BY_SELLER_ID(sellerId),
      providesTags: ["Product"],
    }),
    deleteProductById: builder.mutation({
      query: (productId) => ({
        url: API_URLS.DELETE_PRODUCT_BY_PRODUCT_ID(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    //Cart Endpoints
    getCart: builder.query({
      query: (userId) => API_URLS.CART(userId),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (productData) => ({
        url: API_URLS.ADD_TO_CART,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_CART(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    //wishlist Endpoints
    getWishlist: builder.query({
      query: (userId) => API_URLS.WISHLIST(userId),
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: API_URLS.ADD_TO_WISHLIST,
        method: "POST",
        body: productId,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_WISHLIST(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
    //Order Endpoints
    createOrUpdateOrder: builder.mutation({
      query: (body) => ({
        url: API_URLS.CREATE_OR_UPDATE_ORDER,
        method: body?.orderId ? "PATCH" : "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (orderId) => API_URLS.GET_ORDER_BY_ID(orderId),
      providesTags: ["Order"],
    }),
    getUserOrders: builder.query({
      query: () => API_URLS.GET_ORDER,
      providesTags: ["Order"],
    }),
    createRazorpayPayment: builder.mutation({
      query: (orderId) => ({
        url: API_URLS.CREATE_RAZORPAY_PAYMENT,
        method: "POST",
        body: { orderId },
      }),
      invalidatesTags: ["Order"],
    }),
    //Address Endpoints
    getAddress: builder.query<any[], void>({
      query: () => API_URLS.GET_ADDRESS,
      providesTags: ["Address"],
    }),
    addOrUPdateAddress: builder.mutation<any, any>({
      query: (address) => ({
        url: API_URLS.ADD_ADDRESS,
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyAuthMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useAddProductMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySellerIdQuery,
  useDeleteProductByIdMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCreateOrUpdateOrderMutation,
  useGetOrderByIdQuery,
  useGetUserOrdersQuery,
  useCreateRazorpayPaymentMutation,
  useGetAddressQuery,
  useAddOrUPdateAddressMutation,
} = api;
