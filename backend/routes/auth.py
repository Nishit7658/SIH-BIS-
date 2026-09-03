from fastapi import APIRouter, HTTPException, Response, Header, Depends
from typing import Optional
from backend.models.auth import UserRegister, UserLogin, TokenResponse
from backend.services.auth_service import AuthService, verify_password, sign_jwt, verify_jwt

router = APIRouter(prefix="/api/auth", tags=["auth"])

def get_current_user_payload(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token missing or invalid.")
    token = authorization.split(" ")[1].strip()
    payload = verify_jwt(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Session expired or invalid token.")
    return payload

@router.post("/register", status_code=201)
def register_user(payload: UserRegister, response: Response):
    existing = AuthService.get_user_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="A user with this email address already exists.")

    user = AuthService.create_user(payload.model_dump())
    token = sign_jwt({
        "userId": user["id"],
        "email": user["email"],
        "role": user["role"],
        "organization": user.get("organization")
    })

    response.set_cookie(
        key="bis_auth_token",
        value=token,
        max_age=7 * 24 * 3600,
        httponly=True,
        samesite="lax"
    )

    return {
        "success": True,
        "message": "User registered successfully.",
        "data": {
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "organization": user.get("organization"),
                "industrySector": user.get("industrySector")
            },
            "token": token
        }
    }

@router.post("/login")
def login_user(payload: UserLogin, response: Response):
    user = AuthService.get_user_by_email(payload.email)
    if not user or not verify_password(payload.password, user.get("passwordHash", "")):
        raise HTTPException(status_code=401, detail="Invalid email address or password.")

    token = sign_jwt({
        "userId": user["id"],
        "email": user["email"],
        "role": user["role"],
        "organization": user.get("organization")
    })

    response.set_cookie(
        key="bis_auth_token",
        value=token,
        max_age=7 * 24 * 3600,
        httponly=True,
        samesite="lax"
    )

    return {
        "success": True,
        "message": "Authentication successful.",
        "data": {
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "organization": user.get("organization"),
                "industrySector": user.get("industrySector"),
                "preferences": user.get("preferences")
            },
            "token": token
        }
    }

@router.post("/logout")
def logout_user(response: Response):
    response.delete_cookie(key="bis_auth_token")
    return {"success": True, "message": "Session successfully invalidated."}

@router.get("/me")
def get_me(user_payload: dict = Depends(get_current_user_payload)):
    user = AuthService.get_user_by_id(user_payload["userId"])
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found.")

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

@router.post("/refresh")
def refresh_token(response: Response, user_payload: dict = Depends(get_current_user_payload)):
    token = sign_jwt({
        "userId": user_payload["userId"],
        "email": user_payload["email"],
        "role": user_payload["role"],
        "organization": user_payload.get("organization")
    })
    response.set_cookie(
        key="bis_auth_token",
        value=token,
        max_age=7 * 24 * 3600,
        httponly=True,
        samesite="lax"
    )
    return {"success": True, "data": {"token": token}}
