import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";

export const isAuthenticated = async (req, res, next) => {
  // Debugging logs
  console.log("Checking authentication...");

  // Check if the user is authenticated via session (Passport.js)
  if (req.isAuthenticated()) {
    console.log("Authenticated via Passport session");
    req.userId = req.user._id;
    req.isSeller = req.user.isSeller;
    return next();
  }

  // If session-based authentication fails, check for JWT
  const { token } = req.cookies;
  if (token) {
    console.log("Token found in cookies:", token);
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.error("JWT verification failed:", err);
        return next(new ErrorHandler("Token is not Valid", 403));
      }
      console.log("Authenticated via JWT token");
      req.userId = payload._id;
      req.isSeller = payload.isSeller;
      return next();
    });
  } else {
    console.error("No authentication token found");
    return next(new ErrorHandler("You are not authenticated", 401));
  }
};
