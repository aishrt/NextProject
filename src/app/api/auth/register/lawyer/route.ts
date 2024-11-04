import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailVerification } from "@/service/email";
import Lawyer from "@/models/lawyer.model";

const fourDigitCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export async function POST(req: NextRequest) {
  try {
    db.connectDB();

    const { name, email, phoneNumber, password, legalExpertise , languages , gender, address } =
      await req.json();

    const findEmail = await Lawyer.findOne({ email });
    const findPhone = await Lawyer.findOne({ phoneNumber });

    if (findEmail || findPhone) {
      return NextResponse.json(
        {
          message: `${findEmail ? "Email" : "Phone Number"} already exists`,
        },
        { status: 400 }
      );
    }

    const otp = fourDigitCode();

    await Lawyer.create({
      name,
      email,
      phoneNumber,
      password,
      otp,
     legalExpertise , languages , gender, address,
      expireOtp: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
    });

    await sendEmailVerification(email, otp);

    return NextResponse.json({
      message: "Lawyer register successfully. OTP has been sent to your email.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
