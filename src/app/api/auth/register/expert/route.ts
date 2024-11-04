import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailVerification } from "@/service/email";
import Expert from "@/models/expert.model";

const fourDigitCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export async function POST(req: NextRequest) {
  try {
    db.connectDB();

    const {
      firstName,
      address,
      gender,
      lastName,
      email,
      phoneNumber,
      password,
      expertise,
    } = await req.json();

    const findEmail = await Expert.findOne({ email: email.toLowerCase() });

    const findPhone = await Expert.findOne({ phoneNumber });

    if (findEmail || findPhone) {
      return NextResponse.json(
        {
          message: `${findEmail ? "Email" : "Phone Number"} already exists`,
        },
        { status: 400 }
      );
    }

    const otp = fourDigitCode();

    await Expert.create({
      firstName,
      address,
      gender,
      lastName,
      email,
      phoneNumber,
      password,
      expertise,
      otp,
      expireOtp: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
    });

    await sendEmailVerification(email, otp);

    return NextResponse.json({
      message: "Expert register successfully. OTP has been sent to your email.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
