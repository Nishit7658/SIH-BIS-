import math
from typing import Dict, Any, List, Optional
from backend.database import STANDARDS_DB

class StandardsService:
    @staticmethod
    def list_standards(
        category: Optional[str] = None,
        division: Optional[str] = None,
        query: Optional[str] = None,
        mandatory_only: bool = False,
        page: int = 1,
        limit: int = 20
    ) -> Dict[str, Any]:
        results = list(STANDARDS_DB)

        if category and category != "All":
            cat = category.lower()
            results = [s for s in results if cat in s.get("category", "").lower()]

        if division:
            div = division.lower()
            results = [s for s in results if div in (s.get("division") or s.get("department", "")).lower()]

        if mandatory_only:
            results = [s for s in results if s.get("isMandatory") or s.get("mandatory")]

        if query and query.strip():
            q = query.lower().strip()
            results = [
                s for s in results
                if q in s.get("code", "").lower()
                or q in s.get("title", "").lower()
                or q in s.get("summary", "").lower()
                or any(q in b.lower() for b in s.get("businessTypes", []))
                or any(q in k.lower() for k in s.get("keywords", []))
            ]

        total = len(results)
        offset = (page - 1) * limit
        paginated = results[offset : offset + limit]

        items = []
        for s in paginated:
            items.append({
                "id": s["id"],
                "code": s["code"],
                "title": s["title"],
                "year": s["year"],
                "category": s["category"],
                "department": s.get("department", ""),
                "division": s.get("division") or s.get("department", ""),
                "status": s.get("status", "Active"),
                "isMandatory": s.get("isMandatory", False),
                "mandatory": s.get("mandatory", False),
                "scheme": s.get("scheme", "Scheme I (ISI Mark)"),
                "certificationScheme": s.get("certificationScheme", s.get("scheme", "")),
                "qcoReference": s.get("qcoReference") or s.get("qcoOrder"),
                "qcoOrder": s.get("qcoOrder") or s.get("qcoReference"),
                "clausesCount": len(s.get("clauses", [])),
                "hasBlueprint": bool(s.get("factoryBlueprint") or s.get("blueprint")),
                "summary": s.get("summary", ""),
                "officialBisPortalUrl": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"
            })

        return {
            "items": items,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "totalPages": math.ceil(total / limit) if limit > 0 else 1
            }
        }

    @staticmethod
    def get_standard_by_id(std_id: str) -> Optional[Dict[str, Any]]:
        clean_id = std_id.lower().strip()
        for s in STANDARDS_DB:
            if s["id"].lower() == clean_id or s["code"].lower().replace(" ", "-").replace(":", "-") == clean_id:
                return dict(s)
        return None

    @staticmethod
    def get_clauses(std_id: str, query: Optional[str] = None) -> Optional[Dict[str, Any]]:
        std = StandardsService.get_standard_by_id(std_id)
        if not std:
            return None

        clauses = std.get("clauses", [])
        if query and query.strip():
            q = query.lower().strip()
            clauses = [
                c for c in clauses
                if q in c.get("number", "").lower()
                or q in c.get("title", "").lower()
                or q in c.get("content", "").lower()
            ]

        return {
            "standardCode": std["code"],
            "clauses": clauses
        }

    @staticmethod
    def get_blueprint(std_id: str) -> Optional[Dict[str, Any]]:
        std = StandardsService.get_standard_by_id(std_id)
        if not std:
            return None
        return std.get("factoryBlueprint") or std.get("blueprint")
