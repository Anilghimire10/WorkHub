import express from "express";
import { datacount } from "../controllers/dataCountController.js";

const app = express();
const router = express.Router();

router.get("/data-count", datacount);

export default router;
