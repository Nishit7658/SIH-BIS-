import base64
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query, Request
from typing import Optional
from backend.models.documents import DocumentUploadRequest
from backend.services.document_service import DocumentService

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.get("")
def list_documents(page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=50)):
    res = DocumentService.list_documents(page=page, limit=limit)
    return {
        "success": True,
        "data": res["documents"],
        "pagination": res["pagination"]
    }

@router.post("", status_code=201)
async def upload_document(
    request: Request,
    file: Optional[UploadFile] = File(None),
    title: Optional[str] = Form(None)
):
    content_type = request.headers.get("content-type", "")

    # 1. Multipart form file upload
    if "multipart/form-data" in content_type and file:
        file_bytes = await file.read()
        try:
            doc = DocumentService.upload_document(
                title=title or file.filename,
                filename=file.filename,
                mime_type=file.content_type or "application/pdf",
                file_bytes=file_bytes,
                metadata={"uploadedVia": "multipart"}
            )
            return {"success": True, "message": "Document uploaded successfully.", "data": doc}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    # 2. JSON upload
    try:
        body = await request.json()
        doc_req = DocumentUploadRequest(**body)
        if doc_req.contentBase64:
            file_bytes = base64.b64decode(doc_req.contentBase64)
        elif doc_req.textContent:
            file_bytes = doc_req.textContent.encode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Either contentBase64 or textContent must be provided.")

        target_mime = doc_req.mimeType or ("text/plain" if doc_req.textContent else "application/pdf")
        doc = DocumentService.upload_document(
            title=doc_req.title or doc_req.filename,
            filename=doc_req.filename,
            mime_type=target_mime,
            file_bytes=file_bytes,
            metadata={"uploadedVia": "json"}
        )
        return {"success": True, "message": "Document uploaded successfully.", "data": doc}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{doc_id}")
def get_document(doc_id: str):
    doc = DocumentService.get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")
    return {"success": True, "data": doc}

@router.delete("/{doc_id}")
def delete_document(doc_id: str):
    deleted = DocumentService.delete_document(doc_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")
    return {"success": True, "message": "Document deleted successfully."}

@router.get("/{doc_id}/status")
def get_document_status(doc_id: str):
    doc = DocumentService.get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")
    return {
        "success": True,
        "data": {
            "documentId": doc["id"],
            "title": doc["title"],
            "status": doc["status"],
            "chunksCount": doc.get("chunksCount", 0),
            "fileSize": doc["fileSize"],
            "mimeType": doc["mimeType"],
            "createdAt": doc["createdAt"]
        }
    }
