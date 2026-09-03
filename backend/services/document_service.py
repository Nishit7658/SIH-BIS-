import os
import re
import time
import uuid
import math
from pathlib import Path
from typing import Dict, Any, List, Optional
from backend.config import UPLOADS_DIR
from backend.database import load_store, update_store

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/json",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

class DocumentService:
    @staticmethod
    def extract_text_from_bytes(file_bytes: bytes, mime_type: str, filename: str) -> str:
        extracted = ""
        # 1. PDF Extraction using PyMuPDF (fitz)
        if ("pdf" in mime_type.lower() or filename.lower().endswith(".pdf")) and file_bytes.startswith(b"%PDF"):
            try:
                import fitz  # PyMuPDF
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                pages_text = []
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    text = page.get_text("text")
                    if text.strip():
                        pages_text.append(f"--- Page {page_num + 1} ---\n{text.strip()}")
                extracted = "\n\n".join(pages_text)
            except Exception as e:
                # Fallback to PyPDF if fitz fails
                try:
                    import pypdf
                    import io
                    reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                    extracted = "\n\n".join(p.extract_text() or "" for p in reader.pages)
                except Exception:
                    extracted = ""

        # 2. Text or JSON
        elif "text" in mime_type.lower() or "json" in mime_type.lower() or filename.endswith((".txt", ".json", ".md")):
            try:
                extracted = file_bytes.decode("utf-8", errors="replace")
            except Exception:
                extracted = ""

        # Clean text
        return re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", extracted).strip()

    @staticmethod
    def list_documents(page: int = 1, limit: int = 20) -> Dict[str, Any]:
        store = load_store()
        docs = store.get("documents", [])
        total = len(docs)
        offset = (page - 1) * limit
        paginated = docs[offset : offset + limit]

        return {
            "documents": paginated,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "totalPages": math.ceil(total / limit) if limit > 0 else 1
            }
        }

    @staticmethod
    def get_document_by_id(doc_id: str) -> Optional[Dict[str, Any]]:
        store = load_store()
        for d in store.get("documents", []):
            if d["id"] == doc_id:
                return dict(d)
        return None

    @staticmethod
    def upload_document(
        title: str,
        filename: str,
        mime_type: str,
        file_bytes: bytes,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise ValueError(f"File exceeds maximum allowed size of 15 MB ({len(file_bytes) / 1024 / 1024:.2f} MB)")

        if mime_type.lower() not in ALLOWED_MIME_TYPES and not filename.endswith((".pdf", ".txt", ".json", ".md")):
            raise ValueError(f"Unsupported file MIME type '{mime_type}'. Allowed types: PDF, TXT, JSON, Markdown.")

        safe_filename = re.sub(r"[^a-zA-Z0-9._-]", "_", Path(filename).name)
        stored_filename = f"doc_{int(time.time())}_{safe_filename}"
        file_path = UPLOADS_DIR / stored_filename

        try:
            with open(file_path, "wb") as f:
                f.write(file_bytes)
        except Exception:
            pass

        # Extract text via PyMuPDF
        extracted_text = DocumentService.extract_text_from_bytes(file_bytes, mime_type, filename)
        doc_id = f"doc_{int(time.time())}_{uuid.uuid4().hex[:6]}"
        now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        new_doc = {
            "id": doc_id,
            "title": title.strip() or filename,
            "originalFilename": filename,
            "storedFilename": stored_filename,
            "fileSize": len(file_bytes),
            "mimeType": mime_type,
            "extractedText": extracted_text[:10000] if extracted_text else "",
            "status": "UPLOADED",
            "chunksCount": 0,
            "metadata": metadata or {},
            "createdAt": now
        }

        def _save(store):
            store.setdefault("documents", []).insert(0, new_doc)
            return new_doc

        return update_store(_save)

    @staticmethod
    def delete_document(doc_id: str) -> bool:
        doc = DocumentService.get_document_by_id(doc_id)
        if not doc:
            return False

        def _del(store):
            docs = store.get("documents", [])
            for i, d in enumerate(docs):
                if d["id"] == doc_id:
                    docs.pop(i)
                    return True
            return False

        deleted = update_store(_del)
        if deleted and doc.get("storedFilename"):
            file_path = UPLOADS_DIR / doc["storedFilename"]
            if file_path.exists():
                try:
                    file_path.unlink()
                except Exception:
                    pass
        return bool(deleted)
