import mongoose from "mongoose";

const ClaimReportsSchema = new mongoose.Schema(
  {
    questions: {
      type: [Object],
    },
    case_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Case",
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    winning_percentage: {
      type: Number,
    },
    court_amount: {
      type: Number,
    },
    percentage_change: {
      type: Number,
    },

    description: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    isPurchased: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "purchased", "accept", "reject"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  }
);

const ClaimReportModel =
  mongoose.models.ClaimReports ||
  mongoose.model("ClaimReports", ClaimReportsSchema);

export default ClaimReportModel;
