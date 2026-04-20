import connectDB from "@/lib/connectDB";
import ArticleModel from "@/lib/models/article";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createAuditLog } from "@/lib/auditLogger";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "admin" && decoded.role !== "editor") {
      return NextResponse.json(
        { error: "Forbidden: You cannot publish articles" },
        { status: 403 }
      );
    }

    const article = await ArticleModel.findById(id);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    article.status = "published";
    await article.save();

    await createAuditLog({
      userId: decoded._id,
      action: "PUBLISH_ARTICLE",
      articleId: article._id.toString(),
    });

    return NextResponse.json(
      { message: "Article published successfully", article },
      { status: 200 }
    );
  } catch (error) {
    console.error("Publish Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



// delete route for article

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    // ✅ get token
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // ✅ find article
    const article = await ArticleModel.findById(id);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // ✅ RBAC
    const isOwner = article.createdBy === decoded.userId;
    const isAdmin = decoded.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You cannot delete this article" },
        { status: 403 }
      );
    }

    // ✅ delete
    await ArticleModel.findByIdAndDelete(id);

    await createAuditLog({
      userId: decoded._id,
      action: "DELETE_ARTICLE",
      articleId: article._id.toString(),
    });

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}