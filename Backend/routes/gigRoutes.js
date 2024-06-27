import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createGig,
  deleteGig,
  getGigs,
  getGigsByUser,
  getSingleGig,
} from "../controllers/gigControllers.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post(
  "/new",
  isAuthenticated,
  upload.single("cover"),
  upload.array("images", 5),
  createGig
);
router.delete("/:id", isAuthenticated, deleteGig);
router.get("/single/:id", getSingleGig);
router.get("/user/:id", getGigsByUser);
router.get("/", getGigs);

export default router;
