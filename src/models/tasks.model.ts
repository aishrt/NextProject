import mongoose from "mongoose";

const TasksSchema = new mongoose.Schema(
  {
    case_id: {
      type: mongoose.Types.ObjectId,
      ref: "Case",
    },
    title: {
      type: String,
    },
    description: { type: String },
    category: { type: String },

    assignedBy: {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
      },
      role: {
        type: String,
        enum: ["client", "expert", "lawyer", "admin"],
      },
    },
    assignedTo: {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
      },
      role: {
        type: String,
        enum: ["client", "expert", "lawyer"],
      },
    },

    submissionAt: { type: Date },
    validTill: { type: Date },
    isDocument: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "completed", "reopened"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.models.tasks || mongoose.model("tasks", TasksSchema);
export default TaskModel;
