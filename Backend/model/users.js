// model/users.js
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
      required: function () {
        return !this.googleId;
      },
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
      default: "Nepal",
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
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("remove", async function (next) {
  try {
    await this.model("Gig").deleteMany({ userId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("User", userSchema);
