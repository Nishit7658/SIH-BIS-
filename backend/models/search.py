from pydantic import BaseModel, Field
from typing import List, Optional

class SearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500)
    category: Optional[str] = None
    mandatoryOnly: bool = False
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=50)

class SearchHit(BaseModel):
    id: str
    code: str
    title: str
    year: int
    category: str
    division: str
    isMandatory: bool
    scheme: str
    summary: str
    relevanceScore: int
    matchedKeywords: List[str]

class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    totalPages: int
