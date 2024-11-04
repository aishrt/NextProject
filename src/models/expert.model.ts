import mongoose from "mongoose";
const bcrypt = require("bcryptjs");

const expertSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: false, default: "" },
    dob: { type: String, required: false, default: "" },
    phoneNumber: { type: String, required: true, default: "" },
    image: { type: String, required: false, default: "" },
    isAdmin: { type: Boolean, required: true, default: false },
    isEmailVerified: { type: Boolean, default: false },
    nationality: { type: String, required: false, default: "" },
    emergencyContact: { type: String, required: false, default: "" },
    expertise: { type: String, required: false, default: "" },
    language: { type: String, required: false, default: "" },
    location: {
      type: String,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
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

    expireOtp: {
      type: Date,
    },
    otp: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["client", "lawyer", "admin", "expert"],
      default: "expert",
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
expertSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

expertSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

expertSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const Expert = mongoose.models.Expert || mongoose.model("Expert", expertSchema);

export default Expert;
