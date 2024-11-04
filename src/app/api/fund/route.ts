import Case from "@/models/case.model";
import FundModel from "@/models/fund.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "../notifications/add";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import QuitenseModel from "@/models/quitense.model";
import litigationCompleteModel from "@/models/litigationCaseComplete.model";
import Expert from "@/models/expert.model";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    let body = await req.json();
    let findFund = await FundModel.findOne({ case_id: body?.case_id });
    let expertDetail = await Expert.findOne({});

    let createDoc = await FundModel.create({
      case_id: body?.case_id,
      transactionId: body?.transactionId,
      fundAmount: body?.fundAmount,
      description: body?.description,
    });

    let UserDetail: any = await Case.findOne({ _id: body?.case_id }).populate(
      "user"
    );

    if (UserDetail?.caseType != "litigation" && !findFund) {
      let updateQuitense = await QuitenseModel.updateOne(
        {
          case_id: body?.case_id,
        },
        {
          step: 5,
        }
      );
    }
    if (UserDetail?.caseType == "litigation" && !findFund) {
      let updateQuitense = await litigationCompleteModel.updateOne(
        {
          case_id: body?.case_id,
        },
        {
          step: 4,
        }
      );
    }
    let notifyPayload = {
      title: "Lawyer has added fund",
      listenTo: expertDetail?._id,
      addedBy: user?._id,
      role: "expert",
      caseId: body?.case_id,
      description: "Lawyer has added fund",
    };
    PushNotifyUser({
      ...notifyPayload,
      listenTo: expertDetail?._id,
      role: "expert",
      type: UserDetail?.caseType == "litigation" ? "carpaDoc" : "quittense",
    })
      .then((res: any) => {})
      .catch((err: any) => {});
    return NextResponse.json({
      data: {
        success: true,
        message: "Fund added successfully",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let id = req.nextUrl.searchParams.get("id");
    let case_id = req.nextUrl.searchParams.get("case_id");
    let page: any = req.nextUrl.searchParams.get("page") || 1;
    let count = req.nextUrl.searchParams.get("count") || 10;

    let query: any = {};
    if (id) {
      query._id = id;
      const getDocs = await FundModel.findOne(query);
      return NextResponse.json({
        data: {
          data: getDocs,
          status: 200,
          success: true,
          message: "Funds fetched Successfully",
        },
      });
    }
    if (case_id) {
      query = { case_id: case_id };
    }

    const totalCount = await FundModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / 10);

    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const skip = (pageNumber - 1) * 10;

    const getDocs = await FundModel.find(query)
      .populate("case_id")
      .skip(skip < 0 ? 0 : skip)
      .limit(10)
      .exec();

    return NextResponse.json({
      data: {
        currentPage: pageNumber,
        totalEntries: totalCount,
        data: getDocs,
        success: true,

        status: 200,
        message: "Funds fetched Successfully",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
