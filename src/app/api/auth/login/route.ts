import { NextRequest } from "next/server";
import { validateLoginInput } from "@/server/validation/schemas";
import { UsersRepository } from "@/server/db/users.repo";
import { verifyPassword } from "@/server/auth/crypto";
import { signJwt } from "@/server/auth/jwt";
import { apiSuccess, apiError } from "@/server/utils/response";
import { checkRateLimit } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = checkRateLimit(`login:${ip}`, 10, 60);

    if (!rateLimit.allowed) {
      return apiError("RATE_LIMITED", "Too many login attempts. Please wait.", 429);
    }

    const body = await req.json();
    const { email, password } = validateLoginInput(body);

    const user = UsersRepository.findByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return apiError("INVALID_CREDENTIALS", "Invalid email address or password.", 401);
    }

    const token = signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
      organization: user.organization,
    });

    const cookieHeader = `bis_auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`;

    return apiSuccess(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organization: user.organization,
          industrySector: user.industrySector,
          preferences: user.preferences,
        },
        token,
      },
      "Authentication successful.",
      undefined,
      200,
      { "Set-Cookie": cookieHeader }
    );
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Login failed due to an unexpected error.", 500);
  }
}
