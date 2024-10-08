import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellerID: {
      type: String,
      required: true,
    },
    buyerID: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ["khalti"],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Order", OrderSchema);
