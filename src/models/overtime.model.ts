import mongoose from "mongoose";

const overtimeSchema = new mongoose.Schema(
  {
    progress: { type: Number, default: 10 },

    role: { type: String },
    department: { type: Number },
    totalEmployee: { type: String },

    age: { type: Number },
    salary: { type: Number },
    years: { type: Number },
    employmentStatus: { type: String },
    otherStatus: { type: String },
    workDepartment: { type: String },
    otherDepartment: { type: String },

    claimReason: { type: String },
    otherUnpaid: { type: String },
    otherReason: { type: String },
    agreement: { type: String },
    procedureType: { type: String },
    otherProcedureType: { type: String },
    overtimePay: { type: Number },
    amountType: { type: String },

    healthStatus: { type: String },
    illness: { type: String },
    disabledWorker: { type: String },
    otherHealthStatus: { type: String },
    workAccident: { type: String },
    describe: { type: String },

    outcome: { type: String },
    otherOutcome: { type: String },
    checked:{type:Boolean},

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

const Overtime =
  mongoose.models.Overtime || mongoose.model("Overtime", overtimeSchema);

export default Overtime;
