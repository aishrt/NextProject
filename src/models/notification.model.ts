import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    referenceId: { type: String },
    caseId: { type: mongoose.Schema.ObjectId, ref: "Case" },
    role: { type: String, enum: ["client", "expert", "lawyer"] },
    addedBy: { type: mongoose.Schema.ObjectId, ref: "users" },
    listenTo: { type: mongoose.Schema.ObjectId, ref: "users" },
    type: { type: String },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const NotificationModel =
  mongoose.models?.notifications ||
  mongoose.model("notifications", NotificationSchema);

export default NotificationModel;
