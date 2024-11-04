import mongoose from "mongoose";

const unfairSchema = new mongoose.Schema(
  {
    unfairPractices: { type: String },
    practiceOccur: { type: String },
    websitePractice: { type: Array },
    practiceKind: { type: Array },
    customerDiversion: { type: Array },

    defamatoryStatement: { type: String },
    describeDefameStatement: { type: String },
    defameStatementMade: { type: Array },
    otherDefameStatement: { type: String },
    legalAction: { type: String },
    statements: { type: String },
    isCompanyName: { type: String },

    employeePoached: { type: String },
    numberOfEmployees: { type: String },
    employeePositions: { type: Array },
    workAreas: { type: Array },
    previousJob: { type: Array },
    otherPreviousJob: { type: String },
    regularTurnover: { type: String },
    activelyLooking: { type: String },
    serveNoticePeriod: { type: String },
    companyPostJob: { type: String },
    adsPostedMonth: { type: String },
    departuresMonths: { type: String },
    vacatedPositions: { type: String },
    competingCompany: { type: String },
    clientsLeave: { type: String },
    nonCompeteClause: { type: String },
    competingCompanyAware: { type: String },

    experiencingConfusion: { type: String },
    kindOfConfusion: { type: Array },
    categoryOfTangible: { type: Array },
    otherTangible: { type: String },
    similarities: { type: Array },
    otherSimilarities: { type: String },
    experiencingParasitism: { type: String },
    demonstrateInvestments: { type: String },
    investmentAmount: { type: String },
    competitorViolated: { type: String },

    contractWithCompetingCompany: { type: String },
    typeOfContract: { type: String },
    otherContract: { type: String },
    contractIncludeClause: { type: String },
    competitiveSituation: { type: String },

    claimBasedOn: { type: String },
    collectiveProcedure: { type: String },
    sectorOfActivity: { type: String },
    otherActivity: { type: String },
    employeesCompanyHave: { type: Number },
    evidenceSupport: { type: Array },
    financialLosses: { type: Array },
    revenueAmount: { type: Number },
    grossMarginAmount: { type: Number },

    numberOfDefendants: { type: Number },
    defendantActivity: { type: String },
    otherDefendantActivity: { type: String },
    empDefendantCompanyHave: { type: Number },
    isAccusedCompanyLinked: { type: String },
    stillWorking: { type: String },

    progress: { type: Number, default: 10 },

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

const Unfair = mongoose.models.Unfair || mongoose.model("Unfair", unfairSchema);

export default Unfair;
