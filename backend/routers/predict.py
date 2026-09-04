from fastapi import APIRouter, HTTPException
from backend.schemas.project_schema import (
    ProjectInput,
    PredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse
)
from backend.ml.predictor_service import prediction_service

router = APIRouter(prefix="/predict", tags=["Prediction Engine"])

@router.post("/risk", response_model=PredictionResponse)
def predict_project_risk(project: ProjectInput):
    """
    POST /api/predict/risk
    Executes real-time ML risk assessment for a given infrastructure asset.
    """
    try:
        response = prediction_service.predict_single(project)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate prediction. Please verify project data: {str(e)}"
        )

@router.post("/batch", response_model=BatchPredictionResponse)
def predict_batch_risk(batch_req: BatchPredictionRequest):
    """
    POST /api/predict/batch
    Batch prediction across multiple project proposals or portfolios.
    """
    try:
        preds = prediction_service.predict_batch(batch_req.projects)
        return BatchPredictionResponse(
            total_analyzed=len(preds),
            predictions=preds
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Batch prediction processing failure: {str(e)}"
        )

