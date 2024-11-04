import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import Vexatious from "@/models/vexatious.model";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    db.connectDB();
    let data;
    const server = await getServerSession(authOptions);
    if (server?.user?._id) {
      const id = server.user?._id;
      let vexatiousId: string = req.nextUrl.searchParams.get("id")!;
      let caseId: string = req.nextUrl.searchParams.get("caseId")!;

      if (vexatiousId) {
        data = await Vexatious.findById(vexatiousId);
      } else if (caseId) {
        data = await Vexatious.findOne({ caseId: caseId });
      } else {
        data = await Vexatious.find({ user: id });
      }

      return NextResponse.json({
        message: "Vexatious form data of the user!",
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
