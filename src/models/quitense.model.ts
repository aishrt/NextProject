import mongoose from "mongoose";

const QuitenseSchema = new mongoose.Schema(
  {
    case_id: {
      type: mongoose.Types.ObjectId,
      ref: "Case",
    },
    method: {
      type: String,
    },
    approvedAmount: {
      type: Number,
    },
    lawyerAmount: {
      type: Number,
    },
    expertAmount: {
      type: Number,
    },
    clientSignature: {
      type: String,
    },
    document: {
      type: String,
    },
    step: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const QuitenseModel =
  mongoose.models.quitense || mongoose.model("quitense", QuitenseSchema);
export default QuitenseModel;
