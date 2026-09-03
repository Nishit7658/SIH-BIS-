import { NextRequest } from "next/server";
import { StandardsService } from "@/server/services/standards.service";
import { apiSuccess, apiError } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const clauseQuery = searchParams.get("q") || undefined;

    const result = StandardsService.getClauses(id, clauseQuery);

    return apiSuccess(result);
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to retrieve clauses.", 500);
  }
}
