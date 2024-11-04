import mongoose from "mongoose";

const GeneralSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
    },
    file: { type: String },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const GeneralModel =
  mongoose.models.general || mongoose.model("general", GeneralSchema);
export default GeneralModel;
