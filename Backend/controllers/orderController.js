import Order from "../model/Order.js";
import Gig from "../model/gig.js";

// export const createOrder = async (req, res, next) => {
//   try {
//     const gig = await Gig.findById(req.params.gigId);

//     const newOrder = new Order({
//       gigId: gig._id,
//       img: gig.cover,
//       title: gig.title,
//       price: gig.price,
//       buyerID: req.userId,
//       sellerID: gig.userId,
//     });

//     await newOrder.save();

//     res.status(200).json({
//       success: true,
//       message: "Order Successful",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

import {
  initializeKhaltiPayment,
  verifyKhaltiPayment,
} from "../controllers/paymentController.js";

export const createOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    // Step 1: Initialize Khalti Payment
    const khaltiResponse = await initializeKhaltiPayment({
      return_url: `${process.env.CLIENT_URL}/payment-verification`,
      website_url: process.env.CLIENT_URL,
      amount: gig.price * 100, // Khalti expects amount in paisa
      purchase_order_id: gig._id.toString(),
      purchase_order_name: gig.title,
    });

    // Step 2: Store the order with a pending status
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      price: gig.price,
      buyerId: req.userId,
      sellerId: gig.userId,
      payment_intent: khaltiResponse.pidx, // Store the Khalti pidx
      status: "pending", // Set initial status to pending
    });

    await newOrder.save();

    // Step 3: Return the Khalti payment URL for the user to complete the payment
    res.status(200).json({
      success: true,
      message: "Order Created, Please Complete Payment",
      payment_url: khaltiResponse.payment_url, // Khalti payment URL
      pidx: khaltiResponse.pidx, // Payment identifier for later verification
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOrderPayment = async (req, res, next) => {
  try {
    const { pidx } = req.body;

    // Step 4: Verify Khalti Payment
    const paymentStatus = await verifyKhaltiPayment(pidx);

    if (paymentStatus.state.name === "Completed") {
      const updatedOrder = await Order.findOneAndUpdate(
        { payment_intent: pidx },
        { status: "completed" },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Payment Verified and Order Completed",
        order: updatedOrder,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not verified",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    console.log("User ID:", req.userId);
    console.log("Is Seller:", req.isSeller);

    const queryCondition = {
      ...(req.isSeller ? { sellerID: req.userId } : { buyerID: req.userId }),
      isCompleted: true,
    };

    console.log("Query Condition:", queryCondition);

    const orders = await Order.find(queryCondition);

    console.log("Orders found:", orders);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
