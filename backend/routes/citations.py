from fastapi import APIRouter, HTTPException
from backend.services.citations_service import CitationsService

router = APIRouter(prefix="/api/citations", tags=["citations"])

@router.get("/{citation_id}")
def get_citation(citation_id: str):
    res = CitationsService.get_citation_by_id(citation_id)
    if not res:
        raise HTTPException(status_code=404, detail=f"Citation with ID '{citation_id}' not found.")
    return {"success": True, "data": res}
