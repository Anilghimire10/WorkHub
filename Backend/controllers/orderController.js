import Order from "../model/Order.js";
import Gig from "../model/gig.js";

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
