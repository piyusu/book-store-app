import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConnect';
import authRoutes from './routes/authRoutes';
import ProductRoute from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import WishListRoutes from './routes/WishListRoutes';
import addressRoute from './routes/addressRoute';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoute';
import passport from './controllers/strategy/googleStrategy'

dotenv.config();

const port = process.env.PORT || 8088;

const app = express();

const corsOption = {
  origin: [
    "https://book-store-app-umber.vercel.app", // your frontend domain
    "http://localhost:3000" // if using local frontend for development
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOption));
app.use(express.json());
app.use(passport.initialize()); // Initialize passport for authentication
app.use(bodyParser.json());
app.use(cookieParser());

connectDB();

//api endpoints
app.use('/api/auth', authRoutes);

app.use('/api/product', ProductRoute);

app.use('/api/cart', cartRoutes);

app.use('/api/wishlist', WishListRoutes);

app.use('/api/address', addressRoute);

app.use('/api/user', userRoutes);

app.use('/api/order', orderRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});