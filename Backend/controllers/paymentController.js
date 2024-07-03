// controllers/paymentController.js
import axios from "axios";
import Payment from "../model/Payment.js";

export const createPayment = async (req, res, next) => {
  try {
    const { token, amount } = req.body;
    const khaltiresponse = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      {
        token,
        amount,
      },
      {
        headers: {
          Authorization: `Key test_secret_key_3722fd6257b84dab8251b1af3dbecd37`,
        },
      }
    );
    console.log(khaltiresponse);
    if (khaltiresponse) {
      res.json({
        success: true,
        data: khaltiresponse?.data,
      });
    } else {
      res.json({
        success: false,
        message: "Something Went Wrong",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);

    if (error.response) {
      console.error("Server responded with:", error.response.data);
      res.status(error.response.status).json({
        success: false,
        message: error.response.data.message || "Server Error",
      });
    } else if (error.request) {
      console.error("No response received:", error.request);
      res.status(500).json({
        success: false,
        message: "No response from server. Please try again later.",
      });
    } else {
      console.error("Error details:", error.message);
      res.status(500).json({
        success: false,
        message: "Unexpected error occurred. Please try again later.",
      });
    }
  }
};
// export const createPayment = async (req, res) => {
//   const { token, amount, userId, paymentType } = req.body;

//   try {
//     // Simulate Khalti API response
//     const khaltiResponse = {
//       data: {
//         idx: "sample_transaction_id",
//       },
//     };

//     const newPayment = new Payment({
//       userId,
//       amount,
//       paymentType,
//       status: "Completed",
//       transactionId: khaltiResponse.data.idx,
//     });
//     await newPayment.save();

//     res.json({
//       success: true,
//       data: khaltiResponse.data,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const payments = await Payment.find({ userId }).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const { status } = req.body;
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(updatedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
