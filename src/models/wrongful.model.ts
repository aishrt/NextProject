import mongoose from "mongoose";

const wrongfulSchema = new mongoose.Schema(
  {
    progress: { type: Number, default: 10 },
    nextProgress: { type: Number, default: 10 },

    role: { type: String },

    peopleWorked: { type: String },

    age: { type: Number },
    salary: { type: Number },
    title: { type: String },
    department: { type: String },
    otherDepartment: { type: String },
    years: { type: Number },

    healthStatus: { type: String },
    unfit: { type: String },

    description: { type: String },
    reason: { type: String },
    legally: { type: String },
    witnesses: { type: String },
    // contact: { type: String },

    harassmentExperience: { type: Array },
    eventsExperience: { type: Array },
    evidenceSupport: { type: Array },
    eventDescribe: { type: String },

    terminationAffect: { type: Array },
    evidenceProvide:{type:Array},
    otherEvidence: { type: String },

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

const Wrongful =
  mongoose.models.Wrongful || mongoose.model("Wrongful", wrongfulSchema);

export default Wrongful;
