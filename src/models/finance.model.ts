import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    userType: {
      type: String,
      required: true,
      enum: ["Client", "Expert"],
    },
  },
  {
    timestamps: true,
  }
);

const Finance = mongoose.models.Finance || mongoose.model("Finance", financeSchema);

export default Finance;
