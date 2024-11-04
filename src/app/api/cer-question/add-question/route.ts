import CerQuestions from "@/models/cerQuestion.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        db.connectDB();
        const { question, limit } = await req.json();
        const user = await CerQuestions.findOne({ question });
        if (user) {
            return NextResponse.json(
                { message: "Qusetion already exists" },
                { status: 400 }
            );
        }
        await CerQuestions.create({
            question, limit: Number(limit)
        })
        return NextResponse.json({
            data: {
                message: "Question created", status: 200
            }
        }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message ?? "Internal server error" },
            { status: 400 }
        );
    }
}
