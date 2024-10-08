import ErrorHandler from "../middlewares/error.js";
import Conversation from "../model/Conversation.js";

export const createConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(201).json({
      success: true,
      savedConversation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (req, res, next) => {};

export const getConversations = async (req, res, next) => {
  try {
    console.log("first");
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    );
    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};
export const getSingleConversation = async (req, res, next) => {
  try {
    console.log("Requested conversation ID:", req.params.id);

    const conversation = await Conversation.findOne({ id: req.params.id });

    if (!conversation) {
      return next(new ErrorHandler("Conversation not found", 404));
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      {
        id: req.params.id,
      },
      {
        $set: {
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      updatedConversation,
    });
  } catch (error) {
    next(error);
  }
};
