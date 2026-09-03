import { NextRequest } from "next/server";
import { AdminService } from "@/server/services/admin.service";
import { apiSuccess } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const metrics = AdminService.getMetrics();
  return apiSuccess(metrics);
}
