import hashlib
import hmac
import os
import time
import uuid
from typing import Optional, Dict, Any
from backend.config import JWT_SECRET, JWT_EXPIRY_HOURS
from backend.database import load_store, update_store

def hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac("sha512", password.encode("utf-8"), salt.encode("utf-8"), 10000)
    return f"{salt}:{key.hex()}"

def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, original_key = stored_hash.split(":")
        key = hashlib.pbkdf2_hmac("sha512", password.encode("utf-8"), salt.encode("utf-8"), 10000)
        return hmac.compare_digest(key.hex(), original_key)
    except Exception:
        return False

# Base64URL JWT helpers
import base64
import json

def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

def _b64_decode(s: str) -> bytes:
    padding = "=" * (4 - (len(s) % 4)) if len(s) % 4 != 0 else ""
    return base64.urlsafe_b64decode((s + padding).encode("utf-8"))

def sign_jwt(payload: Dict[str, Any]) -> str:
    iat = int(time.time())
    exp = iat + (JWT_EXPIRY_HOURS * 3600)
    full_payload = {**payload, "iat": iat, "exp": exp}

    header = {"alg": "HS256", "typ": "JWT"}
    encoded_header = _b64_encode(json.dumps(header).encode("utf-8"))
    encoded_payload = _b64_encode(json.dumps(full_payload).encode("utf-8"))

    signature = hmac.new(
        JWT_SECRET.encode("utf-8"),
        f"{encoded_header}.{encoded_payload}".encode("utf-8"),
        hashlib.sha256
    ).digest()
    encoded_sig = _b64_encode(signature)

    return f"{encoded_header}.{encoded_payload}.{encoded_sig}"

def verify_jwt(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        encoded_header, encoded_payload, encoded_sig = parts

        expected_sig = hmac.new(
            JWT_SECRET.encode("utf-8"),
            f"{encoded_header}.{encoded_payload}".encode("utf-8"),
            hashlib.sha256
        ).digest()
        if not hmac.compare_digest(_b64_encode(expected_sig), encoded_sig):
            return None

        payload = json.loads(_b64_decode(encoded_payload).decode("utf-8"))
        if payload.get("exp") and payload["exp"] < int(time.time()):
            return None
        return payload
    except Exception:
        return None

class AuthService:
    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        store = load_store()
        for u in store.get("users", []):
            if u["email"].lower() == email.lower().strip():
                return u
        return None

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        store = load_store()
        for u in store.get("users", []):
            if u["id"] == user_id:
                return u
        return None

    @staticmethod
    def create_user(data: Dict[str, Any]) -> Dict[str, Any]:
        user_id = f"usr_{int(time.time())}_{uuid.uuid4().hex[:6]}"
        now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        password_hash = hash_password(data["password"])

        new_user = {
            "id": user_id,
            "email": data["email"].lower().strip(),
            "passwordHash": password_hash,
            "name": data["name"].strip(),
            "role": data.get("role", "user"),
            "organization": data.get("organization"),
            "industrySector": data.get("industrySector"),
            "preferences": {
                "dataRetentionDays": 30,
                "language": "en",
                "lowLiteracyMode": False
            },
            "createdAt": now,
            "updatedAt": now
        }

        def _add(store):
            store["users"].append(new_user)
            return new_user

        update_store(_add)
        return new_user

    @staticmethod
    def update_user(user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        def _update(store):
            for u in store.get("users", []):
                if u["id"] == user_id:
                    for k, v in updates.items():
                        if v is not None:
                            u[k] = v
                    u["updatedAt"] = now
                    return u
            return None

        return update_store(_update)
