import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import User from "@/models/user.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

const updateUserVerificationStatus = async (model: any, userId: string) => {
  await model.findByIdAndUpdate(
    userId,
    { isEmailVerified: true },
    { new: true }
  );
};

export async function POST(req: NextRequest) {
  try {
    db.connectDB();

    const email = req.nextUrl.searchParams.get("email") ?? "";
    const role = req.nextUrl.searchParams.get("role") ?? "";
    const { otp } = await req.json();

    const model =
      role === "client"
        ? User
        : role === "expert"
        ? Expert
        : role === "lawyer"
        ? Lawyer
        : null;

    if (!model) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Find user
    const user = await model.findOne({ email, otp });

    if (!user) {
      return NextResponse.json({ message: "Incorrect OTP" }, { status: 400 });
    }

    if (user.expireOtp && new Date() > user.expireOtp) {
      return NextResponse.json({ message: "OTP has expired" }, { status: 400 });
    }

    await updateUserVerificationStatus(model, user._id);

    return NextResponse.json(
      { message: "OTP Verified Successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
