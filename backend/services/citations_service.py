import re
from typing import Dict, Any, Optional
from backend.database import STANDARDS_DB

OFFICIAL_BIS_PORTAL_BASE = "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"

class CitationsService:
    @staticmethod
    def get_citation_by_id(citation_id: str) -> Optional[Dict[str, Any]]:
        clean_id = citation_id.lower().strip()

        for std in STANDARDS_DB:
            for clause in std.get("clauses", []):
                cl_slug = re.sub(r"[^a-z0-9]", "", clause.get("number", "").lower())
                generated_id = f"{std['id']}-{cl_slug}"

                if generated_id == clean_id or clause.get("id", "").lower() == clean_id:
                    return {
                        "citationId": generated_id,
                        "standardId": std["id"],
                        "standardCode": std["code"],
                        "standardTitle": std["title"],
                        "clauseNumber": clause["number"],
                        "clauseTitle": clause["title"],
                        "textSnippet": clause["content"],
                        "testRequirement": clause.get("testRequirement") or clause.get("testMethod"),
                        "division": std.get("division") or std.get("department", ""),
                        "officialBisPortalUrl": OFFICIAL_BIS_PORTAL_BASE
                    }

        return None
