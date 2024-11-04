import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/connectDB";
import Member from "@/models/member.model";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    db.connectDB();

    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { message: "Member id not found !!" },
        { status: 400 }
      );
    }

    const deleteMember = await Member.findByIdAndDelete(id);

    if (!deleteMember) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Case member deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting:", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    db.connectDB();

    const id = params.id;
    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No data received" },
        { status: 400 }
      );
    }

    const updateMember = await Member.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updateMember) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updateMember, { status: 200 });
  } catch (error: any) {
    console.error("Error updating:", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    db.connectDB();
    const id = params.id;

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const findMember = await Member.findById(id);
    if (!findMember) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(findMember, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching:", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
