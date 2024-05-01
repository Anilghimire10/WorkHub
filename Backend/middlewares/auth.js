import User from "../model/users.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  // console.log("Token:", token);
  if (!token) return next(new ErrorHandler(401, "You arenot authenticated"));

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return next(new ErrorHandler(403, "Token is not Valid"));
    // console.log("Decoded Payload:", payload);
    req.userId = payload._id;
    req.isSeller = payload.isSeller;
    next();
  });
};
