import mongoose from "mongoose";

const FundSchema = new mongoose.Schema(
  {
    case_id: {
      type: mongoose.Types.ObjectId,
      ref: "Case",
    },
    transactionId: {
      type: String,
    },
    fundAmount: {
      type: Number,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const FundModel = mongoose.models.funds || mongoose.model("funds", FundSchema);
export default FundModel;
