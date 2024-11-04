import Child from "@/models/childSupport.model";
import Competition from "@/models/competition.model";
import Dismissal from "@/models/dismissal.model";
import Eviction from "@/models/eviction.model";
import Harassment from "@/models/harassment.model";
import Injury from "@/models/injury.model";
import Judicial from "@/models/judicial.model";
import Overtime from "@/models/overtime.model";
import Spousal from "@/models/spousal.model";
import Sudden from "@/models/sudden.model";
import Unfair from "@/models/unfair.model";
import Vexatious from "@/models/vexatious.model";
import Wrongful from "@/models/wrongful.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    let category = req.nextUrl.searchParams.get("category");
    let case_id: any = req.nextUrl.searchParams.get("case_id");
    let objectID = new mongoose.Types.ObjectId(case_id);
    if (!case_id || !category) {
      return NextResponse.json(
        {
          message: "Payload required",
          success: false,
        },
        { status: 400 }
      );
    }
    
    if (category == "Non Competition") {
      let QuestionsData = await Competition.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "Sudden termination") {
      let QuestionsData = await Sudden.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "Overtime Pay Claim") {
      let QuestionsData = await Overtime.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "Eviction Compensation") {
      let QuestionsData = await Eviction.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }

    if (category == "Harassment") {
      let QuestionsData = await Harassment.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "injury") {
      let QuestionsData = await Injury.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }

    if (category == "Unfair Competition") {
      let QuestionsData = await Unfair.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "wrongful") {
      let QuestionsData = await Wrongful.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "Vexatious") {
      let QuestionsData = await Vexatious.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "spousal") {
      let QuestionsData = await Spousal.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "Dismissal Assessment") {
      let QuestionsData = await Dismissal.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "competition") {
      let QuestionsData = await Competition.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "Child support") {
      let QuestionsData = await Child.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
    if (category == "Judicial determination of rent") {
      let QuestionsData = await Judicial.findOne({ caseId: objectID });
      return NextResponse.json(
        { data: QuestionsData, success: true },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
        success: true,
      },
      { status: 400 }
    );
  }
}
