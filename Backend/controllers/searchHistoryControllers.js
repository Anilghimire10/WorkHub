import SearchHistory from "../model/searchHistory.js";

export const searchHistory = async (req, res, next) => {
  const { userId, searchQuery } = req.body;
  if (!userId || !searchQuery)
    return next(new ErrorHandler("User ID and search query are required", 404));
  try {
    const newSearchHistory = new SearchHistory({ userId, searchQuery });
    await newSearchHistory.save();
    res.status(201).json({
      success: true,
      newSearchHistory,
    });
  } catch (error) {
    next(error);
  }
};
