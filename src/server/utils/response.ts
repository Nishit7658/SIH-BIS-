import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    latencyMs?: number;
    timestamp?: string;
  };
}

export function apiSuccess<T>(
  data: T,
  message?: string,
  meta?: ApiResponse["meta"],
  status: number = 200,
  headers?: Record<string, string>
): NextResponse<ApiResponse<T>> {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
    ...(meta ? { meta: { ...meta, timestamp: new Date().toISOString() } } : { meta: { timestamp: new Date().toISOString() } }),
  };

  return NextResponse.json(payload, {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });
}

export function apiError(
  code: string,
  message: string,
  status: number = 400,
  details?: any,
  headers?: Record<string, string>
): NextResponse<ApiResponse> {
  const payload: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(payload, {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });
}
