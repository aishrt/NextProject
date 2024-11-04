import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const lawyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    email: { type: String, required: true, unique: true }, // Adding unique constraint for emails
    password: { type: String, required: true },
    gender: { type: String, default: "" },
    legalExpertise: [
      { type: mongoose.Schema.Types.ObjectId, ref: "LawyerTypes", default: [] },
    ], // Removed `required: true` to align with default
    phoneNumber: { type: String, required: true, default: "" },
    image: { type: String, default: "" },
    language: { type: String, default: "" },
    isAdmin: { type: Boolean, required: true, default: false },
    experiences: [{ description: { type: String }, url: { type: String } }],
    educations: [{ description: { type: String }, url: { type: String } }],
    achievements: [{ description: { type: String }, url: { type: String } }],
    aboutMe: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    docStatus: {
      type: String,
      enum: ["pending", "rejected", "accepted", "submitted"],
      default: "pending",
    },
    rejectReason: { type: String },
    location: {
      type: String,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    locationName: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    expireOtp: { type: Date },
    otp: { type: Number },
    role: {
      type: String,
      enum: ["client", "lawyer", "admin", "expert"],
      default: "lawyer",
    },
  },
  {
    timestamps: true,
  }
);

lawyerSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

lawyerSchema.methods.isPasswordMatch = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

lawyerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const Lawyer = mongoose.models.Lawyer || mongoose.model("Lawyer", lawyerSchema);

export default Lawyer;
