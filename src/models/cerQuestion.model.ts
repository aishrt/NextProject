import mongoose, { trusted } from "mongoose";

const CerQuestionsSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },
        limit: {
            type: Number,
            required: true,
        },

    },

    {
        timestamps: true,
    }
);

const CerQuestions =mongoose.models.cerQuestions ||  mongoose.model("cerQuestions", CerQuestionsSchema);

export default CerQuestions;
