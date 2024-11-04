import FinancialTemplateModel from "@/models/financial.template.model";
import GeneralModel from "@/models/general.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  db.connectDB();
  try {
    let { CommissionDescription, settlementDescription, lawyerDescription } =
      await req.json();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (user?.role == "client") {
      return NextResponse.json(
        {
          message: "You are not allowed to made these changes.",
          success: false,
        },
        { status: 500 }
      );
    }

    let GetSettings = await FinancialTemplateModel.updateOne(
      {},
      {
        CommissionDescription,
        settlementDescription,
        lawyerDescription,
        addedBy: user?._id,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      {
        data: {
          data: GetSettings,
          message: "Template updated succesfully",
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
