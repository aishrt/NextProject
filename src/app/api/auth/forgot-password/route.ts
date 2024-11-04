import User from "@/models/user.model";
import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";

import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateResetPasswordToken } from "../token/token.service";
import { sendPasswordResetEmail } from "@/service/email";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const role = req.nextUrl.searchParams.get("role") ?? "";

    const { email } = await req.json();

    const model =
      role === "client" || role === "admin"
        ? User
        : role === "expert"
        ? Expert
        : role === "lawyer"
        ? Lawyer
        : null;

    if (!model) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // const user = await User.findOne({ email });

    const user = await model.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: `No ${role} found with this email` },
        { status: 400 }
      );
    }
    if (user) {
      const resetPasswordToken = await generateResetPasswordToken(user);
      const data = await sendPasswordResetEmail(
        email,
        resetPasswordToken,
        role
      );
    }
    return NextResponse.json(
      { message: "A password reset link has been sent to your email." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
