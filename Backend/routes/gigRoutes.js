import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
} from "../controllers/gigControllers.js";

const router = express.Router();

router.post("/new", isAuthenticated, createGig);
router.delete("/:id", isAuthenticated, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);

export default router;
