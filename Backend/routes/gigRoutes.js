import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createGig,
  deleteGig,
  getAllGigs,
  getGigs,
  getGigsByUser,
  getSingleGig,
} from "../controllers/gigControllers.js";
import upload from "../utils/multer.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "images", maxCount: 5 },
  { name: "videos", maxCount: 1 },
]);

router.post("/new", isAuthenticated, uploadFields, createGig);

router.delete("/:id", isAuthenticated, deleteGig);
router.get("/single/:id", getSingleGig);
router.get("/user/:id", getGigsByUser);
router.get("/", getGigs);
router.get("/all", getAllGigs);

export default router;
