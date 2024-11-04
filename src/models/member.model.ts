import mongoose, { mongo } from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Types.ObjectId,
      ref: "Case",
    },
    name: {
      type: String,
    },
    email: { type: String },
    phone: { type: String },
    gender: { type: String },
    age: { type: Number },
    roomId:{
      type:mongoose.Schema.ObjectId,
      ref:"rooms"
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MemberModel =
  mongoose.models.Roommembers || mongoose.model("Roommembers", MemberSchema);
export default MemberModel;
