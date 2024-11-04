import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    case_id: {
      type: mongoose.Schema.ObjectId,
      ref: "cases",
    },
    lastMessage: {
      text: {
        type: String,
      },
      link: {
        type: String,
      },
      media: {
        type: Array,
      },
    },
    senderId: {
      type: mongoose.Schema.ObjectId,
    },
    senderRole: {
      type: String,
    },
    room: {
      type: String,
    },
    personalRole: {
      type: String,
      enum: ["client", "lawyer"],
    },
    isPersonal: {
      type: Boolean,
      default: false,
    },
    personalUser: {
      type: mongoose.Types.ObjectId,
    },

    receiverId: {
      type: mongoose.Schema.ObjectId,
    },
    userName: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
    },
    lawyerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Lawyer",
    },

    pinnedBy: {
      type: Array,
      default: [
        {
          _id: {
            type: mongoose.Schema.ObjectId,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);
const RoomModel = mongoose.models.rooms || mongoose.model("rooms", RoomSchema);

export default RoomModel;
