import mongoose from "mongoose";

const CaseDocumentsSchema = new mongoose.Schema(
  {
    case_id: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Case",
    },
    task_id: {
      type: mongoose.Schema.ObjectId,
      ref: "tasks",
    },
    uploadedBy: {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true,
      },
      role: {
        type: String,
        enum: ["client", "lawyer", "expert"],
        required: true,
      },
    },
    document: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    status: {
      type: String,
      enum: ["requested", "rejected", "accepted", "suggestion", "edit_request"],
      default: "pending",
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["personal", "identity", "damage", "communication"],
    },
    description: {
      type: String,
    },
    reason: {
      type: String,
    },
    version: {
      type: Number,
      default: 0,
    },

    previousVersions: [
      {
        version: {
          type: Number,
          required: true,
        },
        document: {
          type: String,
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now, // Capture the time of versioning
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

CaseDocumentsSchema.pre("save", async function (next) {
  const doc = this as any;

  if (doc.isModified("document")) {
    doc.previousVersions.push({
      version: doc.version,
      document: doc.document,
      updatedAt: doc.updatedAt,
    });

    doc.version += 1;
  }

  next();
});

const CaseDocument =
  mongoose.models.case_documents ||
  mongoose.model("case_documents", CaseDocumentsSchema);

export default CaseDocument;
