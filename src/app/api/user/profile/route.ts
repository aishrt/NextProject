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

    const name = formData.get("name");
    const email = formData.get("email");
    const gender = formData.get("gender");
    const dob = formData.get("dob");

    const server = await getServerSession(authOptions);
    if (server && server.user) {
      let img = server.user.image;
      const file = formData.get("image") as File;
      if (file) {
        const uploadedFile = await uploadFile(file);
        if(typeof uploadedFile === "string"){
          img = uploadedFile;
        }
      }
      const id = server.user?._id ?? "";
      await User.updateOne({ _id: id }, { name, email, dob, gender, image: img });
    }

    return NextResponse.json({ message: "User updated" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
