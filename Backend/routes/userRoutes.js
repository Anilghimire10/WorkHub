// routes/userRoutes.js
import express from "express";
import passport from "passport";
import {
  deleteUser,
  getAllUser,
  getPreferences,
  getUser,
  login,
  logout,
  register,
  requestSignupToken,
  updateUser,
} from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../utils/multer.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/signup", upload.single("image"), requestSignupToken);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.delete("/:id", isAuthenticated, deleteUser);
router.put("/:id", upload.single("img"), updateUser);
router.get("/:userId", getUser);
router.get("/", getAllUser);
router.post("/preferences", getPreferences);

router.get("/login/success", (req, res) => {
  // console.log("Session:", req.session);
  // console.log("User:", req.user); // Log user details for debugging

  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: {
        userId: req.user._id.toString(), // Ensure userId is present and converted to string
        username: req.user.username,
        email: req.user.email,
        // other fields you want to include
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Authentication failed. User not authenticated.",
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});
// Passport.js routes
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route for Google to redirect
router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  (req, res) => {
    // This function runs after successful authentication
    // console.log("Session after Google redirect:", req.session);
    // console.log("User after Google redirect:", req.user);
    res.redirect(process.env.CLIENT_URL); // Redirect to your client URL after successful login
  }
);

export default router;
