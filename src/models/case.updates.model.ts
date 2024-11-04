import mongoose, { trusted } from "mongoose";

const CaseUpdatesSchema = new mongoose.Schema(
  {
    case_id: {
      type: mongoose.Types.ObjectId,
      ref: "Case",
    },
    title: {
      type: String,
    },
    discussionPoint: {
      type: [Object],
    },
    attendees: {
      type: [Object],
    },
    document: {
      type: [String],
    },
    exchangedDocument: {
      type: [String],
    },
    discussionDate: {
      type: Date,
    },
    price: {
      type: Number,
    },
    isWon: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "lawyer",
    },
    description: { type: String },

    status: {
      type: String,
      enum: ["pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const CaseUpdatesModel =
  mongoose.models.CaseUpdates ||
  mongoose.model("CaseUpdates", CaseUpdatesSchema);
export default CaseUpdatesModel;
