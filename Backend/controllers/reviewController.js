import ErrorHandler from "../middlewares/error.js";
import Review from "../model/review.js";
import Gig from "../model/gig.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(new ErrorHandler("Sellers can't create Review", 403));
  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });
  try {
    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });
    if (review)
      return next(new ErrorHandler("You have already created a review", 403));

    const savedReview = await newReview.save();
    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });

    await res.status(201).json({
      success: true,
      savedReview,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    // Ensure req.userId is available before proceeding
    if (!req.userId) {
      return next(new ErrorHandler("User ID is missing in the request", 401));
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorHandler("Review not found", 404));
    }

    if (review.userId !== req.userId) {
      return next(new ErrorHandler("You can only delete your review", 403));
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Your review has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
