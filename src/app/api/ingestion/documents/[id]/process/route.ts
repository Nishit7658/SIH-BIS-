import { NextRequest } from "next/server";
import { IngestionService } from "@/server/services/ingestion.service";
import { apiSuccess, apiError } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const job = IngestionService.triggerIngestion(id);

    return apiSuccess(
      job,
      "Document ingestion pipeline scheduled.",
      undefined,
      202
    );
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to schedule document ingestion.", 500);
  }
}
