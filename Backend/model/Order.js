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
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellerID: {
      type: Number,
      required: true,
    },
    buyerID: {
      type: Number,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Order", OrderSchema);
