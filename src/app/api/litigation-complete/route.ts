import Case from "@/models/case.model";
import litigationCompleteModel from "@/models/litigationCaseComplete.model";
import { authOptions } from "@/server/auth";
import {
  sendLitigationCompleteAlertEmail,
  sendQuitenseAlertEmail,
} from "@/service/email";
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "../notifications/add";
import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    let body = await req.json();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    let findExistingData = await litigationCompleteModel.findOne({
      case_id: body?.case_id,
    });
    let findCase = await Case.findOne({
      _id: body?.case_id,
    })
      .populate("user")
      .populate({ path: "lawyer", model: Lawyer });
    let expertDetail = await Expert.findOne({});
    let notifyPayload = {
      title: "",
      listenTo: "",
      addedBy: user?._id,
      role: "lawyer",
      caseId: body?.case_id,
      description: "",
    };
    if (findExistingData) {
      let payload = { ...body };

      if (body?.status) {
        payload = { ...body, step: 2 };
        notifyPayload["title"] =
          "Case Manager has updated request status for Judgement Document.";
        notifyPayload["listenTo"] = findCase?.user;
        notifyPayload["role"] = "client";
        notifyPayload["description"] =
          "Lawyer has uploaded Judgement Document.";
      }
      if (body?.paymentMethod) {
        payload = { ...body, step: 3 };

        notifyPayload["title"] = "Client has updated Payment method.";
        notifyPayload["listenTo"] = findCase?.lawyer;
        notifyPayload["role"] = "lawyer";
        notifyPayload["description"] =
          "Lawyer has uploaded Judgement Document.";
      }
      if (body?.carpaDocument) {
        payload = { ...body, step: 5 };
        notifyPayload["title"] = "Case Manager has uploaded Carpa Instruction.";
        notifyPayload["listenTo"] = "all";
        notifyPayload["role"] = "all";
        notifyPayload["description"] =
          "Lawyer has uploaded Judgement Document.";
      }
      let updateDoc = await litigationCompleteModel.updateOne(
        { _id: findExistingData?._id },
        payload
      );
      let arr = [
        {
          id: findCase?.lawyer?._id,
          email: findCase?.lawyer?.email,
          role: "lawyer",
        },
        { id: findCase?.user, email: findCase?.user?.email, role: "lawyer" },
      ];
      if (body?.carpaDocument) {
        arr?.map(async (itm: any) => {
          await sendLitigationCompleteAlertEmail({
            email: itm?.email,
            case_id: body?.case_id,
          });
        });
      }

      if (notifyPayload["role"] == "all") {
        arr?.map((itm: any) => {
          PushNotifyUser({
            ...notifyPayload,
            role: itm?.role,
            listenTo: itm?.id,
            type: "carpaDoc",
          })
            .then((res: any) => {})
            .catch((err: any) => {});
        });
      } else {
        PushNotifyUser({
          ...notifyPayload,
          type: "carpaDoc",
        })
          .then((res: any) => {})
          .catch((err: any) => {});
      }
      return NextResponse.json(
        {
          data: {
            success: true,
            message: "Details updated successfuly",
          },
        },
        { status: 200 }
      );
    }
    let payload = { ...body };
    if (body?.judgementDocument) {
      payload = { ...body, step: 1 };
      notifyPayload["title"] = "Lawyer has uploaded Judgement Document.";
      notifyPayload["listenTo"] = expertDetail?._id;
      notifyPayload["role"] = "expert";
      notifyPayload["description"] = "Lawyer has uploaded Judgement Document.";
    }

    PushNotifyUser({
      ...notifyPayload,
      type: "carpaDoc",
    })
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {});

    let createDoc = await litigationCompleteModel.create(payload);
    return NextResponse.json(
      {
        data: {
          success: true,
          message: "Report Added successfuly",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 200 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const case_id = req.nextUrl.searchParams.get("case_id");

    const getDoc = await litigationCompleteModel.findOne({ case_id });
    if (!getDoc) {
      return NextResponse.json(
        {
          data: {
            message: "No report found",
            success: true,
            data: {},
          },
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        data: {
          message: "Report fetched sucessfully",
          data: getDoc,
          success: true,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
