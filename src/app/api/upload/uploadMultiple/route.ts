// import axios from "axios";

// export type UploadDTO = {
//   file: File;
// };

// export type UploadResponse = {
//     url: string;
//   };

// export const uploadImage = (data: UploadDTO): Promise<UploadResponse> => {
//   const formData = new FormData();
//   formData.append('file', data.file);
//   return axios.post('/auth/upload', formData);
// };

import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import { uploadFiles } from "@/utils/useMultipleSelect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const formData = await req.formData();

    const server = await getServerSession(authOptions);
    if (server && server.user) {
      let img = server.user.image;
      const file = formData.get("documents") as unknown as FileList;
      console.log(file, "file 456123");

      if (file) {
        const uploadedFile = await uploadFiles(file);
        console.log(uploadedFile);
      }
      const id = server.user?._id ?? "";
    }

    return NextResponse.json({ message: "User updated" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
