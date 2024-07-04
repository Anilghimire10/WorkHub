import mongoose from "mongoose";
const { Schema } = mongoose;

const SearchHistorySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    searchQuery: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SearchHistory", SearchHistorySchema);
