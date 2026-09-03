import math
from typing import Dict, Any, List, Optional
from backend.database import STANDARDS_DB

class SearchService:
    @staticmethod
    def search(
        query: str,
        category: Optional[str] = None,
        mandatory_only: bool = False,
        page: int = 1,
        limit: int = 20
    ) -> Dict[str, Any]:
        clean_query = query.lower().strip()
        tokens = [t for t in clean_query.split() if len(t) > 1]

        scored_items = []

        for std in STANDARDS_DB:
            if category and category != "All":
                if category.lower() not in std.get("category", "").lower():
                    continue

            if mandatory_only and not (std.get("isMandatory") or std.get("mandatory")):
                continue

            score = 0
            matched = []

            code_lower = std.get("code", "").lower()
            title_lower = std.get("title", "").lower()
            summary_lower = std.get("summary", "").lower()

            # 1. Exact code match
            if code_lower == clean_query or clean_query in code_lower:
                score += 100
                matched.append("code_exact")

            # 2. Phrase in title
            if clean_query in title_lower:
                score += 50
                matched.append("title_phrase")

            # 3. Token matching
            for token in tokens:
                if token in code_lower:
                    score += 25
                    matched.append(f"code:{token}")
                if token in title_lower:
                    score += 15
                    matched.append(f"title:{token}")
                if token in summary_lower:
                    score += 8
                    matched.append(f"summary:{token}")
                if any(token in k.lower() for k in std.get("keywords", [])):
                    score += 10
                    matched.append(f"keyword:{token}")
                if any(token in b.lower() for b in std.get("businessTypes", [])):
                    score += 12
                    matched.append(f"business:{token}")

            # 4. Clause level match
            for clause in std.get("clauses", []):
                if clean_query in clause.get("content", "").lower():
                    score += 20
                    matched.append(f"clause:{clause.get('number')}")
                    break

            # 5. Mandatory boost
            if std.get("isMandatory") or std.get("mandatory"):
                score += 5

            if score > 0:
                scored_items.append((score, list(set(matched)), std))

        # Sort descending by score
        scored_items.sort(key=lambda x: x[0], reverse=True)

        total = len(scored_items)
        offset = (page - 1) * limit
        paginated = scored_items[offset : offset + limit]

        results = []
        for score, matched_kw, std in paginated:
            results.append({
                "id": std["id"],
                "code": std["code"],
                "title": std["title"],
                "year": std["year"],
                "category": std["category"],
                "division": std.get("division") or std.get("department", ""),
                "isMandatory": std.get("isMandatory", False),
                "scheme": std.get("scheme", "Scheme I (ISI Mark)"),
                "summary": std.get("summary", ""),
                "relevanceScore": int(score),
                "matchedKeywords": matched_kw
            })

        return {
            "results": results,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "totalPages": math.ceil(total / limit) if limit > 0 else 1
            }
        }
