import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Lawyer from "@/models/lawyer.model";
import { uploadFile } from "@/utils/upload";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

export async function POST(req: NextRequest) {
  try {
    await db.connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user._id) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const lawyerId = session.user._id;

    const formData = await req.formData();

    const experiences: any = [];
    const educations:any = [];
    const achievements: any = [];

    const aboutMe = formData.get("aboutMe");

    const processSection = async (sectionName: any, sectionArray: any) => {
      let index = 0;
      while (formData.has(`${sectionName}[${index}][description]`)) {
        const description = formData.get(
          `${sectionName}[${index}][description]`
        );
        const file: any = formData.get(`${sectionName}[${index}][upload]`);
        let url: string | undefined = "";

        if (file) {
          url = await uploadFile(file);
        }

        sectionArray.push({ description, url });
        index++;
      }
    };

    await processSection("experiences", experiences);
    await processSection("educations", educations);
    await processSection("achievements", achievements);

    const updatedLawyer = await Lawyer.findByIdAndUpdate(
      lawyerId,
      {
        experiences,
        educations,
        achievements,
        aboutMe,
        docStatus: "submitted",
      },
      { new: true }
    );

    if (!updatedLawyer) {
      return NextResponse.json(
        { message: "Lawyer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Documents uploaded and lawyer updated successfully",
        data: updatedLawyer,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
