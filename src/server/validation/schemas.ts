import { BadRequestError } from "../utils/errors";

export function validateRegisterInput(body: any): {
  email: string;
  password: string;
  name: string;
  role?: "user" | "officer" | "admin";
  organization?: string;
  industrySector?: string;
} {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Request body must be a valid JSON object.");
  }

  const { email, password, name, role, organization, industrySector } = body;

  if (!email || typeof email !== "string") {
    throw new BadRequestError("Valid email is required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new BadRequestError("Invalid email format.");
  }

  if (!password || typeof password !== "string") {
    throw new BadRequestError("Password is required.");
  }

  if (password.length < 8 || password.length > 128) {
    throw new BadRequestError("Password must be between 8 and 128 characters.");
  }

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    throw new BadRequestError("Name is required (at least 2 characters).");
  }

  const validRoles = ["user", "officer", "admin"];
  const sanitizedRole = role && validRoles.includes(role) ? role : "user";

  return {
    email: email.trim().toLowerCase(),
    password,
    name: name.trim(),
    role: sanitizedRole,
    organization: typeof organization === "string" ? organization.trim() : undefined,
    industrySector: typeof industrySector === "string" ? industrySector.trim() : undefined,
  };
}

export function validateLoginInput(body: any): { email: string; password: string } {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Request body must be a valid JSON object.");
  }

  const { email, password } = body;

  if (!email || typeof email !== "string" || !password || typeof password !== "string") {
    throw new BadRequestError("Both email and password are required.");
  }

  return {
    email: email.trim().toLowerCase(),
    password,
  };
}

export function validateSearchInput(body: any): {
  query: string;
  category?: string;
  mandatoryOnly?: boolean;
  page: number;
  limit: number;
} {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Request body must be a valid JSON object.");
  }

  const { query, category, mandatoryOnly, page = 1, limit = 20 } = body;

  if (!query || typeof query !== "string") {
    throw new BadRequestError("Search query string is required.");
  }

  const sanitizedQuery = query.trim();
  if (sanitizedQuery.length > 500) {
    throw new BadRequestError("Search query cannot exceed 500 characters.");
  }

  const parsedPage = Math.max(1, parseInt(String(page), 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(String(limit), 10) || 20));

  return {
    query: sanitizedQuery,
    category: typeof category === "string" && category !== "All" ? category.trim() : undefined,
    mandatoryOnly: Boolean(mandatoryOnly),
    page: parsedPage,
    limit: parsedLimit,
  };
}

export function validateChatInput(body: any): {
  query: string;
  sessionId?: string;
} {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Request body must be a valid JSON object.");
  }

  const { query, sessionId } = body;

  if (!query || typeof query !== "string") {
    throw new BadRequestError("A valid query string is required.");
  }

  const sanitizedQuery = query.trim();
  if (sanitizedQuery.length === 0) {
    throw new BadRequestError("Query cannot be empty.");
  }

  if (sanitizedQuery.length > 2000) {
    throw new BadRequestError("Query length cannot exceed 2000 characters.");
  }

  return {
    query: sanitizedQuery,
    sessionId: typeof sessionId === "string" ? sessionId.trim() : undefined,
  };
}

export function validatePagination(pageParam?: string | null, limitParam?: string | null): {
  page: number;
  limit: number;
  offset: number;
} {
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(limitParam || "20", 10) || 20));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
