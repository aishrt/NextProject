import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    role: { type: String },

    monthlyIncome: { type: Number },
    monthlyExpenses: { type: Number },
    children: { type: Number },

    otherMonthlyIncome: { type: Number },
    otherMonthlyExpenses: { type: Number },
    otherChildren: { type: Number },

    proposedAmount: { type: Number },
    parentProposedAmount: { type: Number },
    payingAmount: { type: Number },

    educational: { type: Number },
    describe: { type: String },

    checked: { type: Boolean },
    spousalSupport: { type: String },

    progress: { type: Number, default: 10 },
    nextProgress: { type: Number, default: 10 },

    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    caseId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Case",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Child = mongoose.models.Child || mongoose.model("Child", childSchema);

export default Child;
