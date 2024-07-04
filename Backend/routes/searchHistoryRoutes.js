import express from "express";
import { searchHistory } from "../controllers/searchHistoryControllers.js";

const router = express.Router();

router.post("/search-history", searchHistory);

export default router;
