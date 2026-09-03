from pydantic import BaseModel, Field
from typing import List, Optional, Any

class ChatRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    sessionId: Optional[str] = None

class Citation(BaseModel):
    standardCode: str
    standardTitle: str
    clauseNumber: str
    clauseTitle: str
    snippet: str
    standardId: str
    officialBisUrl: str

class ChatMessage(BaseModel):
    id: str
    role: str
    content: str
    citations: Optional[List[Citation]] = None
    timestamp: str

class ChatResponse(BaseModel):
    success: bool = True
    sessionId: Optional[str] = None
    query: str
    answer: str
    citations: List[Citation]
    confidence: float
    isAbstained: bool = False
    abstainReason: Optional[str] = None
    cached: bool = False
    costTier: str = "fast_tier"
    latencyMs: int
    relevantStandards: List[Any] = []
    isAdversarial: Optional[bool] = False
