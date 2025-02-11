export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    let regNumber: string = req.nextUrl.searchParams.get("registration")!;
    const response = await fetch(
      `https://api.societe.com/api/v1/entreprise/${regNumber}/dirigeants?token=850edc5dbb448c45b1d4fd5e7d053a06`
    );
    const data = await response.json();

    if (data.error) {
      console.log(data.error);
      return NextResponse.json(
        { message: data?.error?.codemsg ?? "Not found" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Legal info data",
      data,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
