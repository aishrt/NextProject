import mongoose from "mongoose";

const litigationCompleteSchema = new mongoose.Schema(
  {
    judgementDocument: {
      type: String,
    },
    case_id: {
      type: mongoose.Types.ObjectId,
      ref: "Case",
    },
    carpaDocument: {
      type: String,
    },
    awardedAmount: {
      type: Number,
    },
    percentageCharged: {
      type: Number,
    },
    step: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["accept", "appeal"],
    },
    paymentMethod: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const litigationCompleteModel =
  mongoose.models.litigationComplete ||
  mongoose.model("litigationComplete", litigationCompleteSchema);

export default litigationCompleteModel;
