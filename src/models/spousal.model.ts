import mongoose from "mongoose";

const spousalSchema = new mongoose.Schema(
  {
    describe: { type: String },
    years: { type: Number },
    totalValue: { type: Number },
    ownAnything: { type: String },
    ownWorth: { type: Number },
    curentlyPaying: { type: String },
    currentWorth: { type: Number },

    age: { type: Number },
    health: { type: String },
    income: { type: Number },
    retired: { type: String },
    retirePayment: { type: Number },
    assets: { type: Number },
    valuable: { type: String },
    worth: { type: Number },
    share: { type: Number },

    spouseAge: { type: Number },
    spouseHealth: { type: String },
    spouseIncome: { type: Number },
    spouseRetired: { type: String },
    spouseRetirePayment: { type: Number },
    spouseAssets: { type: Number },
    spouseValuable: { type: String },
    spouseWorth: { type: Number },
    spouseShare: { type: Number },

    childSupport:{type:String},
    checked: { type: Boolean },

    progress: { type: Number, default: 10 },
    nextProgress: { type: Number, default: 10 },

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

const Spousal =
  mongoose.models.Spousal || mongoose.model("Spousal", spousalSchema);

export default Spousal;
