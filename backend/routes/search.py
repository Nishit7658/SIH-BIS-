from fastapi import APIRouter
from backend.models.search import SearchRequest
from backend.services.search_service import SearchService

router = APIRouter(prefix="/api/search", tags=["search"])

@router.post("")
def search_standards(body: SearchRequest):
    result = SearchService.search(
        query=body.query,
        category=body.category,
        mandatory_only=body.mandatoryOnly,
        page=body.page,
        limit=body.limit
    )

    return {
        "success": True,
        "message": f"Found {result['pagination']['total']} matching standard(s).",
        "data": result["results"],
        "pagination": result["pagination"]
    }
