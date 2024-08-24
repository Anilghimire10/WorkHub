import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true, required: true },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    userId: { type: String, required: true }, // ID of the person making the payment
    sellerId: { type: String, required: true }, // ID of the person who created the gig    amount: { type: Number, required: true },
    dataFromVerificationReq: { type: Object, required: true },
    amount: { type: String, required: true },
    apiQueryFromUser: { type: Object, required: true },
    paymentGateway: {
      type: String,
      enum: ["khalti", "esewa", "connectIps"],
      required: true,
    },
    gigTitle: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"], // Add valid statuses here
      default: "pending",
    },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
