import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  try {
    const token = jwt.sign(
      { _id: user._id, isSeller: user.isSeller },
      process.env.JWT_SECRET
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
        isSeller: user.isSeller,
        img: user.img,
      });
  } catch (err) {
    console.error("Error generating JWT token:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
