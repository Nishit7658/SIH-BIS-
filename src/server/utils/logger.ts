export interface LogContext {
  requestId?: string;
  endpoint?: string;
  method?: string;
  userId?: string;
  durationMs?: number;
  status?: number;
  [key: string]: any;
}

export class Logger {
  private static formatLog(level: "INFO" | "WARN" | "ERROR", message: string, context?: LogContext): string {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context || {}),
    };
    return JSON.stringify(entry);
  }

  static info(message: string, context?: LogContext) {
    console.log(this.formatLog("INFO", message, context));
  }

  static warn(message: string, context?: LogContext) {
    console.warn(this.formatLog("WARN", message, context));
  }

  static error(message: string, error?: any, context?: LogContext) {
    const errorDetails = error instanceof Error 
      ? { errorMessage: error.message, errorStack: process.env.NODE_ENV !== "production" ? error.stack : undefined }
      : { rawError: error };

    console.error(this.formatLog("ERROR", message, { ...context, ...errorDetails }));
  }
}
