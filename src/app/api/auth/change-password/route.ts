import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import User from "@/models/user.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
const bcrypt = require("bcryptjs");

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const id = req.nextUrl.searchParams.get("id");
    const role = req.nextUrl.searchParams.get("role");

    const { currentPassword, newPassword } = await req.json();
    if (!id || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

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

    const user = await model.findById(id);

    // const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: `No ${role} found` },
        { status: 400 }
      );
    }
    if (user) {
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user?.password
      );
      // const isPasswordMatch = await user.isPasswordMatch(currentPassword);

      if (!isPasswordMatch) {
        return NextResponse.json(
          { message: "Incorrect current password" },
          { status: 400 }
        );
      }
      if (newPassword == currentPassword) {
        return NextResponse.json(
          {
            message:
              "The new password should be different from the current password",
          },
          { status: 400 }
        );
      } else {
        user.password = newPassword;
        await user.save();
        return NextResponse.json(
          { message: "Password changed successfully !." },
          { status: 200 }
        );
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
