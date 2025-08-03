// server/app.js
import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import expressFileUpload from "express-fileupload";
import { notifyUsers } from "./services/notifyUser.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

// Import all necessary routers
import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";
import kycRouter from "./routes/kycRouter.js";       // For KYC management
import commentRouter from "./routes/commentRouter.js"; // For handling comments
import prebookingRouter from "./routes/prebookingRouter.js"; // For book pre-bookings

export const app = express();

// Load environment variables from .env file
config({ path: "./config/config.env" });

// --- MIDDLEWARE ---
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressFileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

// --- ROUTERS ---
// Mount all API routers here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/kyc", kycRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/prebook", prebookingRouter);

// --- SERVICES & DB CONNECTION ---
// Call services and connect to the database
notifyUsers();
removeUnverifiedAccounts();
connectDB();
 
// --- ERROR HANDLING MIDDLEWARE ---
// This should always be the last middleware loaded
app.use(errorMiddleware);
