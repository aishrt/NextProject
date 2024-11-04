import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    blockedBy: {
      type: mongoose.Schema.ObjectId,
    },
    lastMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.models.Chats || mongoose.model("Chats", ChatSchema);

export default ChatModel;
