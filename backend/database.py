import json
import os
import threading
from pathlib import Path
from typing import Dict, List, Any, Optional
from backend.config import STANDARDS_JSON_PATH, STORE_JSON_PATH

_lock = threading.Lock()

def _load_standards() -> List[Dict[str, Any]]:
    if STANDARDS_JSON_PATH.exists():
        with open(STANDARDS_JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

STANDARDS_DB: List[Dict[str, Any]] = _load_standards()

_DEFAULT_STORE: Dict[str, Any] = {
    "users": [],
    "documents": [],
    "ingestionJobs": [],
    "chatSessions": [],
    "auditTickets": [
        {
            "id": "BIS-ESC-1092",
            "query": "Can 10A plugs manufactured under IS 1293 Amendment 2 be exported to ASEAN without dual-pin retesting?",
            "userContext": "Manufacturer inquiry regarding mutual recognition agreements (MRA).",
            "priority": "HIGH",
            "status": "OPEN",
            "createdAt": "2026-08-29T14:30:00Z",
            "assignedOfficer": "Dr. R. Sharma (Electrotechnical Committee)"
        },
        {
            "id": "BIS-ESC-1088",
            "query": "Clarification on flame retardant test chamber dimensions under IS 694 Annexure D.",
            "userContext": "Cable testing laboratory seeking calibration tolerance threshold.",
            "priority": "MEDIUM",
            "status": "IN_REVIEW",
            "createdAt": "2026-08-28T09:15:00Z",
            "assignedOfficer": "Er. S. Meena (Chemical / Cable Division)"
        }
    ]
}

def load_store() -> Dict[str, Any]:
    with _lock:
        if STORE_JSON_PATH.exists():
            try:
                with open(STORE_JSON_PATH, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    # ensure all keys exist
                    for k, v in _DEFAULT_STORE.items():
                        if k not in data:
                            data[k] = v
                    return data
            except Exception:
                return dict(_DEFAULT_STORE)
        save_store(_DEFAULT_STORE)
        return dict(_DEFAULT_STORE)

def save_store(data: Dict[str, Any]) -> None:
    STORE_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    temp_path = f"{STORE_JSON_PATH}.tmp"
    with open(temp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    os.replace(temp_path, STORE_JSON_PATH)

def update_store(callback) -> Dict[str, Any]:
    with _lock:
        store = load_store()
        result = callback(store)
        save_store(store)
        return result or store
