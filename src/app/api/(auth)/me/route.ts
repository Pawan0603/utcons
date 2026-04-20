import { AuthenticatedRequest, withAuth } from "@/lib/auth/middleware";
import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";

async function me(req: AuthenticatedRequest){
    await connectDB();
    try {
        const user = req.user!;

        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 });

        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({error: `Internal server error: ${error}`}, {status: 500})
    }
}

export const GET = withAuth(me)