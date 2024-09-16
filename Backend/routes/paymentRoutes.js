import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Payment from "../model/Payment.js";
import moment from "moment-timezone";
import Gig from "../model/gig.js";
const router = express.Router();
dotenv.config();

router.post("/khalti", async (req, res) => {
  const { token, amount, gigId, userId } = req.body;

  try {
    const khaltiResponse = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      {
        token,
        amount,
      },
      {
        headers: {
          Authorization: `process.env.private_key`,
        },
      }
    );

    console.log("Khalti Response Data:", khaltiResponse.data);

    if (khaltiResponse?.data) {
      const { idx, state, user } = khaltiResponse.data;

      if (!user || !gigId || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "Payment validation failed: Missing user data, gigId, or userId.",
        });
      }
      const gig = await Gig.findById(gigId).select("title userId");
      if (!gig) {
        return res.status(404).json({
          success: false,
          message: "Gig not found.",
        });
      }
      const amountInRupees = amount / 100;

      const paymentData = {
        transactionId: idx,
        gigId,
        gigTitle: gig.title,
        userId,
        sellerId: gig.userId,
        amount: amountInRupees,
        dataFromVerificationReq: khaltiResponse.data,
        apiQueryFromUser: req.body,
        paymentGateway: "khalti",
        status: state?.name.toLowerCase() || "unknown",
      };

      const payment = new Payment(paymentData);
      await payment.save();

      res.json({
        success: true,
        data: khaltiResponse.data,
      });
    } else {
      res.json({
        success: false,
        message: "Payment verification failed.",
      });
    }
  } catch (error) {
    console.error("Error verifying payment with Khalti:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/payments", async (req, res) => {
  const { userId, sellerId, date } = req.query;

  try {
    let query = {};

    // Add userId filter if provided
    if (userId) {
      query.userId = userId;
    }

    // Add sellerId filter if provided
    if (sellerId) {
      query.sellerId = sellerId;
    }

    // Add date filter if provided
    if (date) {
      // Parse the received date and get the start and end of the day in UTC
      const startOfDayUTC = moment.utc(date).startOf("day").toDate();
      const endOfDayUTC = moment.utc(date).endOf("day").toDate();

      query.paymentDate = {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      };
    }

    // Fetch payments based on the constructed query
    const payments = await Payment.find(query);

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// // Get All Payments
router.get("/allPayment", async (req, res) => {
  const { date } = req.query;

  try {
    let query = {};

    // Add date filter if provided
    if (date) {
      // Parse the received date and get the start and end of the day in UTC
      const startOfDayUTC = moment.utc(date).startOf("day").toDate();
      const endOfDayUTC = moment.utc(date).endOf("day").toDate();

      query.createdAt = {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      };
    }

    // Fetch gigs based on the constructed query
    const payments = await Payment.find(query);

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default router;
