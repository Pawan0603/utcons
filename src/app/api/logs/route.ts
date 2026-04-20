import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import AuditLogModel from "@/lib/models/auditLog";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import "@/lib/models/user";
import "@/lib/models/article";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // ❌ Viewer not allowed
    if (decoded.role === "viewer") {
      return NextResponse.json(
        { error: "Forbidden: Access denied" },
        { status: 403 }
      );
    }

    let logs;

    if (decoded.role === "admin") {
      // ✅ Admin → all logs
      logs = await AuditLogModel.find()
        .sort({ createdAt: -1 })
        .populate("userId", "name email") // optional
        .populate("articleId", "title");  // optional
    } else {
      // ✅ Editor → only their logs
      logs = await AuditLogModel.find({
        userId: decoded._id,
      })
        .sort({ createdAt: -1 })
        .populate("userId", "name email")
        .populate("articleId", "title");
    }

    return NextResponse.json(
      { logs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Logs Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}