import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import Sudden from "@/models/sudden.model";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    db.connectDB();
    let data;
    const server = await getServerSession(authOptions);
    if (server?.user?._id) {
      const id = server.user?._id;
      let suddenId: string = req.nextUrl.searchParams.get("id")!;
      let caseId: string = req.nextUrl.searchParams.get("caseId")!;

      console.log(suddenId, "suddenId");
      console.log(caseId, "caseId");

      if (suddenId) {
        data = await Sudden.findById(suddenId);
      } else if (caseId) {
        data = await Sudden.findOne({ caseId: caseId });
      } else {
        data = await Sudden.find({ user: id });
      }

      return NextResponse.json({
        message: "Sudden form data of the user!",
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
