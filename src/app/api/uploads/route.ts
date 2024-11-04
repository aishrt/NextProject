import { writeFile } from "fs/promises";
import path from "path";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import CaseDocument from "@/models/documents.model";

const uploadDocs = async (file: any) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + file.name.replaceAll(" ", "_");
  const format = file.type.split("/").pop();

  try {
    await writeFile(
      path.join(process.cwd(), "public/uploads/" + filename),
      buffer
    );
    return `/${filename}`;
    // return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    // return NextResponse.json({ Message: "Failed", status: 500 });
  }
};

export async function POST(req: NextRequest) {
  try {
    db.connectDB();

    const formData = await req.formData();
    const file = formData.get("file");
    const case_id = formData.get("case_id");
    const type = formData.get("type");

    return uploadDocs(file).then(async (res: any) => {
      if (type == "case") {
        await CaseDocument.create({
          case_id,
          documents: res,
        });
      }
      return NextResponse.json({
        message: "File uploaded Successfuly",
        success: true,
        data: {
          filePath: res,
        },
      });
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
