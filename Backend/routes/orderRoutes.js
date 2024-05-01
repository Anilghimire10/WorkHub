import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { createOrder, getOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/:gigId", isAuthenticated, createOrder);
router.get("/", isAuthenticated, getOrder);
export default router;
