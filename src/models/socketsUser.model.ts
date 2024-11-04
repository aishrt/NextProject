import mongoose from "mongoose";

const SokcetUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    userRole: {
      type: String,
    },
    socketId: {
      type: String,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const SocketUserModel =
  mongoose.models.sockets_user ||
  mongoose.model("sockets_user", SokcetUserSchema);

export default SocketUserModel;
