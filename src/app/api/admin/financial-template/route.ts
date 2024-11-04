import FinancialTemplateModel from "@/models/financial.template.model";
import GeneralModel from "@/models/general.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  db.connectDB();
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    let GetSettings = await FinancialTemplateModel.findOne({});

    return NextResponse.json(
      {
        data: {
          data: GetSettings,
          message: "Template fetched successfully",
          success: true,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
