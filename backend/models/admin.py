from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class OpsTicket(BaseModel):
    id: str
    query: str
    userContext: str
    priority: str
    status: str
    assignedOfficer: str
    createdAt: str

class OpsTicketCreate(BaseModel):
    query: str
    userContext: Optional[str] = "Self-escalated from digital expert"
    priority: Optional[str] = "HIGH"

class SecurityDefenseSummary(BaseModel):
    totalAttacks: int
    defended: int
    status: str

class EvalResponse(BaseModel):
    suite: str
    overallScore: float
    testsPassed: int
    totalTests: int
    abstainPrecision: str
    citationPrecision: str
    securityDefenses: SecurityDefenseSummary
    lastEvaluated: str

class MetricsResponse(BaseModel):
    totalQueriesProcessed: int
    groundingResolutionRate: float
    officialCitationClickThrough: float
    cacheHitEfficiency: float
    totalUsers: int
    totalUploadedDocs: int
    activeTicketsCount: int
    impact: Dict[str, str]
