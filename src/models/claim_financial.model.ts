import mongoose from "mongoose";

const ClaimFinancialSchema = new mongoose.Schema(
  {
    case_id: { type: mongoose.Schema.ObjectId, ref: "Case" },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    lawyer: {
      type: mongoose.Schema.ObjectId,
      ref: "Lawyer",
    },
    platform_commission: { type: Number },
    minimum_amount: { type: Number },

    lawyerCommission: { type: Number },
    clientAmount: { type: Number },
    lawyerAmount: { type: Number },
    platformAmount: { type: Number },
    remainingPlatformAmount: { type: Number },

    managerSignature: { type: String },
    checked: { type: Boolean },
    clientSignature: { type: String },
    lawyerManagerSignature: { type: String },
    lawyerSignature: { type: String },
    verifyReport: { type: Boolean },

    platform_commission_description: { type: String },
    minimum_settle_amount_description: { type: String },
    lawyer_description: { type: String },

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

const ClaimFinancialModel =
  mongoose.models.financial_report ||
  mongoose.model("financial_report", ClaimFinancialSchema);

export default ClaimFinancialModel;
