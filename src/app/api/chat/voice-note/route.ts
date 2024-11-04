import db from "@/utils/connectDB";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const audio: any = form.get("file");
    console.log(audio);
    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `audio${new Date()}.webm`;
    await writeFile(
      path.join(process.cwd(), "public/uploads/" + `${fileName}`),
      buffer
    )
      .then((res: any) => {
        console.log(res);
        return NextResponse.json({
          message: "file saved",
          data: {
            filePath: `/${fileName}`,
          },
        });
      })
      .catch((error: any) => {
        return NextResponse.json({
          message: "file not  saved",
          error,
        });
      });
    return NextResponse.json({
      message: "file saved",
      data: {
        filePath: `/${fileName}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
