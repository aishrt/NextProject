import Case from "@/models/case.model";
import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import QuitenseModel from "@/models/quitense.model";
import { authOptions } from "@/server/auth";
import { sendQuitenseAlertEmail } from "@/service/email";
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "../notifications/add";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    let body = await req.json();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    let findExistingData = await QuitenseModel.findOne({
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

      if (body?.approvedAmount) {
        payload = { ...body, step: 2 };
        notifyPayload["title"] =
          "Case Manager has updated Quittance Transactionnelle document.";
        notifyPayload["listenTo"] = findCase?.user?._id;
        notifyPayload["role"] = "client";
        notifyPayload["description"] =
          "Case Manager has updated Quittance Transactionnelle document.";
      }
      if (body?.clientSignature) {
        payload = { ...body, step: 3 };
        notifyPayload["title"] =
          "Client has updated Signature on  Quittance Transactionnelle document.";
        notifyPayload["listenTo"] = findCase?.lawyer?._id;
        notifyPayload["role"] = "lawyer";
        notifyPayload["description"] =
          "Client has updated Signature on  Quittance Transactionnelle document.";
      }
      if (body?.document) {
        payload = { ...body, step: 4 };
        notifyPayload["title"] = "Case Manager has updated Carpa Document";
        notifyPayload["listenTo"] = findCase?.user?._id;
        notifyPayload["role"] = "all";
        notifyPayload["description"] =
          "Case Manager has updated Carpa Document";
      }
      let arr = [
        {
          id: findCase?.lawyer?._id,
          email: findCase?.lawyer?.email,
          role: "lawyer",
        },
        { id: findCase?.user, email: findCase?.user?.email, role: "lawyer" },
      ];
      if (body?.document) {
        arr?.map(async (itm: any) => {
          await sendQuitenseAlertEmail({
            email: itm?.email,
            case_id: body?.case_id,
          });
        });
      }
      if (notifyPayload?.role == "all") {
        arr?.map((itm: any) => {
          PushNotifyUser({
            ...notifyPayload,
            listenTo: itm?.id,

            type: "quittense",
          })
            .then((res: any) => {})
            .catch((err: any) => {});
        });
      } else {
        PushNotifyUser({
          ...notifyPayload,
          type: "quittense",
        })
          .then((res: any) => {})
          .catch((err: any) => {});
      }

      let updateDoc = await QuitenseModel.updateOne(
        { _id: findExistingData?._id },
        payload
      );
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
    if (body?.method) {
      payload = { ...body, step: 1 };
      notifyPayload["title"] = "Client has updated Payment Method";
      notifyPayload["listenTo"] = findCase?.user?._id;
      notifyPayload["role"] = "expert";
      notifyPayload["description"] = "Client has updated Payment Method";
    }
    PushNotifyUser({
      ...notifyPayload,
      type: "quittense",
    })
      .then((res: any) => {})
      .catch((err: any) => {});
    let createDoc = await QuitenseModel.create(payload);
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

    const getDoc = await QuitenseModel.findOne({ case_id });
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
