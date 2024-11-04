import mongoose from "mongoose";

const evictionSchema = new mongoose.Schema(
  {
    leaseInitialDate: { type: String },
    leaseInitialYear: { type: Number },
    annualRent: { type: Number },
    premises: { type: String },
    // --------------------
    activityType: { type: String },
    activitySector: { type: String },

    leaseRenewal: { type: Number },
    terminationDate: { type: String },
    effectiveTerminationDate: { type: String },
    terminationReason: { type: String },
    explainReason: { type: String },
    nonRenewalEffect: { type: String },
    describeNonRenewal: { type: String },
    sublet: { type: String },
    subletArea: { type: Number },

    premisesNature: { type: String },
    premisesArea: { type: Number },
    groundSurface: { type: Number },
    weightedArea: { type: Number },
    premisesLocated: { type: String },
    otherLotsNature: { type: String },
    premisesAccess: { type: String },

    buildingType: { type: String },
    buildingAge: { type: String },
    buildingFloor: { type: Number },

    citySize: { type: String },
    location: { type: String },
    citySituation: { type: String },
    transportConnectivity: { type: String },
    pointOfInterest: { type: String },
    reputedBrand: { type: String },
    competingBrand: { type: String },
    miscellaneousAdvantages: { type: String },

    rentalValue: { type: Number },
    leaseRental: { type: Number },

    collectiveProcedures: { type: String },

    reputation: { type: String },
    employeesNumber: { type: Number },
    operationPeriod: { type: String },
    weeklyOpening: { type: String },
    profitability: { type: String },
    clientTraffic: { type: String },
    inventoryNature: { type: String },
    inventoryValue: { type: Number },
    businessStrength: { type: String },
    businessWeakness: { type: String },
    describeStrength: { type: String },
    describeWeakness: { type: String },
    businessRetain: { type: String },

    businessMethod: { type: String },
    activities: { type: Number },
    annualRevenue: { type: Number },
    revenueTaxes: { type: String },

    lessorPercentage: { type: Number },
    selfPercentage: { type: Number },
    expertPercentage: { type: Number },
    dailyReceipts: { type: Number },

    businessMargin: { type: Number },
    lessorMargin: { type: Number },
    proposeMargin: { type: Number },
    expertMargin: { type: Number },


    annualEBE: { type: Number },
    lessorEBE: { type: Number },
    proposeEBE: { type: Number },
    expertEBE: { type: Number },


    // --------------------

    // useClause: { type: String },
    // surfaceType: { type: String },
    // // --------------------
    // leaseEndDate: { type: String },
    // leaseEndReason: { type: String },
    // terminationDate: { type: String },
    // subleasing: { type: String },
    // leaseManagement: { type: String },
    // premisesType: { type: String },
    // other: { type: String },
    // surfaceArea: { type: String },
    // primaryUse: { type: String },
    // customerAccess: { type: String },
    // facadeFrontage: { type: String },
    // premisesState: { type: String },
    // competingBrand: { type: String },
    // financialSituation: { type: String },
    // notoriety: { type: String },
    // leasePeriod: { type: String },
    // openingHours: { type: String },
    // leaseRenewal: { type: String },
    // leaseRenewalNumber: { type: String },
    // premisesActivity: { type: String },
    // describeActivity: { type: String },
    // spacePercent: { type: String },
    // describeAdvantages: { type: String },
    // receptionNature: { type: String },

    // retention: { type: String },
    // valuationMethod: { type: String },
    // leaseActivities: { type: String },
    // existenceProcedure: { type: String },

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

const Eviction =
  mongoose.models.Eviction || mongoose.model("Eviction", evictionSchema);

export default Eviction;
