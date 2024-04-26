import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    ConversationId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Message", messageSchema);
