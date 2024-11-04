import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import Wrongful from "@/models/wrongful.model";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    db.connectDB();
    let data;
    const server = await getServerSession(authOptions);
    if (server?.user?._id) {
      const id = server.user?._id;
      let wrongfulId: string = req.nextUrl.searchParams.get("id")!;
      let caseId: string = req.nextUrl.searchParams.get("caseId")!;

      console.log(wrongfulId, "wrongfulId");
      console.log(caseId, "caseId");

      if (wrongfulId) {
        data = await Wrongful.findById(wrongfulId);
      } else if (caseId) {
        data = await Wrongful.findOne({ caseId: caseId });
      } else {
        data = await Wrongful.find({ user: id });
      }

      return NextResponse.json({
        message: "Wrongful form data of the user!",
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
