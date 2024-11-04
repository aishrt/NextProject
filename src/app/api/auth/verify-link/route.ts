import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { expiration } from "@/config/jwt";
export async function GET(req: NextRequest) {
  const url = process.env?.NEXTAUTH_URL;
  const role = req.nextUrl.searchParams.get("role");
  try {
    db.connectDB();
    const email = req.nextUrl.searchParams.get("email");
    const token = req.nextUrl.searchParams.get("token");

    const decodedToken = jwt.verify(token ?? "", expiration.JWT_SECRET);

    return NextResponse.redirect(
      `${url}/auth/reset-password?email=${email}&role=${role}`,
      { status: 307 }
    );
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      console.log("Token expired");
      //   return NextResponse.json(
      //     { message: "Token has expired. Please request a new password reset." },
      //     { status: 401 }
      //   );
      return NextResponse.redirect(`${url}/auth/verify-token?role=${role}`, { status: 307 });
    } else {
      console.log(error, "Error occurred");
      return NextResponse.json(
        { message: error?.message ?? "Internal server error" },
        { status: 400 }
      );
    }
  }
}
