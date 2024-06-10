import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", isAuthenticated, getConversations);
router.post("/", isAuthenticated, createConversation);
router.get("/single/:id", isAuthenticated, getSingleConversation);
router.put("/:id", isAuthenticated, updateConversation);

export default router;
