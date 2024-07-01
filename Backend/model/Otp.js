import mongoose from "mongoose";
const { Schema } = mongoose;

const OtpSchema = new Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    userDetails: {
      username: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      img: { type: String, required: false },
      phonenumber: { type: String, required: false },
      country: { type: String, required: true },
      desc: { type: String, required: false },
      isSeller: { type: Boolean },
    },
    type: {
      type: String,
      enum: ["signup"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("OTP", OtpSchema);
