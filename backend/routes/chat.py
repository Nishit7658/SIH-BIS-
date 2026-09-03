from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from backend.models.chat import ChatRequest
from backend.services.chat_service import ChatService
from backend.services.auth_service import verify_jwt

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("")
async def execute_chat(body: ChatRequest, authorization: Optional[str] = Header(None)):
    user_id = None
    if authorization and authorization.startswith("Bearer "):
        payload = verify_jwt(authorization.split(" ")[1])
        if payload:
            user_id = payload.get("userId")

    response = await ChatService.process_chat(
        query=body.query,
        session_id=body.sessionId,
        user_id=user_id
    )
    return response

@router.get("/sessions")
def list_chat_sessions(authorization: Optional[str] = Header(None)):
    user_id = None
    if authorization and authorization.startswith("Bearer "):
        payload = verify_jwt(authorization.split(" ")[1])
        if payload:
            user_id = payload.get("userId")

    sessions = ChatService.list_sessions(user_id)
    return {
        "success": True,
        "data": [
            {
                "id": s["id"],
                "title": s["title"],
                "messagesCount": len(s.get("messages", [])),
                "createdAt": s["createdAt"],
                "updatedAt": s["updatedAt"]
            }
            for s in sessions
        ]
    }

@router.get("/sessions/{session_id}")
def get_chat_session(session_id: str):
    sess = ChatService.get_session(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    return {"success": True, "data": sess}

@router.delete("/sessions/{session_id}")
def delete_chat_session(session_id: str):
    deleted = ChatService.delete_session(session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    return {"success": True, "message": "Session deleted."}
