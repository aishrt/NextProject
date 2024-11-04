import Case from "@/models/case.model";
import CaseDocument from "@/models/documents.model";
import TaskModel from "@/models/tasks.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let {
      page,
      submissionAt,
      validTill,
      search,
      count,
      role,
      id,
      task_id,
      status,
    }: any = {
      page: req.nextUrl.searchParams.get("page") || 1,
      submissionAt: req.nextUrl.searchParams.get("submissionAt"),
      validTill: req.nextUrl.searchParams.get("validTill"),
      search: req.nextUrl.searchParams.get("search") || "",
      count: req.nextUrl.searchParams.get("count") || 10,
      role: req.nextUrl.searchParams.get("role") || "",
      id: req.nextUrl.searchParams.get("id") || "",
      task_id: req.nextUrl.searchParams.get("task_id") || "",
      user_id: req.nextUrl.searchParams.get("user_id") || "",

      status: req.nextUrl.searchParams.get("status") || "",
    };
    const server = await getServerSession(authOptions);
    const user = server?.user;
    const userId = user?._id ?? "";

    if (task_id) {
      let data = await CaseDocument.findOne({ _id: task_id });
      if (!data) {
        return NextResponse.json(
          {
            data: {
              status: 400,
              message: "Task not found",
            },
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json({
          data: {
            data: data,
            status: 200,
            message: "Task fetched successfully",
          },
        });
      }
    }

    let query: any = {};
    if (id) {
      query["case_id"] = id;
    }
    if (status) {
      query["status"] = status;
    }
    if (status == "all") {
      delete query.status;
    }
    if (id) {
      delete query.taskFor;
    }
    if (role == "client") {
      query["$or"] = [{ user_id: userId }];
    }
    if (role == "expert") {
      delete query.taskFor;
      delete query.role;
    }
    if (role == "lawyer") {
      delete query.taskFor;
      delete query.role;
      const findCases = await Case.find({ lawyer: userId });

      let CasePipe = findCases?.map((itm: any) => {
        return { case_id: itm?._id };
      });
      query["$or"] = CasePipe;
    }
    if (submissionAt) {
      query["submissionAt"] = {
        $lte: new Date(submissionAt),
      };
    }
    if (validTill) {
      query["validTill"] = {
        $lte: new Date(validTill),
      };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const totalCount = await CaseDocument.countDocuments(query);
    const totalPages = Math.ceil(totalCount / 10);

    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const skip = (pageNumber - 1) * 10;

    let TasksList = await CaseDocument.find(query)
      .populate("task_id")
      .populate("case_id")
      .skip(skip < 0 ? 0 : skip)
      .limit(10)
      .exec();

    return NextResponse.json({
      data: {
        currentPage: pageNumber,
        totalEntries: totalCount,
        data: TasksList,
        status: 200,
        message: "Task fetched Successfully",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {
          message: error?.message || "Internal server error",
          code: 500,
        },
      },
      { status: 500 }
    );
  }
}