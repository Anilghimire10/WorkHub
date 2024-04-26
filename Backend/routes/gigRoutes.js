import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
} from "../controllers/gigControllers.js";

router.post("/", isAuthenticated, createGig);
router.delete("/:id", isAuthenticated, deleteGig);
router.post("/single/:id", isAuthenticated, getGig);
router.post("/", isAuthenticated, getGigs);

export default router;
