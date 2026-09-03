import { NextRequest } from "next/server";
import { validateSearchInput } from "@/server/validation/schemas";
import { SearchService } from "@/server/services/search.service";
import { apiSuccess, apiError } from "@/server/utils/response";
import { checkRateLimit } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = checkRateLimit(`search:${ip}`, 60, 60);

    if (!rateLimit.allowed) {
      return apiError("RATE_LIMITED", "Search rate limit exceeded. Please wait.", 429);
    }

    const body = await req.json();
    const validated = validateSearchInput(body);

    const { results, pagination } = SearchService.search({
      query: validated.query,
      category: validated.category,
      mandatoryOnly: validated.mandatoryOnly,
      page: validated.page,
      limit: validated.limit,
    });

    return apiSuccess(
      results,
      `Found ${pagination.total} matching standard(s).`,
      pagination
    );
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Search failed due to an unexpected error.", 500);
  }
}
