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
      return apiError("USER_NOT_FOUND", "User profile not found.", 404);
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

export async function PATCH(req: NextRequest) {
  try {
    const auth = authenticateUser(req);
    const body = await req.json();

    const updates: Record<string, any> = {};
    if (typeof body.name === "string" && body.name.trim().length >= 2) {
      updates.name = body.name.trim();
    }
    if (typeof body.organization === "string") {
      updates.organization = body.organization.trim();
    }
    if (typeof body.industrySector === "string") {
      updates.industrySector = body.industrySector.trim();
    }

    const updatedUser = UsersRepository.update(auth.userId, updates);
    if (!updatedUser) {
      return apiError("USER_NOT_FOUND", "User profile not found.", 404);
    }

    return apiSuccess({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      organization: updatedUser.organization,
      industrySector: updatedUser.industrySector,
      preferences: updatedUser.preferences,
      updatedAt: updatedUser.updatedAt,
    }, "Profile updated successfully.");
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to update profile.", 500);
  }
}
