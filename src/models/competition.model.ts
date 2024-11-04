import mongoose from "mongoose";
import { isString } from "util";

const competitionSchema = new mongoose.Schema(
  {
    subject: { type: String },
    industrySector: { type: String },
    otherIndustrySector: { type: String },
    numberOfEmployee: { type: Number },
    totalRevenue: { type: Number },

    employmentMonth: { type: Number },
    lastSalary: { type: Number },
    employmentEndDate: { type: String },
    jobTitle: { type: String },
    otherJobTitle: { type: String },
    employmentType: { type: String },

    nonCompetePeriod: { type: Number },
    compensation: { type: String },
    salaryPercentage: { type: Number },
    compensationSource: { type: String },
    reasonsForClause: { type: Array },
    otherReasonsForClause: { type: String },
    
    prohibitedActivities: { type: Array },
    otherProhibitedActivities: { type: String },
    service: { type: String },
    industrySectorCompany: { type: String },
    city: { type: String },
    departmental: { type: String },
    otherGeographical: { type: String },
    geoGraphical:{type:Array},
    employeeLocation: { type: Number },
    companyLocation: { type: Number },

    penaltyClause: { type: String },
    penaltyAmount: { type: Number },
    judicialRequest: { type: String },
    lastMonthlySalary: { type: Number },
    nonCompeteDuration: { type: Number },
    potentialLoss: { type: Number },

    explicitly: { type: String },

    breach: { type: String },
    clauseBelieved: { type: String },
    otherClauseBelieved: { type: String },
    newCompany: { type: String },
    position: { type: String },
    companyCompete: { type: String },
    newBusiness: { type: String },
    typeOfBusiness: { type: String },
    businessCompete: { type: String },
    startJob: { type: String },

    violationEvidence: { type: Array },
    otherViolation: { type: String },

    nonCompetitionClause: { type: Array },
    otherClause: { type: String },
    allegedViolation: { type: Array },
    otherAlleged: { type: String },
    agreement: { type: String },
    negotiate: { type: String },
    whenNegotiate: { type: Array },
    otherDetails: { type: String },

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

const Competition =
  mongoose.models.Competition ||
  mongoose.model("Competition", competitionSchema);

export default Competition;
