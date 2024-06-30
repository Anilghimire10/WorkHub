import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    phonenumber: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    preferences: {
      jobCategories: [String],
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
