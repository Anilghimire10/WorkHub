import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  try {
    const token = jwt.sign(
      { _id: user._id, isSeller: user.isSeller },
      process.env.JWT_SECRET,
      { expiresIn: "50m" } // Token expires in 50 minutes
    );

    // Set the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict", // Adjust as needed
      maxAge: 50 * 60 * 1000, // 50 minutes
    });

    // Send a response
    res.status(statusCode).json({
      success: true,
      message,
      userId: user._id,
      isSeller: user.isSeller,
      isAdmin: user.isAdmin,
      img: user.img,
      email: user.email,
    });
  } catch (err) {
    console.error("Error generating JWT token:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
