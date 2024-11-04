import { NextResponse } from "next/server";
import db from "@/utils/connectDB"; // Import your database connection
import Lawyer from "@/models/lawyer.model"; // Import your Lawyer model

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  
  try {
    await db.connectDB();

    const lawyer = await Lawyer.findById(id).select('experiences educations achievements aboutMe docStatus');

    if (!lawyer) {
      return NextResponse.json({ message: "Lawyer not found" }, { status: 404 });
    }

    return NextResponse.json({data:{data: lawyer}});
  } catch (error) {
    console.error("Error fetching lawyer documents:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
