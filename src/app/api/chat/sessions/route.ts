import { NextRequest } from "next/server";
import { ChatService } from "@/server/services/chat.service";
import { extractAuthToken } from "@/server/auth/middleware";
import { verifyJwt } from "@/server/auth/jwt";
import { apiSuccess } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  let userId: string | undefined = undefined;
  const token = extractAuthToken(req);
  if (token) {
    const payload = verifyJwt(token);
    if (payload) userId = payload.userId;
  }

  const sessions = ChatService.listSessions(userId);

  return apiSuccess(
    sessions.map((s) => ({
      id: s.id,
      title: s.title,
      messagesCount: s.messages.length,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }))
  );
}
