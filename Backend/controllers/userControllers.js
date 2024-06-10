import User from "../model/users.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../middlewares/error.js";
import { sendCookie } from "../utils/feature.js";

export const register = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return next(new ErrorHandler("User Already Exist", 404));

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user = new User({
      ...req.body,
      password: hashedPassword,
    });
    await user.save();

    sendCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user) return next(new ErrorHandler("Invalid Email or Password", 400));

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid Email or Password", 400));

    sendCookie(user, res, `Welcome back, ${user.username}`, 200);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      user: req.user,
      message: "You have been logged out",
    });
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("User isnot found", 404));

    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "User has been deleted Successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findById(req.params.id);
    if (!updatedUser) return next(new ErrorHandler("User isnot found", 404));

    await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      success: true,
      message: "User has been updated Successfully",
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
