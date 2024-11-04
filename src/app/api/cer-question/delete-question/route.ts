import CerQuestions from "@/models/cerQuestion.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        db.connectDB();
        const id = req.nextUrl.searchParams.get("id");
        const FindQuest = await CerQuestions.findOne({ _id: id })
        if (!FindQuest) {
            return NextResponse.json({
                message: "Question not found"
            }, {
                status: 400
            })
        }

        let DeleteQuestion = await CerQuestions.deleteOne({_id:id})
        return NextResponse.json({
            data:{
                message:"Question Deleted",
                status:200
            }
        })

    } catch (error) {

    }
}