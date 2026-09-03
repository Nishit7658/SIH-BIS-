import { NextRequest } from "next/server";
import { ChatService } from "@/server/services/chat.service";
import { apiSuccess, apiError } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = ChatService.getSession(id);
    return apiSuccess(session);
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to retrieve chat session.", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = ChatService.deleteSession(id);
    return apiSuccess({ deleted }, "Chat session deleted.");
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to delete chat session.", 500);
  }
}
