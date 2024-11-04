import User from "@/models/user.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailVerification } from "@/service/email";

const fourDigitCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export async function POST(req: NextRequest) {
  try {
    db.connectDB();

    const { firstName, lastName, email, phoneNumber, password } =
      await req.json();

    const findEmail = await User.findOne({ email: email.toLowerCase() });

    const findPhone = await User.findOne({ phoneNumber });

    if (findEmail || findPhone) {
      return NextResponse.json(
        {
          message: `${findEmail ? "Email" : "Phone Number"} already exists`,
        },
        { status: 400 }
      );
    }

    const otp = fourDigitCode();

    await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      otp,
      expireOtp: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
    });

    await sendEmailVerification(email, otp);

    return NextResponse.json({
      message: "User register successfully. OTP has been sent to your email.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
