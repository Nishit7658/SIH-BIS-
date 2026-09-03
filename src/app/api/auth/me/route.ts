import { NextRequest } from "next/server";
import { authenticateUser } from "@/server/auth/middleware";
import { UsersRepository } from "@/server/db/users.repo";
import { apiSuccess, apiError } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateUser(req);
    const user = UsersRepository.findById(auth.userId);

    if (!user) {
      return apiError("USER_NOT_FOUND", "User profile could not be found.", 404);
    }

    return apiSuccess({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: user.organization,
      industrySector: user.industrySector,
      preferences: user.preferences,
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to retrieve user profile.", 500);
  }
}
