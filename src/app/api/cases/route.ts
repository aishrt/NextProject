import Case from "@/models/case.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

type UserRole = "client" | "lawyer" | "expert";

interface SessionUser {
  _id: string;
  role: UserRole;
}

interface Session {
  user: SessionUser;
}

export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    // Connect to the database
    await db.connectDB();
    let search = req.nextUrl.searchParams.get("search");
    // Get session user
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user) {
      return NextResponse.json({ error: "UnAuthorized" }, { status: 400 });
    }
    let query: any = {};
    if (search) {
      query["$or"] = [{ referenceId: Number(search) }];
    }
    const user = session.user;
    const role = user.role; // Assuming the role is stored in the session
    // console.log(search,'===========search')
    let cases;

    if (role === "client") {
      query.user = user?._id;
      // Filter by user ID
      cases = await Case.find(query).sort({ createdAt: -1 }).exec();
    } else if (role === "lawyer") {
      query.lawyer = user?._id;

      // Filter by lawyer ID
      cases = await Case.find(query).sort({ createdAt: -1 }).exec();
    } else if (role === "expert") {
      // Expert can see all cases
      cases = await Case.find(query).sort({ createdAt: -1 }).exec();
    } else if (role === "admin") {
      // Expert can see all cases
      cases = await Case.find(query).sort({ createdAt: -1 }).exec();
    } else {
      return NextResponse.json({ error: "Invalid Role" }, { status: 400 });
    }

    // Send the cases back as JSON
    return NextResponse.json(
      {
        data: {
          data: cases,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
