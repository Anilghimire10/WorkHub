import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createMessage,
  getMessages,
} from "../controllers/messageControllers.js";

const router = express.Router();

router.post("/", isAuthenticated, createMessage);
router.get("/:id", isAuthenticated, getMessages);

export default router;
