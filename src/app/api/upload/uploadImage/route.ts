// const upload = catchAsync(async (req, res) => {
//     try {
//       if (req.file) {
//         const data = `${process.env.BACKEND_URL}/${req.file.filename}`;
//         return res.status(200).json({
//           status: 200,
//           message: 'Image upload successfully',
//           url: data,
//         });
//       }
//       return res.status(400).json({
//         status: 400,
//         message: "File doesn't exist",
//         data: {},
//       });
//     } catch (error) {
//       return res.status(500).send({ status: 500, message: error.message, error: error.stack });
//     }
//   });

import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import mongoose from "mongoose";
import { uploadFile } from "@/utils/upload";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const server = await getServerSession(authOptions);
    if (server?.user) {
      const id = server.user?._id;

      const data = await req.json();
      console.log(data, "daataa ++++++");

      if (id) {
        if (data) {
          for (const file of data) {
            if (file) {
              // const res = await uploadFile({ file });
              // console.log(res, "jvnkjng");

              //   uploads.push({ url: res.url, name: file.name });

              // if (isVideo(file.name)) {
              //   const cov = await getVideoCover(file, 1.5);
              //   setCover(cov);
              // }
              // if (isPdf(file.name)) {
              //   const pdfName = file.name;
              //   setpdfName(pdfName);
              // }
            }
          }
          ///const { name, email, phone, address, image } = data;
          //const data = `${process.env.NEXTAUTH_URL}/${req.file.filename}`;

          return NextResponse.json(
            {
              message: "Image upload successfully",
              data: "data",
            },
            { status: 200 }
          );
        }
        return NextResponse.json(
          {
            message: "File doesn't exist",
            data: {},
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            message: "Authentication required ",
          },
          { status: 400 }
        );
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
