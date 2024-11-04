import mongoose from "mongoose";

const mandateSchema = new mongoose.Schema(
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

const Mandate = mongoose.models.Mandate || mongoose.model("Mandate", mandateSchema);

export default Mandate;
