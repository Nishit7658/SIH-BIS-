import { NextRequest } from "next/server";
import { validateRegisterInput } from "@/server/validation/schemas";
import { UsersRepository } from "@/server/db/users.repo";
import { hashPassword } from "@/server/auth/crypto";
import { signJwt } from "@/server/auth/jwt";
import { apiSuccess, apiError } from "@/server/utils/response";
import { checkRateLimit } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = checkRateLimit(`auth:${ip}`, 10, 60);

    if (!rateLimit.allowed) {
      return apiError("RATE_LIMITED", "Too many registration attempts. Please wait.", 429);
    }

    const body = await req.json();
    const validated = validateRegisterInput(body);

    const existing = UsersRepository.findByEmail(validated.email);
    if (existing) {
      return apiError("USER_EXISTS", "A user account with this email address already exists.", 409);
    }

    const passwordHash = hashPassword(validated.password);
    const user = UsersRepository.create({
      email: validated.email,
      passwordHash,
      name: validated.name,
      role: validated.role || "user",
      organization: validated.organization,
      industrySector: validated.industrySector,
      preferences: {
        dataRetentionDays: 30,
        language: "en",
        lowLiteracyMode: false,
      },
    });

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
        },
        token,
      },
      "User registered successfully.",
      undefined,
      201,
      { "Set-Cookie": cookieHeader }
    );
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Registration failed due to an unexpected error.", 500);
  }
}
