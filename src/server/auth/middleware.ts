import { NextRequest } from "next/server";
import { verifyJwt, TokenPayload } from "./jwt";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

export function extractAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  const cookieToken = req.cookies.get("bis_auth_token")?.value;
  if (cookieToken) {
    return cookieToken.trim();
  }

  return null;
}

export function authenticateUser(req: NextRequest): TokenPayload {
  const token = extractAuthToken(req);
  if (!token) {
    throw new UnauthorizedError("Authentication token is missing. Please log in.");
  }

  const payload = verifyJwt(token);
  if (!payload) {
    throw new UnauthorizedError("Invalid or expired authentication session.");
  }

  return payload;
}

export function requireAdmin(req: NextRequest): TokenPayload {
  const user = authenticateUser(req);
  if (user.role !== "admin" && user.role !== "officer") {
    throw new ForbiddenError("Administrative authority required for this operation.");
  }
  return user;
}
