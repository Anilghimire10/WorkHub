import { fileURLToPath } from "url";
import path from "path";
import bcrypt from "bcrypt";
import ejs from "ejs";
import { sendEmail } from "../utils/mailHandler.js";
import OTP from "../model/Otp.js";
import User from "../model/users.js";
import Gig from "../model/gig.js";
import { sendCookie } from "../utils/feature.js";
import ErrorHandler from "../middlewares/error.js";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const requestSignupToken = async (req, res, next) => {
  try {
    // Log the entire request body
    console.log("Request Body:", req.body);

    // Check if an image file is included in the request
    console.log("File:", req.file);

    let user = await User.findOne({ email: req.body.email });
    if (user) return next(new ErrorHandler("User Already Exist", 404));

    const { username, email, password, phonenumber, country, desc, isSeller } =
      req.body;

    const img = req.file ? req.file.filename : null;

    // Get all OTPs
    const otpResult = await OTP.find();

    function createOTP() {
      let otp = Math.floor(10000 + Math.random() * 90000);

      // Make sure that the OTP is unique
      while (otpResult.some((otpDoc) => otpDoc.otp === otp)) {
        otp = Math.floor(10000 + Math.random() * 90000);
      }
      return otp;
    }

    const otp = createOTP();

    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 5); // Increase to 5 minutes

    const otpTemplate = await ejs.renderFile(
      path.join(path.resolve(), "./views/signupOTPTemplate.ejs"),
      {
        otp,
      }
    );
    const subject = "Verify | WorkHUb";
    await sendEmail({
      recipientEmail: email,
      subject,
      emailTemplate: otpTemplate,
    });

    const OTPDoc = await OTP.create({
      email,
      otp,
      expiresAt: otpExpiration,
      userDetails: {
        username,
        email,
        password,
        img,
        phonenumber,
        country,
        desc,
        isSeller,
      },
      type: "signup",
    });

    res.status(200).json({
      status: "Building",
      data: OTPDoc,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { otp } = req.body;

    // Log the received OTP and email for debugging
    // console.log("Received Email:", email);
    // console.log("Received OTP:", otp);

    const otpDoc = await OTP.findOne({ otp, type: "signup" });

    // Log the OTP document found in the database
    // console.log("OTP Document:", otpDoc);

    if (!otpDoc) {
      console.log("OTP not found or does not match.");
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }

    // Log the current date and OTP expiration date for comparison
    // console.log("Current Date:", new Date());
    // console.log("OTP Expiration Date:", otpDoc.expiresAt);

    if (otpDoc.expiresAt < new Date()) {
      console.log(
        "OTP expired. Current time:",
        new Date(),
        "OTP expiration time:",
        otpDoc.expiresAt
      );
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }

    const {
      username,
      password,
      email,
      img,
      phonenumber,
      country,
      desc,
      isSeller,
    } = otpDoc.userDetails;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      img,
      phonenumber,
      country,
      desc,
      isSeller,
    });

    await user.save();
    await OTP.deleteOne({ _id: otpDoc._id });

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
    .clearCookie("connect.sid", { path: "/" }) // Clear session cookie
    .clearCookie("token", { path: "/" }) // Clear authentication token cookie
    .json({
      success: true,
      user: null,
      message: "You have been logged out",
    });
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete associated gigs
    await Gig.deleteMany({ userId: user._id });
    // Remove user and associated gigs
    await User.deleteOne({ _id: req.params.id });
    res.status(200).clearCookie("token").json({
      success: true,
      message: "User and associated gigs have been deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// export const updateUser = async (req, res, next) => {
//   try {
//     const updatedUser = await User.findById(req.params.id);
//     console.log("User:", updatedUser);
//     if (!updatedUser) return next(new ErrorHandler("User isnot found", 404));

//     await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json({
//       success: true,
//       message: "User has been updated Successfully",
//       updatedUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const updateUser = async (req, res, next) => {
  try {
    console.log("Update request body:", req.body);
    console.log("Uploaded file:", req.file);

    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("User not found", 404));

    // Prepare the update object
    const updateData = { ...req.body };

    // Check if a new image file is uploaded
    if (req.file) {
      updateData.img = req.file.filename; // Save the new image filename
    }

    // Update user with validated data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("User after update:", updatedUser);

    res.status(200).json({
      success: true,
      message: "User has been updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("UserID:", userId);
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

export const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find();
    if (!user) return next(new ErrorHandler("User not Found", 404));
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getPreferences = async (req, res, next) => {
  const { userId, jobCategories } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user preferences with jobCategories
    user.preferences.jobCategories = jobCategories;

    // Save updated user document
    await user.save();

    return res
      .status(200)
      .json({ message: "User preferences updated successfully" });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return res
      .status(500)
      .json({ error: "Server error, failed to update preferences" });
  }
};
