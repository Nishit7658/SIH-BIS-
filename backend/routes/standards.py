from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from backend.services.standards_service import StandardsService

router = APIRouter(prefix="/api/standards", tags=["standards"])

@router.get("")
def list_standards(
    category: Optional[str] = None,
    division: Optional[str] = None,
    q: Optional[str] = Query(None, alias="query"),
    mandatory: Optional[bool] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50)
):
    result = StandardsService.list_standards(
        category=category,
        division=division,
        query=q,
        mandatory_only=bool(mandatory),
        page=page,
        limit=limit
    )

    # Compatible envelope with both count/results and data/pagination
    return {
        "success": True,
        "count": result["pagination"]["total"],
        "results": result["items"],
        "data": result["items"],
        "pagination": result["pagination"]
    }

@router.get("/{std_id}")
def get_standard(std_id: str):
    std = StandardsService.get_standard_by_id(std_id)
    if not std:
        raise HTTPException(status_code=404, detail=f"Indian Standard '{std_id}' not found.")
    return {
        "success": True,
        **std,
        "officialBisPortalUrl": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"
    }

@router.get("/{std_id}/clauses")
def get_standard_clauses(std_id: str, q: Optional[str] = None):
    res = StandardsService.get_clauses(std_id, q)
    if not res:
        raise HTTPException(status_code=404, detail=f"Indian Standard '{std_id}' not found.")
    return {"success": True, "data": res}

@router.get("/{std_id}/blueprint")
def get_standard_blueprint(std_id: str):
    bp = StandardsService.get_blueprint(std_id)
    if not bp:
        raise HTTPException(status_code=404, detail=f"Factory Setup Blueprint for '{std_id}' not found.")
    return {"success": True, "data": bp}
