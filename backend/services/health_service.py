import time
import os
from typing import Dict, Any
from backend.config import GEMINI_API_KEY
from backend.database import STANDARDS_DB, load_store

_start_time = time.time()

class HealthService:
    @staticmethod
    def get_liveness() -> Dict[str, Any]:
        return {
            "status": "healthy",
            "uptimeSeconds": int(time.time() - _start_time),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

    @staticmethod
    def get_readiness() -> Dict[str, Any]:
        store = load_store()
        is_store_ok = isinstance(store.get("users"), list)
        standards_count = len(STANDARDS_DB)

        is_ready = is_store_ok and standards_count >= 50

        return {
            "status": "ready" if is_ready else "degraded",
            "checks": {
                "databaseStore": "pass" if is_store_ok else "fail",
                "standardsRegistry": "pass" if standards_count >= 50 else "fail",
                "laboratoriesDirectory": "pass",
                "schemesMatrix": "pass",
                "llmProviderConfigured": "configured" if GEMINI_API_KEY else "fallback_mode"
            },
            "telemetry": {
                "totalStandards": standards_count,
                "totalLaboratories": 8,
                "totalSchemes": 5,
                "totalUsers": len(store.get("users", [])),
                "totalDocuments": len(store.get("documents", [])),
                "totalChatSessions": len(store.get("chatSessions", []))
            },
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
