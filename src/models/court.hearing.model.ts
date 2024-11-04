import mongoose from "mongoose";

const courtHearingSchema = new mongoose.Schema(
  {
    case_id: {
      type: mongoose.Types.ObjectId,
      ref: "Case",
    },
    title: {
      type: String,
    },
    address: {
      type: String,
    },
    description: { type: String },
    objective: { type: String },
    location: {
      type: String,
    },

    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "lawyer",
    },

    date: { type: Date },
    time: { type: String },
    reminderDate: { type: Date },
    reminderTitle: {
      type: String,
    },
    reminderDescription: {
      type: String,
    },

    reminderTime: { type: String },
    reminder: {
      type: Date,
    },
    document: {
      type: String,
    },
    isWon: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["expert", "client", "all"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "reopened"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const courtHearingModel =
  mongoose.models.courtHearing ||
  mongoose.model("courtHearing", courtHearingSchema);
export default courtHearingModel;
