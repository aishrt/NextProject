import mongoose from "mongoose";

const injurySchema = new mongoose.Schema(
  {
    age: { type: String },
    gender: { type: String },
    current_age: { type: Number },
    occupation: { type: String },
    faultPercent: { type: String },
    others: { type: String },
    occupationAfter: { type: String },
    stabilized: { type: String },
    relationship: { type: String },
    otherRelationship: { type: String },
    economicLevel: { type: String },
    live: { type: String },
    dependentChildren: { type: Number },
    protection: { type: String },
    otherProtection: { type: String },
    protectionRelation: { type: String },
    otherProtectionRelation: { type: String },

    accident_place: { type: String },
    abroad: { type: String },
    situation: { type: String },
    accident_type: { type: String },
    nature: { type: String },
    other_nature: { type: String },
    statusAcc: { type: String },
    dependent: { type: String },
    legal: { type: String },
    isAlcoholInfluence: { type: String },
    faultPercentage: { type: String },
    otherFault: { type: Number },
    currentCondition: { type: String },
    otherCondition: { type: String },
    deceased: { type: String },
    otherDeceased: { type: String },

    injuryType: { type: String },
    allInjury: { type: Array },
    otherInjury: { type: String },
    isMedicalExamined: { type: String },

    deficitRate: { type: String },
    psychological: { type: String },
    dfp: { type: Number },
    daysPercentage: { type: String },
    personalized: { type: String },
    daysNumber: { type: String },
    dftPercentage: { type: String },
    dftdays: { type: String },
    points: { type: String },
    temporaryPoints: { type: String },
    permanentPoints: { type: String },

    injuryEffectCarrier: { type: String },
    losses: { type: Number },
    prof_dfp: { type: Number },
    totalAmt: { type: Number },
    participation: { type: String },
    evidence: { type: String },
    compensation: { type: Number },
    severity_points: { type: Number },
    wanted_compensation: { type: Number },
    activity: { type: Number },
    isInjuryImpact: { type: String },
    injuryCause: { type: Array },
    sexualHarm: { type: String },
    fairAmt: { type: Number },
    establishmentLoss: { type: Number },
    compAmount: { type: Number },
    protectionMeasure: { type: String },
    
    hours: { type: Number },
    salary: { type: Number },
    netSalary: { type: Number },
    capitalizationTable: { type: String },
    tableUsed: { type: String },
    years: { type: String },
    otherCapitalization: { type: String },
    compensationDuration: { type: String },
    victims: { type: String },
    claimProposal: { type: String },
    workAbility: { type: String },
    financialLosses: { type: Number },

    indirectVictim: { type: Number },
    isVictimLive: { type: String },
    insurance: { type: String },
    caregiving: [
      {
        name: { type: String },
        duration: { type: Number },
      },
    ],
    victimDetails: [
      {
        name: { type: String },
        surname: { type: String },
        relation: { type: String },
        otherRelation: { type: String },
        damage: { type: String },
      },
    ],


    damagesCategory:{type:Array},


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

const Injury = mongoose.models.Injury || mongoose.model("Injury", injurySchema);

export default Injury;
