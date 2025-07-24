import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistStore, persistReducer,FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import userReducer from './slice/userSlice';
import cartReducer from './slice/cartSlice';
import wishlistReducer from './slice/wishlistSlice';
import checkoutReducer from  './slice/checkoutSlice';
import { api } from './api';
//persist configuration for userData
const userpersistConfig = {key:'user', storage, whitelist:['user','isLoggedIn','isEmailVerified']};
const cartpersistConfig = {key:'cart', storage, whitelist:['items']};
const wishlistpersistConfig = {key:'wishlist', storage,};
const checkoutpersistConfig = {key:'checkout', storage,};

//wrap reducers with persist config
const persistuserReducer = persistReducer(userpersistConfig, userReducer);
const persistcartReducer = persistReducer(cartpersistConfig, cartReducer);
const persistwishlistReducer = persistReducer(wishlistpersistConfig, wishlistReducer);
const persistcheckoutReducer = persistReducer(checkoutpersistConfig, checkoutReducer);

export const store = configureStore({
    reducer:{
        [api.reducerPath]: api.reducer, //RTK query api
        user: persistuserReducer, //persisted user reducer
        cart: persistcartReducer,
        wishlist: persistwishlistReducer,
        checkout: persistcheckoutReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck:{
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], //ignore these actions for serializable check
            }
        }).concat(api.middleware), //add api middleware to the store
})

setupListeners(store.dispatch); //setup listeners for RTK query

export const persistor = persistStore(store); //persistor for the store

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch