import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String },
    refId: { type: String },
    claimFor: { type: String },
    isIndividual: { type: String },
    isMinor: { type: String },
    minorData: { type: Object },
    otherFinanced: { type: Object },
    personalInfo: { type: [Object] },
    caseDetail: { type: Object },
    deadLine: { type: Object },
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

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
