import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, type JWTPayload } from "./jwt"

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

interface RouteContext {
  // params?: Record<string, string | string[]>;
  // params: Promise<{ id: string }>; // not working on vercel deployment
  params: Promise<Record<string, string>>
}

export function withAuth(handler: (req: AuthenticatedRequest, context: RouteContext) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest, context: RouteContext): Promise<NextResponse> => {
    try {
      // const authHeader = req.headers.get("accessToken")
      const cookieStore = req.cookies.get("accessToken")
      const authHeader = cookieStore?.value;

      // console.log("Authorization Header:", authHeader);
      //   const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null
      const token = authHeader;

      if (!token) {
        return NextResponse.json({ error: "Access token required" }, { status: 401 })
      }

      const payload = verifyToken(token)
      if (!payload) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }
      // console.log("payload: ", payload)
      req.user = payload
      return handler(req, context)
    } catch (error) {
      console.log("Authentication error:", error)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
  }
}

// export function withOwnerAuth(handler: (req: AuthenticatedRequest, context: RouteContext) => Promise<NextResponse>) {
//   return withAuth(async (req: AuthenticatedRequest, context: RouteContext): Promise<NextResponse> => {
//     if (!req.user || !["owner"].includes(req.user.role)) {
//       return NextResponse.json({ error: "Admin access required" }, { status: 403 })
//     }
//     return handler(req, context)
//   })
// }

// export function withAdminAuth(handler: (req: AuthenticatedRequest, context: RouteContext) => Promise<NextResponse>) {
//   return withAuth(async (req: AuthenticatedRequest, context: RouteContext): Promise<NextResponse> => {
//     if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
//       return NextResponse.json({ error: "Admin access required" }, { status: 403 })
//     }
//     return handler(req, context)
//   })
// }