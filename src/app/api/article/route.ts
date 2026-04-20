import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import ArticleModel from "@/lib/models/article";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createAuditLog } from "@/lib/auditLogger";

import "@/lib/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const body = await req.json();
    const { title, content, status } = body;

    // ✅ Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // ✅ Create Article
    const article = await ArticleModel.create({
      title: title.trim(),
      content,
      createdBy: decoded._id,
      status: status || "draft",
    });

    article.save();

    await createAuditLog({
      userId: decoded._id,
      action: "CREATE_ARTICLE",
      articleId: article._id.toString(),
    });

    return NextResponse.json(
      {
        message: "Article created successfully",
        article,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Article Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Decode user
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    let articles;

    // RBAC Logic
    if (decoded.role === "admin" || decoded.role === "editor") {
      // Admin & Editor → all articles
      articles = await ArticleModel.find().sort({ createdAt: -1 }).populate("createdBy", "name email role");
    } else {
      // Viewer → only published
      articles = await ArticleModel.find({ status: "published" }).sort({
        createdAt: -1,
      }).populate("createdBy", "name email role");
    }

    return NextResponse.json(
      { articles },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Articles Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}