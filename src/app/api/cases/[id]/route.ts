// app/api/case/[id]/route.ts

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import db from "@/utils/connectDB";
import Case from "@/models/case.model";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await db.connectDB();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid case ID" },
      { status: 400 }
    );
  }

  try {
    const caseDetails = await Case.findById(id).exec();
    
    if (!caseDetails) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: {data: caseDetails} },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching the case details" },
      { status: 500 }
    );
  }
}
