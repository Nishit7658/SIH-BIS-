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

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
