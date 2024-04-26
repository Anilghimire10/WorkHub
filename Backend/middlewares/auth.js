import User from "../model/users.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return next(new ErrorHandler(401, "You arenot authenticated"));

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return next(new ErrorHandler(403, "Token is not Valid"));
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
  });

  next();
};

// export const isAuthenticated = (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) return next(new ErrorHandler(401, "You arenot authenticated"));

//   jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
//     if (err) return next(new ErrorHandler(403, "Token is not valid!"));
//     req.userId = payload.id;
//     req.isSeller = payload.isSeller;
//     next();
//   });
// };
