from fastapi import APIRouter, HTTPException
from backend.services.ingestion_service import IngestionService

router = APIRouter(prefix="/api/ingestion", tags=["ingestion"])

@router.post("/documents/{doc_id}/process", status_code=202)
def process_document(doc_id: str):
    try:
        job = IngestionService.trigger_ingestion(doc_id)
        return {
            "success": True,
            "message": "Document ingestion pipeline scheduled.",
            "data": job
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/jobs/{job_id}")
def get_job_status(job_id: str):
    job = IngestionService.get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Ingestion job '{job_id}' not found.")
    return {"success": True, "data": job}
