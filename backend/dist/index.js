"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const WishListRoutes_1 = __importDefault(require("./routes/WishListRoutes"));
const addressRoute_1 = __importDefault(require("./routes/addressRoute"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const googleStrategy_1 = __importDefault(require("./controllers/strategy/googleStrategy"));
dotenv_1.default.config();
const port = process.env.PORT || 8088;
const app = (0, express_1.default)();
const corsOption = {
    origin: [
        "https://book-store-app-umber.vercel.app", // your frontend domain
        "http://localhost:3000" // if using local frontend for development
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOption));
app.use(express_1.default.json());
app.use(googleStrategy_1.default.initialize()); // Initialize passport for authentication
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, dbConnect_1.default)();
//api endpoints
app.use('/api/auth', authRoutes_1.default);
app.use('/api/product', productRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/wishlist', WishListRoutes_1.default);
app.use('/api/address', addressRoute_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/order', orderRoute_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
