import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createReview,
  deleteReview,
  getReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", isAuthenticated, createReview);
router.get("/:gigId", getReviews);
router.delete("/:id", isAuthenticated, deleteReview);

export default router;
