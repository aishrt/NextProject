import User from "@/models/user.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import { uploadFile } from "@/utils/upload";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const formData = await req.formData();

    const firstName = formData.get("firstName");
    const email = formData.get("email");
    const phoneNumber = formData.get("phoneNumber");
    const dob = formData.get("dob");
    const nationality = formData.get("nationality");
    const emergencyContact = formData.get("emergencyContact");
    const location = formData.get("location");
    const coordinates: any = formData.get("coordinates");
    const locationName: any = formData.get("locationName");

    const server = await getServerSession(authOptions);
    if (server && server.user) {
      let img = server.user.image;
      const file = formData.get("image") as File;
      if (file) {
        const uploadedFile = await uploadFile(file);
        if (typeof uploadedFile === "string") {
          img = uploadedFile;
        }
      }
      const id = server.user?._id ?? "";

      let findExist = await User.findOne({
        email: email,
        _id: { $ne: id },
      });

      if (findExist) {
        return NextResponse.json(
          { message: "This email address already registered" },
          { status: 400 }
        );
      }

      let MobileExist = await User.findOne({
        phoneNumber: phoneNumber,
        _id: { $ne: id },
      });

      if (MobileExist) {
        return NextResponse.json(
          { message: "This Mobile Number already registered" },
          { status: 400 }
        );
      }

      const user = await User.findByIdAndUpdate(
        { _id: id },
        {
          firstName,
          email,
          phoneNumber,
          dob,
          nationality,
          emergencyContact,
          location,
          coordinates: JSON.parse(coordinates),
          locationName: JSON.parse(locationName),
          image: img,
        }
      );

      return NextResponse.json(
        {
          message: "Profile updated",
          data: user,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
