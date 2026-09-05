from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from backend.config import settings
from backend.ml.model_loader import model_loader
from backend.db.database import init_db
from backend.routers import (
    predict,
    projects,
    dashboard,
    risk,
    explain,
    model_info,
    alerts
    alerts,
    auth
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("drishti.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"ML Execution Mode: {settings.ML_MODE.upper()}")
    # Initialize SQLite Authentication Database & Tables
    init_db()
    logger.info("SQLite Authentication database initialized.")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend Machine Learning & Prediction API for DRISHTI AI Infrastructure Intelligence Platform",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(predict.router, prefix=settings.API_PREFIX)
app.include_router(projects.router, prefix=settings.API_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_PREFIX)
app.include_router(risk.router, prefix=settings.API_PREFIX)
app.include_router(explain.router, prefix=settings.API_PREFIX)
app.include_router(model_info.router, prefix=settings.API_PREFIX)
app.include_router(alerts.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "platform": "DRISHTI AI",
        "tagline": "Don't Just Monitor Projects — Predict Their Risks.",
        "status": "Online",
        "version": settings.APP_VERSION,
        "ml_mode": settings.ML_MODE,
        "cost_threshold": settings.COST_CLASSIFICATION_THRESHOLD,
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "cost_classifier": model_loader.is_cost_classifier_ready,
            "time_classifier": model_loader.is_time_classifier_ready,
            "cost_regressor": model_loader.cost_regressor is not None,
            "time_regressor": model_loader.time_regressor is not None
        }
    }

