import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import gigRoutes from "./routes/gigRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import searchHistoryRoutes from "./routes/searchHistoryRoutes.js";
import dataCountRoutes from "./routes/dataCountRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import axios from "axios";
import passport from "passport";
import session from "express-session";
import "./config/passport-setup.js";
import { scheduleDailyRecommendationCheck } from "./utils/cronScheduler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Resolve __dirname

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to the database");
    scheduleDailyRecommendationCheck();
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

// Set up session cookies
app.use(
  session({
    secret: process.env.Cookie_Session || "hehehe",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure HTTPS in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week expiration
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true, // Ensure cookies are sent
  })
);

// Serving static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/gig", gigRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/search", searchHistoryRoutes);
app.use("/api/datacount", dataCountRoutes);
// Route to fetch star-based recommendations from Flask API
app.get("/api/recommendations/stars", async (req, res) => {
  try {
    console.log("Fetching star ratings recommendations");
    const response = await axios.get(
      "http://localhost:5000/api/recommendations/stars"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching star ratings recommendations:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch star ratings recommendations" });
  }
});

app.listen(process.env.PORT, () => {
  connect();
  console.log(`Server is working on port ${process.env.PORT}`);
});

// Using Error Middleware
app.use(errorMiddleware);
