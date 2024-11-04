import mongoose from "mongoose";

const attorneySchema = new mongoose.Schema(
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

const Attorney = mongoose.models.Attorney || mongoose.model("Attorney", attorneySchema);

export default Attorney;
