import User from "@/models/user.model";
import Expert from "@/models/expert.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailVerification } from "@/service/email";
import Lawyer from "@/models/lawyer.model";

const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

const findUserByRole = async (role: string, email: string) => {
  if (role === "expert") return Expert.findOne({ email });
  if (role === "lawyer") return Lawyer.findOne({ email });
  if (role === "client" || role == "admin") return User.findOne({ email });
  return null;
};

const updateUserOtp = async (user: any, otp: number) => {
  user.otp = otp;
  user.expireOtp = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  await user.save();
};

export async function GET(req: NextRequest) {
  try {
    db.connectDB();

    const email = req.nextUrl.searchParams.get("email")!;
    const isUser = req.nextUrl.searchParams.get("getUser") === "true";
    const role = req.nextUrl.searchParams.get("role")!;

    const user = await findUserByRole(role, email);

    if (!user) {
      return NextResponse.json({ message: `User not found` }, { status: 400 });
    }
    if (user?.isBlock || user?.isDeleted) {
      return NextResponse.json(
        { message: `User is not allowed to login` },
        { status: 400 }
      );
    }
    if (
      !isUser &&
      !user.isEmailVerified &&
      user.expireOtp &&
      new Date() > user.expireOtp
    ) {
      const otp = generateOtp();
      await sendEmailVerification(email, otp);
      await updateUserOtp(user, otp);
    }

    return NextResponse.json(
      { message: "Fetch user", data: user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
