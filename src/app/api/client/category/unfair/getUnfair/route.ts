import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import Unfair from "@/models/unfair.model";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    db.connectDB();
    let data;
    const server = await getServerSession(authOptions);
    if (server?.user?._id) {
      const id = server.user?._id;
      let unfairId: string = req.nextUrl.searchParams.get("id")!;
      let caseId: string = req.nextUrl.searchParams.get("caseId")!;

      console.log(unfairId, "unfairId");
      console.log(caseId, "caseId");

      if (unfairId) {
        data = await Unfair.findById(unfairId);
      } else if (caseId) {
        data = await Unfair.findOne({ caseId: caseId });
      } else {
        data = await Unfair.find({ user: id });
      }

      return NextResponse.json({
        message: "Unfair of the user!",
        data: data,
      });
    } else {
      return NextResponse.json(
        { message: "Authentication required !" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
