import User from "@/models/user.model";
import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import Token from "@/models/token.model";
import { tokenTypes } from "@/config/token";
const bcrypt = require("bcryptjs");

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const email = req.nextUrl.searchParams.get("email");
    const role = req.nextUrl.searchParams.get("role");

    const { confirmPassword } = await req.json();

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

    const user = await model.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: `No ${role} found with this email` },
        { status: 400 }
      );
    }
    if (user) {
      const newpassword = await bcrypt.hash(confirmPassword, 8);

      await model.findByIdAndUpdate(
        user._id,
        { password: newpassword },
        { new: true }
      );
      await Token.deleteMany({
        user: user.id,
        type: tokenTypes.RESET_PASSWORD,
      });
    }
    return NextResponse.json(
      { message: "Password changed successfully !." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
