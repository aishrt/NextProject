import CerQuestions from "@/models/cerQuestion.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        db.connectDB();
        const { question, limit,_id } = await req.json();
        const quest = await CerQuestions.findOne({ _id });
        if (!quest) {
            return NextResponse.json(
                { message: "Qusetion not exists" },
                { status: 400 }
            );
        }
        await CerQuestions.updateOne({_id:_id},{question:question,limit:limit||quest?.limit
        })
        return NextResponse.json({
            data: {
                message: "Question updated", status: 200
            }
        });
    } catch (error: any) {
        console.log(error)
        return NextResponse.json(
            { message: error?.message ?? "Internal server error" },
            { status: 400 }
        );
    }
}
