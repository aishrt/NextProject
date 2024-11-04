import { NextResponse } from "next/server";
import db from "@/utils/connectDB"; 
import Lawyer from "@/models/lawyer.model";

export async function POST(request: Request, { params }: {params: { id: string }}) {
  const id = params.id;
  
  if (!id) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const { reason } = await request.json();

  if (!reason) {
    return NextResponse.json({ message: "Rejection reason is required" }, { status: 400 });
  }

  try {
    await db.connectDB();
    const result = await Lawyer.findByIdAndUpdate(
      id,
      { 
        $set: { 
          docStatus: "rejected",
          rejectReason: reason 
        } 
      },
      { new: true } 
    );
    
    if (!result) {
      return NextResponse.json({ error: "Lawyer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Documents rejected successfully" });
  } catch (error) {
    return NextResponse.error();
  }
}
