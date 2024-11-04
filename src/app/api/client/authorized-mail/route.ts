import { sendAuthorizedDelegationEmail } from "@/service/email";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const data = await req.json();
    
    const result = await sendAuthorizedDelegationEmail(data);
    return NextResponse.json(
      { message: "Email sent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
