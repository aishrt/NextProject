import mongoose from "mongoose";

const judicialSchema = new mongoose.Schema(
  {
    contractDate: { type: String },
    contractDuration: { type: Number },
    initialRent: { type: Number },
    lastRent: { type: Number },
    silentRenewal: { type: String },
    renewalNumber: { type: Number },
    renewalDate: { type: String },
    lastRentNature: { type: String },

    businessActivity: { type: String },
    specificActivity: { type: String },
    exclusiveClause: { type: String },
    favorableClause: { type: Array },

    primaryNature: { type: String },
    otherNature: { type: String },
    typeOfSurface: { type: String },
    otherSurface: { type: String },
    mainArea: { type: Number },
    floorArea: { type: Number },
    weightedArea: { type: Number },
    floorsOccupied: { type: String },
    buildingNature: { type: String },
    otherBuilding: { type: String },
    accessibility: { type: String },
    facade: { type: String },
    currentState: { type: String },
    specificEquipment: { type: String },

    buildingType: { type: String },
    otherType: { type: String },
    buildingAge: { type: String },
    floorNumber: { type: Number },

    townSize: { type: String },
    premisesLocation: { type: String },
    premisesSituation: { type: String },
    pedestrianZone: { type: String },
    transportLinks: { type: String },
    parkingSituation: { type: String },
    spacesNumber: { type: Number },
    interest: { type: String },
    quality: { type: String },
    reputedBrands: { type: String },
    competingBrands: { type: String },
    advantages: { type: String },
    otherAdvantages: { type: String },
    
    rental: { type: Number },
    premises: [
      {
        similarityActivity: { type: String },
        premisesQuality: { type: String },
        valuationSource: { type: String },
        weightedArea: { type: Number },
        price: { type: Number },
      },
    ],
    reasonsForRent: { type: Array },
    favorableFactors: { type: Array },
    unfavorableFactors: { type: Array },
    notableDate: { type: String },

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

const Judicial =
  mongoose.models.Judicial || mongoose.model("Judicial", judicialSchema);

export default Judicial;
