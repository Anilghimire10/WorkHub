// models/payment.js
import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema({
//   // userId: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: "User",
//   //   required: true,
//   // },
//   // amount: {
//   //   type: Number,
//   //   required: true,
//   // },
//   // paymentDate: {
//   //   type: Date,
//   //   default: Date.now,
//   // },
//   // paymentType: {
//   //   type: String,
//   //   required: true,
//   // },
//   // status: {
//   //   type: String,
//   //   enum: ["Pending", "Completed", "Failed"],
//   //   default: "Pending",
//   // },
//   // transactionId: {
//   //   type: String,
//   //   required: true,
//   // },
// });
const paymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true },
    pidx: { type: String, unique: true },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    amount: { type: Number, required: true },
    dataFromVerificationReq: { type: Object },
    apiQueryFromUser: { type: Object },
    paymentGateway: {
      type: String,
      enum: ["khalti", "esewa", "connectIps"],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
