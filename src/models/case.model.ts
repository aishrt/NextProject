import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    referenceId: { type: Number },
    claimFor: { type: String },
    isIndividual: { type: String },
    isEvalReport: {
      type: Boolean,
      default: false,
    },
    isFinancialReport: {
      type: Boolean,
      default: false,
    },
    prepareGraph: {
      type: Boolean,
      default: false,
    },
    lawyerFinancialReport: {
      type: Boolean,
      default: false,
    },
    requestStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "requested", "accepted", "rejected"],
    },
    isWon: {
      type: Boolean,
      default: false,
    },
    isAuthorized: { type: String },
    authoriseType: { type: String },
    legalRepresentativeEmail: { type: String },
    personEmail: { type: String },
    personPhone: { type: String },
    legalSupport: { type: String },
    legalSupportName: { type: String },
    legalSupportType: { type: String },
    otherLegalSupportType: { type: String },
    coverage: { type: String },
    insuranceProvider: { type: String },
    policyNumber: { type: String },
    legalSupportContact: { type: String },
    legalSupportEmail: { type: String },
    legalInsurance: { type: String },
    role: { type: String },
    isMinor: { type: String },
    minorData: { type: Object },
    individualData: { type: Object },
    groupInfo: { type: Object },
    companyData: { type: Object },
    position: { type: String },
    otherFinanced: { type: Object },
    personalInfo: { type: [Object] },
    caseDetail: { type: Object },
    deadLine: { type: Object },
    opposingIndividual: { type: Object },
    opposingCompany: { type: Object },
    opposing: { type: String },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    expert: {
      type: mongoose.Schema.ObjectId,
      ref: "Expert",
      required: true,
    },
    progress: { type: Number, default: 10 },
    nextProgress: { type: Number, default: 10 },
    isAccepted: { type: Boolean, default: false },
    isLaywerAssigned: { type: Boolean, default: false },
    lawyer_details: { type: Object },
    lawyer: { type: mongoose.Schema.ObjectId, ref: "lawyers" },
    proceduralStatus: { type: Object },
    category: { type: String },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "resolved", "notResolved", "reject"],
    },
    evalReportStatus: {
      type: String,
      default: "pending",
    },
    caseType: { type: String },
  },

  {
    timestamps: true,
  }
);

const Case = mongoose.models?.Case || mongoose.model("Case", caseSchema);

export default Case;
