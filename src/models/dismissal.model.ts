import mongoose from "mongoose";

const dismissalSchema = new mongoose.Schema(
  {
    situation: { type: String },

    dateOfBirth: { type: String },
    age: { type: Number },
    salary: { type: Number },
    employment: { type: String },
    service: { type: String },
    serviceYears: { type: Number },
    startPosition: { type: String },

    department: { type: String },
    industry: { type: String },
    employees: { type: String },

    notificationDate: { type: String },
    dismissalReason: { type: String },
    warning: { type: String },
    meetings: { type: String },

    constructiveDate: { type: String },
    constructiveReason: { type: Array },
    otherConstructive: { type: String },

    circumstances: { type: String },
    evidence: { type: String },
    documents: { type: Array },

    witness: { type: String },
    misconduct: { type: String },
    misconducts: { type: Array },
    otherConduct: { type: String },

    progress: { type: Number, default: 10 },
    nextProgress: { type: Number, default: 10 },
    checked: { type: Boolean },

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

const Dismissal =
  mongoose.models.Dismissal || mongoose.model("Dismissal", dismissalSchema);

export default Dismissal;
