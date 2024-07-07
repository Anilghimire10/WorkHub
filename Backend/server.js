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
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Resolve __dirname

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
  }
};

// Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
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

// Route to fetch search-based recommendations from Flask API
app.get("/api/recommendations/search/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log("Fetching recommendations for userId:", userId); // Log userId to debug
    const response = await axios.get(
      `http://localhost:5000/api/recommendations/search?userId=${userId}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching search recommendations:", error);
    res.status(500).json({ error: "Failed to fetch search recommendations" });
  }
});

// Route to fetch star-based recommendations from Flask API
app.get("/api/recommendations/stars", async (req, res) => {
  try {
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

// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import userRoutes from "./routes/userRoutes.js";
// import gigRoutes from "./routes/gigRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import conversationRoutes from "./routes/conversationRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import searchHistoryRoutes from "./routes/searchHistoryRoutes.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import axios from "axios";
// import { isAuthenticated } from "./middlewares/auth.js";
// import { errorMiddleware } from "./middlewares/error.js";
// import passport from "passport";
// import "./config/passport-setup.js";
// import session from "express-session";
// const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Resolve __dirname

// const app = express();

// // Set up session cookies
// app.use(
//   session({
//     secret: process.env.COOKIE_SECRET || "your-secret-key",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true },
//   })
// );

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// dotenv.config();
// mongoose.set("strictQuery", true);

// const connect = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO);
//     console.log("Connected to the database");
//   } catch (error) {
//     console.log(error);
//   }
// };

// // Using middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "PUT", "POST", "DELETE"],
//     credentials: true, // Allow credentials
//   })
// );

// // Serving static files from the 'uploads' directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Routes
// app.use("/api/user", userRoutes);
// app.use("/api/gig", gigRoutes);
// app.use("/api/review", reviewRoutes);
// app.use("/api/order", orderRoutes);
// app.use("/api/conversation", conversationRoutes);
// app.use("/api/message", messageRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/search", searchHistoryRoutes);

// // Route to fetch search-based recommendations from Flask API
// app.get(
//   "/api/recommendations/search/:userId",
//   isAuthenticated,
//   async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const response = await axios.get(
//         `http://localhost:5000/api/recommendations/search?userId=${userId}`
//       );
//       res.json(response.data);
//     } catch (error) {
//       console.error("Error fetching search recommendations:", error);
//       res.status(500).json({ error: "Failed to fetch search recommendations" });
//     }
//   }
// );

// // Route to fetch star-based recommendations from Flask API
// app.get("/api/recommendations/stars", isAuthenticated, async (req, res) => {
//   try {
//     const response = await axios.get(
//       "http://localhost:5000/api/recommendations/stars"
//     );
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching star ratings recommendations:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to fetch star ratings recommendations" });
//   }
// });

// app.listen(process.env.PORT, () => {
//   connect();
//   console.log(`Server is working on port ${process.env.PORT}`);
// });

// // Using Error Middleware
// app.use(errorMiddleware);
