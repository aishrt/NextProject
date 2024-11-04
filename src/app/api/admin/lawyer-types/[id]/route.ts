import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/connectDB";
import LawyerTypes from "@/models/lawyerTypes.model";

// Connect to the database
async function connectToDB() {
  await db.connectDB();
}

// Named export for the DELETE method
export async function DELETE(req: NextRequest, { params }: {params: { id : string }}) {
  try {
    await connectToDB();

    const id = params.id;

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const deletedLawyerType = await LawyerTypes.findByIdAndDelete(id);

    if (!deletedLawyerType) {
      return NextResponse.json({ message: "Lawyer type not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Lawyer type deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting lawyer type:", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

// Named export for the GET method
export async function GET(req: NextRequest, { params }: {params: { id : string }}) {
  try {
    await connectToDB();

    const id = params.id;

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const lawyerType = await LawyerTypes.findById(id);
    if (!lawyerType) {
      return NextResponse.json({ message: "Lawyer type not found" }, { status: 404 });
    }

    return NextResponse.json(lawyerType, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching lawyer type:", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

// Named export for the PUT method
export async function PUT(req: NextRequest, { params }: {params: { id : string }}) {
  try {
    await connectToDB();

    const id = params.id;

    const data = await req.json();
    const { name } = data;

    if (!id || !name || typeof name !== "string") {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const updatedLawyerType = await LawyerTypes.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedLawyerType) {
      return NextResponse.json({ message: "Lawyer type not found" }, { status: 404 });
    }

    return NextResponse.json(updatedLawyerType, { status: 200 });
  } catch (error: any) {
    console.error("Error updating lawyer type:", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

