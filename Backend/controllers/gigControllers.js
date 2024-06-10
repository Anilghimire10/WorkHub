import Gig from "../model/gig.js";
import ErrorHandler from "../middlewares/error.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(new ErrorHandler("Only sellers can create a gig", 403));

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });
  try {
    const savedGig = await newGig.save();
    res.status(201).json({
      success: true,
      savedGig,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    // console.log(gig.userId);
    // console.log(req.userId);
    if (gig.userId !== req.userId)
      return next(new ErrorHandler("You can only delete your gig", 403));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Your gig has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(new ErrorHandler("Gig not found", 404));
    res.status(200).json({
      success: true,
      gig,
    });
  } catch (error) {
    next(error);
  }
};

export const getGigs = async (req, res) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.category && { category: q.category }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gte: q.min }),
        ...(q.max && { $lte: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  console.log("Filters applied:", filters);
  try {
    console.log(filters);
    const gigs = await Gig.find(filters);
    if (!gigs) return next(new ErrorHandler("Gigs not found", 404));
    res.status(200).json({
      success: true,
      gigs,
    });
  } catch (error) {
    next(error);
  }
};
