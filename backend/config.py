import os
from pathlib import Path
from dotenv import load_dotenv

# Load local environment files
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env.local")
load_dotenv(BASE_DIR / ".env")

DATA_DIR = BASE_DIR / ".data"
UPLOADS_DIR = DATA_DIR / "uploads"
STANDARDS_JSON_PATH = BASE_DIR / "packages" / "data-pipeline" / "active_standards_200.json"
STORE_JSON_PATH = DATA_DIR / "bis_store.json"

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

JWT_SECRET = os.getenv("JWT_SECRET", "bis-smart-digital-expert-sec-key-2026")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 24 * 7  # 7 days

LLM_BASE_URL = os.getenv("LLM_BASE_URL", "http://127.0.0.1:8080").rstrip("/")
LLM_MODEL = os.getenv("LLM_MODEL", "gemma-local")
LLM_TIMEOUT = float(os.getenv("LLM_TIMEOUT", "180.0"))

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
