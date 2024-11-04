import mongoose from "mongoose";

const suddenSchema = new mongoose.Schema(
  {
    work: { type: String },
    duration: { type: Number },
    relationTerminated: { type: Array },
    otherTerminated: { type: String },
    contract: { type: Array },
    noticePeriod: { type: String },
    noticeDuration: { type: Number },
    factors: { type: Array },

    // typeOfContract: { type: String },
    // specificDetail: { type: String },

    // noticeMonths: { type: String },
    monthsNumber: { type: Number },
    financial: { type: Array },
    financialDamage: { type: String },
    currentSituation: { type: String },
    otherSituation: { type: String },

    // totalvalue: { type: String },
    // amount: { type: Number },
    // financialInvestments: { type: String },
    // describeFinancial: { type: String },
    // totalRevenue: { type: String },
    // totalRevenueAmount: { type: Number },
    // grossMargin: { type: String },
    // grossMarginAmount: { type: Number },
    // businessRely: { type: String },
    // officialDocuments: { type: String },

    industry: { type: String },
    otherIndustry: { type: String },
    marketCondition: { type: String },
    collective: { type: String },
    proceedings: { type: String },
    courtType: { type: String },
    courtName: { type: String },
    courtLocation: { type: String },
    //newPartner: { type: String },
    // openCollective: { type: String },

    notice: { type: Number },
    somethingWrong: { type: String },
    whatDidWrong: { type: Array },
    otherReason: { type: String },
    issuesInvolve: { type: String },
    contractBroke: { type: String },
    endingIssue: { type: String },
    obligations: { type: String },
    accused: { type: String },
    breachCited: { type: String },

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

const Sudden = mongoose.models.Sudden || mongoose.model("Sudden", suddenSchema);

export default Sudden;
