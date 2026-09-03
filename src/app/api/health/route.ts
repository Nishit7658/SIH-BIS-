import { NextRequest } from "next/server";
import { HealthService } from "@/server/services/health.service";
import { apiSuccess } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const readiness = HealthService.getReadiness();
  return apiSuccess(readiness);
}
