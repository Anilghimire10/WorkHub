import User from "../model/users.js";
import Gig from "../model/gig.js";
import Review from "../model/review.js";

export const datacount = async (req, res, next) => {
  try {
    // Count all users except those with isAdmin: true
    const userdata = await User.countDocuments({ isAdmin: { $ne: true } });
    console.log("Userdata count (excluding isAdmin: true):", userdata);

    // Count for other models if needed
    const gigdata = await Gig.countDocuments();
    const reviewdata = await Review.countDocuments();

    res.status(200).json({
      users: userdata,
      gig: gigdata,
      review: reviewdata,
    });
  } catch (err) {
    next(err);
  }
};
