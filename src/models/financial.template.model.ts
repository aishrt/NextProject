import mongoose from "mongoose";

const FinancailTemplateSchema = new mongoose.Schema(
  {
    settlementDescription: {
      type: String,
      requried: true,
    },
    CommissionDescription: { type: String, required: true },
    lawyerDescription: {
      type: String,
      requried: true,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const FinancialTemplateModel =
  mongoose.models.financialTemplate ||
  mongoose.model("financialTemplate", FinancailTemplateSchema);
export default FinancialTemplateModel;
