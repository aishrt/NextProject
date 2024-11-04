import mongoose from "mongoose";

const lawyerTypesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LawyerTypes =
  mongoose.models.LawyerTypes ||
  mongoose.model("LawyerTypes", lawyerTypesSchema);

export default LawyerTypes;
