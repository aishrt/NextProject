import mongoose, { trusted } from "mongoose";

const PreTasksSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        role: {
            type: String,
            enum: ["client", "expert", "lawyer"],
            required: true
        },
        caseType:{
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        validFor: {
            type: Number,
            required: true
        },
        description: { type: String },
        isDocument: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

const PreTasksModel = mongoose.models.preTasks || mongoose.model("preTasks", PreTasksSchema);
export default PreTasksModel;