import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import PrivacyPolicy from "@/models/privacyPolicy.model";

export async function POST(req: NextRequest) {
  try {
    await db.connectDB(); // Ensure that db.connectDB() is awaited if it's asynchronous

    const server = await getServerSession(authOptions);
    const user = server?.user;
     const userId = user?._id ?? "";
    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 400 }
      );
    }

    let data;
    try {
      data = await req.json();
    } catch (error) {
      return NextResponse.json(
        { message: "No data received" },
        { status: 400 }
      );
    }

    // if (!data || Object.keys(data).length === 0) {
    //   return NextResponse.json(
    //     { message: "No data received" },
    //     { status: 400 }
    //   );
    // }
    const existingPolicy = await PrivacyPolicy.findOne({
      userType: data?.userType,
    });

    if (existingPolicy) {
      // Update the existing Privacy Policy
      existingPolicy.set(data);
      await existingPolicy.save();

      return NextResponse.json(
        {
          message: "Privacy Policy updated successfully",
          data: existingPolicy,
        },
        { status: 200 }
      );
    } else {
      // Create a new Privacy Policy
      const newPolicy = await PrivacyPolicy.create(data);

      return NextResponse.json(
        {
          message: "Privacy Policy added successfully",
          data: newPolicy,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}