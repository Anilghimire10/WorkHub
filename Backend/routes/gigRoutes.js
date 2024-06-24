import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
} from "../controllers/gigControllers.js";
import upload from "../utils/multer.js";
const router = express.Router();
// const uploadFields = upload.fields([
//   { name: "cover", maxCount: 1 },
//   { name: "images", maxCount: 5 },
// ]);
router.post(
  "/new",
  isAuthenticated,
  upload.single("cover"),
  upload.array("images", 5),
  createGig
);
router.delete("/:id", isAuthenticated, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);

export default router;
