import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import User from "@/models/user.model";
import { sendEmailVerification } from "@/service/email";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

const fourDigitCode = () => Math.floor(1000 + Math.random() * 9000);

const updateUserOtp = async (model: any, userId: string, otp: number) => {
  await model.findByIdAndUpdate(
    userId,
    {
      otp: otp,
      expireOtp: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
    },
    { new: true }
  );
};

export async function POST(req: NextRequest) {
  try {
    db.connectDB();

    const email = req.nextUrl.searchParams.get("email") ?? "";
    const role = req.nextUrl.searchParams.get("role") ?? "";

    let user;
    const userModel =
      role === "client"
        ? User
        : role === "expert"
        ? Expert
        : role === "lawyer"
        ? Lawyer
        : null;

    if (userModel) {
      user = await userModel.findOne({ email });

      if (user) {
        const otp = fourDigitCode();
        await updateUserOtp(userModel, user._id, otp);
        await sendEmailVerification(email, otp);
        return NextResponse.json(
          { message: "OTP sent to the email address" },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ message: "User not found" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
