import Order from "../model/Order.js";
import Gig from "../model/gig.js";

// export const createOrder = async (req, res, next) => {
//   try {
//     const { token, amount, gigId } = req.body;

//     // Verify payment with Khalti
//     const khaltiResponse = await axios.post(
//       "https://khalti.com/api/v2/payment/verify/",
//       { token, amount },
//       {
//         headers: {
//           Authorization: `Key test_secret_key_3722fd6257b84dab8251b1af3dbecd37`,
//         },
//       }
//     );

//     console.log(khaltiResponse);

//     if (khaltiResponse.data && khaltiResponse.data.state.name === "Completed") {
//       // If payment is successful, create order
//       const gig = await Gig.findById(gigId);

//       if (!gig) {
//         return res.status(404).json({
//           success: false,
//           message: "Gig not found",
//         });
//       }

//       const newOrder = new Order({
//         gigId: gig._id,
//         img: gig.cover,
//         title: gig.title,
//         price: gig.price,
//         buyerID: req.userId,
//         sellerID: gig.userId,
//       });

//       await newOrder.save();

//       res.status(200).json({
//         success: true,
//         message: "Order Successful",
//         data: khaltiResponse.data,
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Payment verification failed",
//       });
//     }
//   } catch (error) {
//     console.error("Error verifying payment or creating order:", error);

//     if (error.response) {
//       console.error("Server responded with:", error.response.data);
//       res.status(error.response.status).json({
//         success: false,
//         message: error.response.data.message || "Server Error",
//       });
//     } else if (error.request) {
//       console.error("No response received:", error.request);
//       res.status(500).json({
//         success: false,
//         message: "No response from server. Please try again later.",
//       });
//     } else {
//       console.error("Error details:", error.message);
//       res.status(500).json({
//         success: false,
//         message: "Unexpected error occurred. Please try again later.",
//       });
//     }
//   }
// };
export const createOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      price: gig.price,
      buyerID: req.userId,
      sellerID: gig.userId,
    });

    await newOrder.save();
    res.status(200).json({
      success: true,
      message: "Order Successful",
    });
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
