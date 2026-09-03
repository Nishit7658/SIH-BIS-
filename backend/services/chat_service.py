import time
import uuid
from typing import Dict, Any, List, Optional
from backend.database import load_store, update_store
from backend.services.rag_service import RagService, evaluate_prompt_guardrail

class ChatService:
    @staticmethod
    def list_sessions(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        store = load_store()
        sessions = store.get("chatSessions", [])
        if user_id:
            sessions = [s for s in sessions if s.get("userId") == user_id]
        return sessions[:20]

    @staticmethod
    def get_session(session_id: str) -> Optional[Dict[str, Any]]:
        store = load_store()
        for s in store.get("chatSessions", []):
            if s["id"] == session_id:
                return dict(s)
        return None

    @staticmethod
    def delete_session(session_id: str) -> bool:
        def _del(store):
            sessions = store.get("chatSessions", [])
            for i, s in enumerate(sessions):
                if s["id"] == session_id:
                    sessions.pop(i)
                    return True
            return False
        return bool(update_store(_del))

    @staticmethod
    async def process_chat(query: str, session_id: Optional[str] = None, user_id: Optional[str] = None) -> Dict[str, Any]:
        now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        # 1. Resolve or create session
        store = load_store()
        session = None
        if session_id:
            for s in store.get("chatSessions", []):
                if s["id"] == session_id:
                    session = s
                    break

        if not session:
            session_id = f"chat_{int(time.time())}_{uuid.uuid4().hex[:5]}"
            title = query[:37] + "..." if len(query) > 40 else query
            session = {
                "id": session_id,
                "userId": user_id,
                "title": title,
                "messages": [],
                "createdAt": now,
                "updatedAt": now
            }
            def _add_sess(s):
                s.setdefault("chatSessions", []).insert(0, session)
            update_store(_add_sess)

        # 2. Add user message
        user_msg = {
            "id": f"msg_{int(time.time())}_{uuid.uuid4().hex[:4]}",
            "role": "user",
            "content": query,
            "timestamp": now
        }
        def _append_u(s):
            for sess in s.get("chatSessions", []):
                if sess["id"] == session_id:
                    sess.setdefault("messages", []).append(user_msg)
                    sess["updatedAt"] = now
                    break
        update_store(_append_u)

        # 3. Guardrail check
        guard = evaluate_prompt_guardrail(query)
        if not guard["passed"]:
            rag_result = {
                "query": query,
                "answer": f"⚠️ **Security & Regulatory Guardrail Interception**: {guard['blockedReason']}",
                "citations": [],
                "confidence": 0.0,
                "isAbstained": True,
                "abstainReason": "ADVERSARIAL_INPUT_DETECTED",
                "cached": False,
                "costTier": "cached",
                "latencyMs": 12,
                "relevantStandards": [],
                "isAdversarial": True
            }
        else:
            rag_result = await RagService.execute_rag_query(guard["sanitizedInput"])

        # 4. Add assistant message
        asst_msg = {
            "id": f"msg_{int(time.time())}_{uuid.uuid4().hex[:4]}",
            "role": "assistant",
            "content": rag_result["answer"],
            "citations": rag_result.get("citations", []),
            "timestamp": now
        }
        def _append_a(s):
            for sess in s.get("chatSessions", []):
                if sess["id"] == session_id:
                    sess.setdefault("messages", []).append(asst_msg)
                    sess["updatedAt"] = now
                    break
        update_store(_append_a)

        return {
            "success": True,
            "sessionId": session_id,
            **rag_result
        }
