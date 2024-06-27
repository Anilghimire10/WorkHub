import express from "express";
import {
  deleteUser,
  getAllUser,
  // getPreferences,
  getUser,
  login,
  logout,
  register,
  requestSignupToken,
} from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
import passport from "passport";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/signup", requestSignupToken);
router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.get("/logout", logout);
router.delete("/:id", isAuthenticated, deleteUser);
router.get("/:userId", getUser);
router.get("/", getAllUser);
// router.post("/preferences", getPreferences);
//passport js routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
//callback route for google to redirect
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.send(req.user);
});
export default router;
