import { NextRequest } from "next/server";
import { apiSuccess } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cookieHeader = "bis_auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
  return apiSuccess(
    { loggedOut: true },
    "Session successfully invalidated.",
    undefined,
    200,
    { "Set-Cookie": cookieHeader }
  );
}
