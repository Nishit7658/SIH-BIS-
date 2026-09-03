import time
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from backend.config import HOST, PORT
from backend.routes.auth import router as auth_router
from backend.routes.users import router as users_router
from backend.routes.standards import router as standards_router
from backend.routes.search import router as search_router
from backend.routes.chat import router as chat_router
from backend.routes.documents import router as documents_router
from backend.routes.ingestion import router as ingestion_router
from backend.routes.citations import router as citations_router
from backend.routes.health import router as health_router
from backend.routes.admin import router as admin_router
from backend.routes.verify import router as verify_router

app = FastAPI(
    title="Bureau of Indian Standards (BIS) Smart Digital Expert API",
    description="Statutory Compliance, Technical Standard Consultation, and RAG Ingestion Pipeline",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing & Logging Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response: Response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    return response

# Include all modular routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(standards_router)
app.include_router(search_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(ingestion_router)
app.include_router(citations_router)
app.include_router(admin_router)
app.include_router(verify_router)

@app.get("/")
def root():
    return {
        "title": "Bureau of Indian Standards (BIS) Digital Expert Platform",
        "status": "OPERATIONAL",
        "apiDocs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)
