from pydantic import BaseModel, Field, model_validator
from typing import Optional, Union, List, Dict, Any

class ProjectInput(BaseModel):
    project_id: Optional[Union[str, int]] = Field(default="SIM-001", description="Unique Project Identifier")
    project_name: Optional[str] = Field(default="Infrastructure Asset", description="Project Name")
    Original_Cost_Cr: float = Field(..., gt=0, description="Original sanctioned cost in Crores INR")
    Cumulative_Expenditure_Cr: float = Field(..., ge=0, description="Cumulative financial expenditure to date in Crores INR")
    Physical_Progress_Pct: float = Field(..., ge=0, le=100, description="Physical progress percentage (0-100)")
    Expenditure_Pct_of_Original_Cost: Optional[float] = Field(
        default=None,
        description="Financial progress percentage of original cost"
    )
    Ministry: str = Field(default="Ministry of Road Transport & Highways", description="Central Administrative Ministry")
    Sector: str = Field(default="Road Transport", description="Infrastructure Sector")
    State: str = Field(default="Maharashtra", description="State or Union Territory")

    @model_validator(mode="after")
    def compute_expenditure_pct_if_missing(self):
        if self.Expenditure_Pct_of_Original_Cost is None:
            if self.Original_Cost_Cr > 0:
                self.Expenditure_Pct_of_Original_Cost = round(
                    (self.Cumulative_Expenditure_Cr / self.Original_Cost_Cr) * 100.0, 2
                )
            else:
                self.Expenditure_Pct_of_Original_Cost = 0.0
        return self

class PredictionResponse(BaseModel):
    project_id: Optional[Union[str, int]] = "701410"
    project_name: Optional[str] = "Infrastructure Asset"
    cost_overrun_probability: float = Field(..., description="Cost Overrun Probability Percentage (0-100)")
    predicted_cost_overrun: int = Field(..., description="Classification flag (1 if prob >= 0.40 else 0)")
    time_overrun_probability: float = Field(..., description="Time Overrun Probability Percentage (0-100)")
    predicted_time_overrun: int = Field(..., description="Classification flag for time delay")
    overall_risk_score: float = Field(..., description="Average Risk Score = (Cost + Time) / 2")
    risk_level: str = Field(..., description="LOW, MEDIUM, HIGH, or CRITICAL")
    predicted_cost_overrun_cr: Optional[float] = Field(default=None, description="Predicted cost overrun amount in Cr INR via regression")
    estimated_revised_cost_cr: Optional[float] = Field(default=None, description="Original Cost + Predicted Overrun in Cr INR")
    predicted_delay_days: Optional[float] = Field(default=None, description="Predicted delay in days via time regression")
    warnings: List[str] = Field(default_factory=list, description="AI-assisted early warning notices")
    model_version: str = "4.2.0"
    execution_mode: str = "ML_REAL"

class BatchPredictionRequest(BaseModel):
    projects: List[ProjectInput]

class BatchPredictionResponse(BaseModel):
    total_analyzed: int
    predictions: List[PredictionResponse]

class ShapContribution(BaseModel):
    feature: str
    impact: float
    direction: str = Field(..., description="'increases_risk' or 'reduces_risk'")
    display_name: str
    detail: Optional[str] = None

class ExplanationResponse(BaseModel):
    project_id: Union[str, int]
    project_name: str
    overall_risk_score: float
    risk_level: str
    top_contributing_features: List[ShapContribution]
    model_name: str = "GBDT-SHAP Tree Explainer"
    status: str = "success"

class ModelInfoResponse(BaseModel):
    cost_model: Dict[str, Any]
    time_model: Dict[str, Any]
    cost_regression_model: Dict[str, Any]
    system_status: str
    active_features: List[str]

