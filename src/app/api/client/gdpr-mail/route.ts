import { sendGDPRConsentEmail } from "@/service/email";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const { email } = await req.json();
    const data = await sendGDPRConsentEmail(email);
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
