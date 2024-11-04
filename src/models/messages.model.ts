import mongoose from "mongoose";

const MessagesSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
    },
    case_id: {
      type: mongoose.Schema.ObjectId,
      ref: "cases",
    },
    roomId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "rooms",
    },
    userDetails: {
      type: Object,
    },
    seenBy: {
      type: Array,
      default: [
        {
          _id: {
            type: mongoose.Schema.ObjectId,
          },
        },
      ],
    },

    message: {
      text: {
        type: String,
      },
      media: {
        type: Array,
      },
      link: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const MessagesModel =
  mongoose.models.Messages || mongoose.model("Messages", MessagesSchema);

export default MessagesModel;
