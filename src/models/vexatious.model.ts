import mongoose from "mongoose";

const vexatiousSchema = new mongoose.Schema(
  {
    age: { type: Number },
    salary: { type: Number },
    position: { type: String },
    department: { type: String },
    years: { type: String },

    healthStatus: { type: String },
    unfit: { type: String },

    peopleWorked: { type: Number },
    employerReason: { type: String },
    otherReason: { type: String },

    eventsExperience: { type: Array },
    otherEvent: { type: String },

    dismissalAffected: { type: Array },
    evidence: { type: Array },

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

const Vexatious =
  mongoose.models.Vexatious || mongoose.model("Vexatious", vexatiousSchema);

export default Vexatious;
