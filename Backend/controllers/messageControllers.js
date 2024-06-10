import Message from "../model/Message.js";
import ErrorHandler from "../middlewares/error.js";
import Conversation from "../model/Conversation.js";

export const createMessage = async (req, res, next) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });
  try {
    const savedMessage = await newMessage.save();
    await Conversation.findByIdAndUpdate(
      req.body.conversationId,
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      savedMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const message = await Message.find({ conversationId: req.params.id });
    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};
