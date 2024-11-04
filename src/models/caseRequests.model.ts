import mongoose from "mongoose";
import { string } from "zod";

const requestSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.ObjectId,
      ref: "Case",
    },

    lawyer: {
      type: mongoose.Schema.ObjectId,
      ref: "Lawyer",
      required: true,
    },

    counterAmount: {
      type: Number,
    },
    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "accepted",
        "rejected",
        "Not applicable",
        "counterOffer",
      ],
    },
  },

  {
    timestamps: true,
  }
);

const Request =
  mongoose.models?.Request || mongoose.model("Request", requestSchema);

export default Request;
