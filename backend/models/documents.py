from pydantic import BaseModel
from typing import Optional, Dict, Any

class DocumentRecord(BaseModel):
    id: str
    title: str
    originalFilename: str
    storedFilename: str
    fileSize: int
    mimeType: str
    extractedText: Optional[str] = None
    status: str
    chunksCount: int = 0
    metadata: Dict[str, Any] = {}
    createdAt: str

class IngestionStages(BaseModel):
    textExtraction: bool
    chunking: bool
    embeddingGeneration: bool
    indexing: bool

class IngestionJob(BaseModel):
    id: str
    documentId: str
    status: str
    stages: IngestionStages
    chunksCreated: int = 0
    errorMessage: Optional[str] = None
    startedAt: str
    completedAt: Optional[str] = None

class DocumentUploadRequest(BaseModel):
    title: Optional[str] = None
    filename: str
    mimeType: Optional[str] = None
    contentBase64: Optional[str] = None
    textContent: Optional[str] = None
