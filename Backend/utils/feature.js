import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  try {
    const token = jwt.sign(
      { _id: user._id, isSeller: user.isSeller },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Example: Token expires in 15 minutes
    );

    res
      .status(statusCode)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
      })
      .json({
        success: true,
        message,
        userId: user._id,
        isSeller: user.isSeller, // Include isSeller in the response if needed
      });
  } catch (err) {
    console.error("Error generating JWT token:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
