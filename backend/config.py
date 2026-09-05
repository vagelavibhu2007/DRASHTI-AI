import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "DRISHTI AI - Infrastructure Risk Backend"
    APP_VERSION: str = "4.2.0"
    API_PREFIX: str = "/api"
    
    # ML Mode: "real" or "mock"
    ML_MODE: str = os.getenv("ML_MODE", "real")
    
    # Classification Threshold for Cost Overrun
    COST_CLASSIFICATION_THRESHOLD: float = 0.40
    
    # Model Artifact Paths
    COST_CLASSIFIER_PATH: str = os.getenv("COST_CLASSIFIER_PATH", "backend/models/cost_model/cost_classifier_xgb.joblib")
    COST_REGRESSOR_PATH: str = os.getenv("COST_REGRESSOR_PATH", "backend/models/cost_model/cost_regressor.joblib")
    COST_METADATA_PATH: str = os.getenv("COST_METADATA_PATH", "backend/models/cost_model/metadata.json")
    
    TIME_CLASSIFIER_PATH: str = os.getenv("TIME_CLASSIFIER_PATH", "backend/models/time_model/time_classifier_rf.joblib")
    TIME_REGRESSOR_PATH: str = os.getenv("TIME_REGRESSOR_PATH", "backend/models/time_model/time_regressor_rf.joblib")
    TIME_METADATA_PATH: str = os.getenv("TIME_METADATA_PATH", "backend/models/time_model/metadata.json")

    # Dataset Path
    DATASET_PATH: str = os.getenv("DATASET_PATH", "backend/data/ML_READY.csv")

    # Feature List matching training
    NUMERIC_FEATURES: list[str] = [
        "Original_Cost_Cr",
        "Cumulative_Expenditure_Cr",
        "Physical_Progress_Pct",
        "Expenditure_Pct_of_Original_Cost"
    ]
    CATEGORICAL_FEATURES: list[str] = ["Ministry", "Sector", "State"]
    ALL_FEATURES: list[str] = NUMERIC_FEATURES + CATEGORICAL_FEATURES

    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"

settings = Settings()

