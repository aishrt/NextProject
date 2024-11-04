import mongoose from "mongoose";

const privacyPolicySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    userType: {
      type: String,
      required: true,
      enum: ["Client", "Expert"],
    },
  },
  {
    timestamps: true,
  }
);

const PrivacyPolicy =
  mongoose.models.PrivacyPolicy ||
  mongoose.model("PrivacyPolicy", privacyPolicySchema);

export default PrivacyPolicy;
