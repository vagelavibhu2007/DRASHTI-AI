import pandas as pd
from fastapi import APIRouter, HTTPException
from backend.schemas.project_schema import ExplanationResponse, ProjectInput
from backend.data.project_repository import project_repository
from backend.ml.explainer import shap_explainer

router = APIRouter(prefix="/explain", tags=["Explainable AI"])

@router.post("/{project_id}", response_model=ExplanationResponse)
@router.get("/{project_id}", response_model=ExplanationResponse)
def explain_project_risk(project_id: str):
    """
    POST /api/explain/{project_id}
    Returns SHAP-based feature importance vectors and directional contribution bars.
    """
    project = project_repository.get_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project ID #{project_id} not found.")

    df_feat = pd.DataFrame([{
        "Original_Cost_Cr": project["originalCost"],
        "Cumulative_Expenditure_Cr": project["cumulativeExpenditure"],
        "Physical_Progress_Pct": project["physicalProgress"],
        "Expenditure_Pct_of_Original_Cost": project["expenditurePercentage"],
        "Ministry": project["ministry"],
        "Sector": project["sector"],
        "State": project["state"]
    }])

    contributions = shap_explainer.explain(
        df_features=df_feat,
        project_id=project["projectId"],
        project_name=project["projectName"]
    )

    return ExplanationResponse(
        project_id=project["projectId"],
        project_name=project["projectName"],
        overall_risk_score=project["overallRisk"],
        risk_level=project["riskLevel"],
        top_contributing_features=contributions,
        model_name="XGBoost + SHAP Tree Explainer",
        status="success"
    )

@router.post("/custom/simulate", response_model=ExplanationResponse)
def explain_custom_simulation(project: ProjectInput):
    """
    Computes real-time SHAP explanation for simulated parameter combinations in What-If Sandbox.
    """
    df_feat = pd.DataFrame([{
        "Original_Cost_Cr": project.Original_Cost_Cr,
        "Cumulative_Expenditure_Cr": project.Cumulative_Expenditure_Cr,
        "Physical_Progress_Pct": project.Physical_Progress_Pct,
        "Expenditure_Pct_of_Original_Cost": project.Expenditure_Pct_of_Original_Cost,
        "Ministry": project.Ministry,
        "Sector": project.Sector,
        "State": project.State
    }])

    contributions = shap_explainer.explain(
        df_features=df_feat,
        project_id=str(project.project_id),
        project_name=project.project_name or "Simulation Asset"
    )

    return ExplanationResponse(
        project_id=project.project_id or "SIM-01",
        project_name=project.project_name or "Simulated Project",
        overall_risk_score=75.0,
        risk_level="HIGH",
        top_contributing_features=contributions,
        model_name="XGBoost + SHAP Tree Explainer",
        status="success"
    )

