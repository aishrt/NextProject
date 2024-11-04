import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "ClaimReports",
    },
    paymentId: {
      type: String,
    },
    status: {
      type: String,
      //   enum: ["cancelled", "completed"],
      //   default: "completed",
    },
    amount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
