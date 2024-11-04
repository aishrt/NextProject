import mongoose from "mongoose";
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["client", "lawyer", "admin", "expert"],
      default: "client",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isPhoneNumber = async function (phoneNumber, excludeUserId) {
  const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.index({ locationName: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
