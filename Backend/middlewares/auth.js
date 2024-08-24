import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";

export const isAuthenticated = async (req, res, next) => {
  // Check if the user is authenticated via session (Passport.js)
  if (req.isAuthenticated()) {
    req.userId = req.user._id;
    req.isSeller = req.user.isSeller;
    req.isAdmin = req.user.isAdmin; // Add isAdmin check here
    return next();
  }

  // If session-based authentication fails, check for JWT
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.error("JWT verification failed:", err);
        return next(new ErrorHandler("Token is not Valid", 403));
      }
      req.userId = payload._id;
      req.isSeller = payload.isSeller;
      req.isAdmin = payload.isAdmin; // Add isAdmin check here
      return next();
    });
  } else {
    console.error("No authentication token found");
    return next(new ErrorHandler("You are not authenticated", 401));
  }
};
