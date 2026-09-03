from fastapi import APIRouter, HTTPException, Depends
from backend.routes.auth import get_current_user_payload
from backend.models.auth import UserUpdate, PreferencesUpdate
from backend.services.auth_service import AuthService

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me")
def get_current_user(payload: dict = Depends(get_current_user_payload)):
    user = AuthService.get_user_by_id(payload["userId"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {
        "success": True,
        "data": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "organization": user.get("organization"),
            "industrySector": user.get("industrySector"),
            "preferences": user.get("preferences"),
            "createdAt": user.get("createdAt")
        }
    }

@router.patch("/me")
def update_current_user(updates: UserUpdate, payload: dict = Depends(get_current_user_payload)):
    updated = AuthService.update_user(payload["userId"], updates.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="User not found.")
    return {
        "success": True,
        "message": "Profile updated successfully.",
        "data": {
            "id": updated["id"],
            "email": updated["email"],
            "name": updated["name"],
            "role": updated["role"],
            "organization": updated.get("organization"),
            "industrySector": updated.get("industrySector"),
            "preferences": updated.get("preferences")
        }
    }

@router.get("/me/preferences")
def get_preferences(payload: dict = Depends(get_current_user_payload)):
    user = AuthService.get_user_by_id(payload["userId"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"success": True, "data": user.get("preferences", {})}

@router.patch("/me/preferences")
def update_preferences(prefs: PreferencesUpdate, payload: dict = Depends(get_current_user_payload)):
    user = AuthService.get_user_by_id(payload["userId"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    current = dict(user.get("preferences", {}))
    dumped = prefs.model_dump(exclude_unset=True)
    current.update(dumped)

    updated = AuthService.update_user(payload["userId"], {"preferences": current})
    return {
        "success": True,
        "message": "Preferences updated successfully (DPDP Act 2023 compliant).",
        "data": updated.get("preferences")
    }
