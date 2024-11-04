import Case from "@/models/case.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import moment from "moment";
import CaseDocument from "@/models/documents.model";
import mongoose from "mongoose";
import Lawyer from "@/models/lawyer.model";
import User from "@/models/user.model";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    const server = await getServerSession(authOptions);
    let user = null;
    if (server && server.user) {
      user = server.user;
    }
    const userId = user?._id ?? "";
    let caseId: string = req.nextUrl.searchParams.get("caseId")!;

    const role = req.nextUrl.searchParams.get("role");

    const referenceId = req.nextUrl.searchParams.get("referenceId");
    const status = req.nextUrl.searchParams.get("status");
    const lawyer = req.nextUrl.searchParams.get("lawyer");
    const name = req.nextUrl.searchParams.get("name");
    const submissionDate = req.nextUrl.searchParams.get("submissionDate");
    const updatedDate = req.nextUrl.searchParams.get("updatedDate");
    const type: any = req.nextUrl.searchParams.get("type");
    const userID: any = req.nextUrl.searchParams.get("user");
    let page: string | null = req.nextUrl.searchParams.get("page");
    const isLawyer = req.nextUrl.searchParams.get("isLawyer");
    const dataPerPage = req.nextUrl.searchParams.get("dataPerPage");

    page = !!page ? page : "1";
    const totalCase = await Case.countDocuments();
    const totalPages = Math.ceil(totalCase / Number(dataPerPage));
    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }

    const start = pageNumber - 1;

    if (caseId) {
      const data = await Case.findOne({ _id: caseId })
        .populate([
          { path: "lawyer", model: Lawyer },
          { path: "user", model: User },
        ])
        .limit(10)
        .skip(start * 10);

      return NextResponse.json({
        message: "Get case data",
        data: data,
      });
    } else {
      let query: any = {};

      if (role == "client") {
        query.user = userId;
      }
      if (role == "lawyer") {
        query.lawyer = userId;
      }

      if (referenceId) {
        query.referenceId = referenceId;
      }
      if (type) {
        // if (role == "client" && type == "litigation") {
        //   query.isLaywerAssigned = true;
        // }
        // if (!type == "null") {
        query.caseType = type;
        //}
      }

      if (lawyer) {
        const foundLawyers = await Lawyer.find({
          name: new RegExp(lawyer, "i"),
        });
        if (foundLawyers.length > 0) {
          query.lawyer = foundLawyers.map((lawyer) => lawyer._id);
        }
      }

      if (name) {
        if (query.groupInfo) {
          query.groupInfo.first_name = new RegExp(name, "i");
        }
      }
      if (status) {
        query.status = status;
      }

      if (submissionDate) {
        const startOfDay = moment(submissionDate, "DD/MM/YYYY")
          .startOf("day")
          .toDate();
        const endOfDay = moment(submissionDate, "DD/MM/YYYY")
          .endOf("day")
          .toDate();
        query.createdAt = { $gte: startOfDay, $lte: endOfDay };
      }

      if (updatedDate) {
        const startOfDay = moment(updatedDate, "DD/MM/YYYY")
          .startOf("day")
          .toDate();
        const endOfDay = moment(updatedDate, "DD/MM/YYYY")
          .endOf("day")
          .toDate();
        query.updatedAt = { $gte: startOfDay, $lte: endOfDay };
      }

      // if (isLawyer == "true") {
      //   query["isLaywerAssigned"] = true;
      // }

      // if (userID) {
      //   query["user"] = userID;
      // }

      console.log(query, "====query");
      const data = await Case.find(query)
        .populate([
          { path: "lawyer", model: Lawyer },
          { path: "user", model: User },
        ])
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * Number(dataPerPage))
        .limit(Number(dataPerPage) ?? 10);
      //.skip(start <= 0 ? 0 : start * 10);

      let total = await Case.countDocuments(query);
      return NextResponse.json({
        message: "Get case data",
        data: {
          data: data,
          currentPage: pageNumber,
          totalEntries: total,
        },
        status: 200,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
