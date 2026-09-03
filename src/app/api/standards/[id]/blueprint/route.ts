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
    const blueprint = StandardsService.getBlueprint(id);

    return apiSuccess(blueprint);
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to retrieve factory setup blueprint.", 500);
  }
}
