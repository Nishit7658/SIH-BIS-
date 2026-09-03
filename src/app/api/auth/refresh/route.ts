import { NextRequest } from "next/server";
import { authenticateUser } from "@/server/auth/middleware";
import { UsersRepository } from "@/server/db/users.repo";
import { signJwt } from "@/server/auth/jwt";
import { apiSuccess, apiError } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const auth = authenticateUser(req);
    const user = UsersRepository.findById(auth.userId);

    if (!user) {
      return apiError("USER_NOT_FOUND", "User session is no longer active.", 404);
    }

    const token = signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
      organization: user.organization,
    });

    const cookieHeader = `bis_auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`;

    return apiSuccess(
      { token },
      "Session refreshed.",
      undefined,
      200,
      { "Set-Cookie": cookieHeader }
    );
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Token refresh failed.", 500);
  }
}
