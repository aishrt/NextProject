import mongoose from "mongoose";

const termsSchema = new mongoose.Schema(
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

const Terms = mongoose.models.Terms || mongoose.model("Terms", termsSchema);

export default Terms;
