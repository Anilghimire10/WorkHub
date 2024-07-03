// routes/payment.js
import express from "express";
import {
  createPayment,
  getPaymentHistory,
  getPaymentById,
  updatePaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/khalti", createPayment);
router.get("/:userId", getPaymentHistory);
router.get("/payment/:paymentId", getPaymentById);
router.put("/:paymentId", updatePaymentStatus);

export default router;
