from fastapi import APIRouter
from backend.services.health_service import HealthService

router = APIRouter(prefix="/api/health", tags=["health"])

@router.get("")
def get_health():
    return {"success": True, "data": HealthService.get_readiness()}

@router.get("/live")
def get_live():
    return {"success": True, "data": HealthService.get_liveness()}

@router.get("/ready")
def get_ready():
    return {"success": True, "data": HealthService.get_readiness()}
