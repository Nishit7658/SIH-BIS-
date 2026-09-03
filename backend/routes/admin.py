from fastapi import APIRouter
from backend.models.admin import OpsTicketCreate
from backend.services.admin_service import AdminService

router = APIRouter(prefix="/api", tags=["admin"])

@router.get("/admin/metrics")
def get_metrics():
    return {"success": True, "data": AdminService.get_metrics()}

@router.get("/admin/evaluations")
def get_evaluations():
    return {"success": True, "data": AdminService.get_evaluations()}

@router.get("/admin/ops")
@router.get("/ops")
def get_ops_tickets():
    tickets = AdminService.get_ops_tickets()
    return {
        "success": True,
        "activeTickets": tickets,
        "totalCount": len(tickets)
    }

@router.post("/admin/ops")
@router.post("/ops")
def create_ops_ticket(body: OpsTicketCreate):
    ticket = AdminService.create_ops_ticket(
        query=body.query,
        user_context=body.userContext or "Self-escalated from digital expert",
        priority=body.priority or "HIGH"
    )
    return {
        "success": True,
        "ticket": ticket,
        "message": "Escalation ticket dispatched to BIS Sectional Committee."
    }
