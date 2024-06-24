import User from "../model/users.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../middlewares/error.js";
import { sendCookie } from "../utils/feature.js";

export const register = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return next(new ErrorHandler("User Already Exist", 404));
    const img = req.file ? req.file.filename : null;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user = new User({
      ...req.body,
      password: hashedPassword,
      img,
    });
    await user.save();

    sendCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler("Invalid Email or Password", 400));
    }

    // If login successful, send back user information to the client
    const userData = {
      userId: user._id,
      username: user.username,
      email: user.email,
      // Add more fields as needed
    };

    sendCookie(user, res, `Welcome back, ${user.username}`, 200); // Send cookie as per your implementation
    res.status(200).json({ success: true, ...userData }); // Send user data back to client
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

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorHandler(`User with ID ${userId} not found`, 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
