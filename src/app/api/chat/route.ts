import { NextRequest, NextResponse } from "next/server";
import { validateChatInput } from "@/server/validation/schemas";
import { ChatService } from "@/server/services/chat.service";
import { checkRateLimit } from "@/lib/rate-limiter";
import { extractAuthToken } from "@/server/auth/middleware";
import { verifyJwt } from "@/server/auth/jwt";
import { apiError } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Sliding-window IP Rate Limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = checkRateLimit(`chat:${ip}`, 60, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too Many Requests. Rate limit exceeded. Please wait before querying again.",
            details: { resetSeconds: rateLimit.resetSeconds },
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetSeconds.toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          },
        }
      );
    }

    const body = await req.json();
    const { query, sessionId } = validateChatInput(body);

    // Optional user authentication
    let userId: string | undefined = undefined;
    const token = extractAuthToken(req);
    if (token) {
      const payload = verifyJwt(token);
      if (payload) userId = payload.userId;
    }

    // 2. Delegate to ChatService
    const { session, response } = await ChatService.processMessage({
      query,
      sessionId,
      userId,
    });

    // 3. Return backward-compatible response envelope
    return NextResponse.json(
      {
        success: true,
        sessionId: session.id,
        ...response,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Chat consultation failed due to an unexpected error.", 500);
  }
}
