import { STANDARDS_DATABASE } from "@/lib/standards-data";
import { BIS_LABORATORIES_DATABASE } from "@/lib/laboratories-data";
import { BIS_SCHEMES_DATABASE } from "@/lib/schemes-data";
import { dbStore } from "../db/store";

export class HealthService {
  static getLiveness() {
    return {
      status: "healthy",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  static getReadiness() {
    const store = dbStore.get();
    const isStoreAccessible = Boolean(store && Array.isArray(store.users));
    const standardsCount = STANDARDS_DATABASE.length;
    const labsCount = BIS_LABORATORIES_DATABASE.length;
    const schemesCount = BIS_SCHEMES_DATABASE.length;
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

    const isReady = isStoreAccessible && standardsCount > 0;

    return {
      status: isReady ? "ready" : "degraded",
      checks: {
        databaseStore: isStoreAccessible ? "pass" : "fail",
        standardsRegistry: standardsCount >= 50 ? "pass" : "fail",
        laboratoriesDirectory: labsCount >= 10 ? "pass" : "fail",
        schemesMatrix: schemesCount >= 5 ? "pass" : "fail",
        llmProviderConfigured: hasGeminiKey ? "configured" : "fallback_mode",
      },
      telemetry: {
        totalStandards: standardsCount,
        totalLaboratories: labsCount,
        totalSchemes: schemesCount,
        totalUsers: store.users.length,
        totalDocuments: store.documents.length,
        totalChatSessions: store.chatSessions.length,
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
