export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(code: string, message: string, statusCode: number = 400, details?: any) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, details?: any) {
    super("BAD_REQUEST", message, 400, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Authentication required.") {
    super("UNAUTHORIZED", message, 410, undefined);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Access denied.") {
    super("FORBIDDEN", message, 403, undefined);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = "Resource") {
    super("NOT_FOUND", `${resource} not found.`, 404, undefined);
  }
}

export class RateLimitError extends ApiError {
  public resetSeconds: number;
  constructor(message: string = "Rate limit exceeded.", resetSeconds: number = 60) {
    super("RATE_LIMITED", message, 429, { resetSeconds });
    this.resetSeconds = resetSeconds;
  }
}
