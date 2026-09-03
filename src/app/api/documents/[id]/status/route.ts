import { NextRequest } from "next/server";
import { DocumentsService } from "@/server/services/documents.service";
import { apiSuccess, apiError } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const doc = DocumentsService.getDocumentById(id);

    return apiSuccess({
      documentId: doc.id,
      title: doc.title,
      status: doc.status,
      chunksCount: doc.chunksCount,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      createdAt: doc.createdAt,
    });
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to retrieve document status.", 500);
  }
}
