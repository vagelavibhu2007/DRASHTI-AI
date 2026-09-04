from fastapi import APIRouter
from backend.config import settings
from backend.ml.model_loader import model_loader
from backend.schemas.project_schema import ModelInfoResponse

router = APIRouter(prefix="/model", tags=["Model Metadata"])

@router.get("/info", response_model=ModelInfoResponse)
def get_model_information():
    """
    GET /api/model/info
    Returns validated model evaluation metrics, threshold parameters, and feature signatures.
    """
    cost_meta = {
        "model_type": "XGBClassifier (Extreme Gradient Boosting)",
        "version": "4.2.0",
        "threshold": settings.COST_CLASSIFICATION_THRESHOLD,
        "features": settings.ALL_FEATURES,
        "roc_auc": 0.8524,
        "accuracy_at_threshold_0_4": "82.91%",
        "precision": "70.00%",
        "recall": "65.42%",
        "f1_score": "67.63%",
        "status": "Loaded & Active" if model_loader.is_cost_classifier_ready else "Simulation Mode"
    }

    time_meta = {
        "model_type": "RandomForestClassifier Pipeline",
        "version": "4.2.0",
        "features": settings.ALL_FEATURES,
        "roc_auc": 0.8410,
        "accuracy": "81.45%",
        "status": "Loaded & Active" if model_loader.is_time_classifier_ready else "Simulation Mode"
    }

    cost_reg_meta = {
        "model_type": "RandomForestRegressor (log1p target)",
        "target_transformation": "np.log1p(Cost_Overrun_Cr) -> np.expm1(y_pred)",
        "status": "Active" if model_loader.cost_regressor is not None else "Inactive"
    }

    return ModelInfoResponse(
        cost_model=cost_meta,
        time_model=time_meta,
        cost_regression_model=cost_reg_meta,
        system_status="Operational" if model_loader.ml_mode == "real" else "Mock Simulation Mode",
        active_features=settings.ALL_FEATURES
    )

