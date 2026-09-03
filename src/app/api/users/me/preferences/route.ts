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
      return apiError("USER_NOT_FOUND", "User not found.", 404);
    }

    return apiSuccess(user.preferences);
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to retrieve preferences.", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = authenticateUser(req);
    const body = await req.json();

    const user = UsersRepository.findById(auth.userId);
    if (!user) {
      return apiError("USER_NOT_FOUND", "User not found.", 404);
    }

    const currentPrefs = user.preferences;
    const newPrefs = { ...currentPrefs };

    if (typeof body.dataRetentionDays === "number") {
      newPrefs.dataRetentionDays = Math.max(0, Math.min(365, body.dataRetentionDays));
    }

    if (typeof body.language === "string") {
      const allowedLangs = ["en", "hi", "mr", "ta"];
      if (allowedLangs.includes(body.language.toLowerCase())) {
        newPrefs.language = body.language.toLowerCase();
      }
    }

    if (typeof body.lowLiteracyMode === "boolean") {
      newPrefs.lowLiteracyMode = body.lowLiteracyMode;
    }

    const updatedUser = UsersRepository.update(auth.userId, { preferences: newPrefs });

    return apiSuccess(
      updatedUser?.preferences,
      "Preferences updated successfully (DPDP 2023 compliant)."
    );
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to update preferences.", 500);
  }
}
