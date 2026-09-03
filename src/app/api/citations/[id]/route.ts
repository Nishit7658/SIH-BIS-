import { NextRequest } from "next/server";
import { CitationsService } from "@/server/services/citations.service";
import { apiSuccess, apiError } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const citation = CitationsService.getCitationById(id);

    return apiSuccess(citation);
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to retrieve citation detail.", 500);
  }
}
