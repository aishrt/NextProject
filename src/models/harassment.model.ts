import mongoose from "mongoose";

const harassmentSchema = new mongoose.Schema(
  {
    age: { type: Number },
    salary: { type: Number },
    jobTitle: { type: String },
    department: { type: String },
    years: { type: Number },
    amount: { type: String },

    health: { type: String },
    unfit: { type: String },

    workDepartment: { type: String },
    employees: { type: Number },
    reason: { type: String },

    committed: { type: String },
    splRelationship: { type: String },

    moralElements: { type: Array },

    evidenceTypes: { type: Array },
    alleged: { type: String },
    otherEvidence: { type: String },
    otherSpecify:{type:String},

    damages:{type:Array},

    situation:{type:String},

    
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

const Harassment =
  mongoose.models.Harassment || mongoose.model("Harassment", harassmentSchema);

export default Harassment;
