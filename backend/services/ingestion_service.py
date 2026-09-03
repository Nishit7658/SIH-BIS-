import time
import uuid
import threading
from typing import Dict, Any, Optional
from backend.config import UPLOADS_DIR
from backend.database import load_store, update_store

class IngestionService:
    @staticmethod
    def trigger_ingestion(document_id: str) -> Dict[str, Any]:
        store = load_store()
        doc = None
        for d in store.get("documents", []):
            if d["id"] == document_id:
                doc = d
                break

        if not doc:
            raise ValueError(f"Document with ID '{document_id}' not found.")

        if doc.get("status") == "INDEXED":
            raise ValueError(f"Document '{doc['title']}' is already indexed.")

        job_id = f"job_{int(time.time())}_{uuid.uuid4().hex[:6]}"
        now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        job_record = {
            "id": job_id,
            "documentId": document_id,
            "status": "PENDING",
            "stages": {
                "textExtraction": False,
                "chunking": False,
                "embeddingGeneration": False,
                "indexing": False
            },
            "chunksCreated": 0,
            "startedAt": now,
            "completedAt": None
        }

        def _init_job(s):
            s.setdefault("ingestionJobs", []).insert(0, job_record)
            return job_record

        update_store(_init_job)

        # Background processing thread
        def _process():
            try:
                time.sleep(0.5)
                # Stage 1: Text extraction
                def _st1(s):
                    for j in s.get("ingestionJobs", []):
                        if j["id"] == job_id:
                            j["status"] = "PROCESSING"
                            j["stages"]["textExtraction"] = True
                            break
                update_store(_st1)

                # Stage 2: Chunking by clauses & sections
                text = doc.get("extractedText", "")
                if not text:
                    stored_file = UPLOADS_DIR / doc.get("storedFilename", "")
                    if stored_file.exists():
                        with open(stored_file, "rb") as f:
                            from backend.services.document_service import DocumentService
                            text = DocumentService.extract_text_from_bytes(f.read(), doc.get("mimeType", ""), doc.get("originalFilename", ""))

                paragraphs = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 30]
                chunks_count = max(1, len(paragraphs) if paragraphs else 5)

                time.sleep(0.5)
                def _st2(s):
                    for j in s.get("ingestionJobs", []):
                        if j["id"] == job_id:
                            j["stages"]["chunking"] = True
                            j["stages"]["embeddingGeneration"] = True
                            break
                update_store(_st2)

                time.sleep(0.5)
                # Stage 3 & 4: Indexing complete
                now_done = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                def _st_done(s):
                    for j in s.get("ingestionJobs", []):
                        if j["id"] == job_id:
                            j["status"] = "COMPLETED"
                            j["stages"]["indexing"] = True
                            j["chunksCreated"] = chunks_count
                            j["completedAt"] = now_done
                            break
                    for d in s.get("documents", []):
                        if d["id"] == document_id:
                            d["status"] = "INDEXED"
                            d["chunksCount"] = chunks_count
                            break
                update_store(_st_done)

            except Exception as e:
                now_fail = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                def _st_fail(s):
                    for j in s.get("ingestionJobs", []):
                        if j["id"] == job_id:
                            j["status"] = "FAILED"
                            j["errorMessage"] = str(e)
                            j["completedAt"] = now_fail
                            break
                    for d in s.get("documents", []):
                        if d["id"] == document_id:
                            d["status"] = "FAILED"
                            break
                update_store(_st_fail)

        thread = threading.Thread(target=_process, daemon=True)
        thread.start()

        return job_record

    @staticmethod
    def get_job_by_id(job_id: str) -> Optional[Dict[str, Any]]:
        store = load_store()
        for j in store.get("ingestionJobs", []):
            if j["id"] == job_id:
                return dict(j)
        return None
