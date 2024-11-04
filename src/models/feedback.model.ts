import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema(
  {
    case_id: {
      type: mongoose.Types.ObjectId,
      ref: "Case",
    },
    lawyerFeedback: {
      type: String,
    },
    lawyerRating: {
      type: Number,
    },
    platformRating: {
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

const feedBackModel =
  mongoose.models.feedback || mongoose.model("feedback", feedBackSchema);

export default feedBackModel;
