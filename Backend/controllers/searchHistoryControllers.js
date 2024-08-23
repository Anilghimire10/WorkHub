import SearchHistory from "../model/searchHistory.js";
import ErrorHandler from "../middlewares/error.js";

// Controller to handle saving search history
export const searchHistory = async (req, res, next) => {
  // Extract userId, searchQuery, and email from the request body
  const { userId, searchQuery, email } = req.body;

  // Validate the presence of required fields
  if (!userId || !searchQuery || !email) {
    return next(
      new ErrorHandler("User ID, search query, and email are required", 400)
    );
  }

  try {
    // Check if the search history already exists for the user and search query
    const existingHistory = await SearchHistory.findOne({
      userId,
      searchQuery,
      email,
    });

    if (existingHistory) {
      return res.status(200).json({
        success: true,
        message: "Search query already exists for this user.",
        searchHistory: existingHistory,
      });
    }

    // Create a new search history entry
    const newSearchHistory = new SearchHistory({ userId, searchQuery, email });
    await newSearchHistory.save();

    res.status(201).json({
      success: true,
      searchHistory: newSearchHistory,
    });
  } catch (error) {
    next(error); // Pass any errors to the error-handling middleware
  }
};
