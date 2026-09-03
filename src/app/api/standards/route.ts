import { NextRequest, NextResponse } from "next/server";
import { StandardsService } from "@/server/services/standards.service";
import { validatePagination } from "@/server/validation/schemas";
import { apiSuccess, apiError } from "@/server/utils/response";

export const dynamic = "force-dynamic";

// Endpoint: GET /api/standards
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const query = searchParams.get("q") || searchParams.get("query") || searchParams.get("search") || undefined;
    const division = searchParams.get("division") || undefined;
    const mandatory = searchParams.get("mandatory") === "true" || searchParams.get("mandatory") === "1";

    const { page, limit } = validatePagination(
      searchParams.get("page"),
      searchParams.get("limit")
    );

    const data = StandardsService.listStandards({
      category,
      query,
      division,
      mandatoryOnly: mandatory,
      page,
      limit,
    });

    // Backward-compatible envelope: includes results and count, plus data and pagination
    return NextResponse.json({
      success: true,
      count: data.pagination.total,
      results: data.items,
      data: data.items,
      pagination: data.pagination,
    }, { status: 200 });
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to retrieve standards catalog.", 500);
  }
}
