import pandas as pd
import logging
from backend.schemas.project_schema import ProjectInput, PredictionResponse
from backend.ml.cost_predictor import cost_predictor
from backend.ml.time_predictor import time_predictor
from backend.ml.risk_engine import (
    calculate_overall_risk_score,
    calculate_risk_level,
    generate_ai_warnings
)
from backend.config import settings

logger = logging.getLogger("drashti.ml.service")

class PredictionService:
    def predict_single(self, project: ProjectInput) -> PredictionResponse:
        """
        Runs the full end-to-end ML Risk Assessment for a project.
        """
        # 1. Format input DataFrame with exact expected feature columns
        df_input = pd.DataFrame([{
            "Original_Cost_Cr": project.Original_Cost_Cr,
            "Cumulative_Expenditure_Cr": project.Cumulative_Expenditure_Cr,
            "Physical_Progress_Pct": project.Physical_Progress_Pct,
            "Expenditure_Pct_of_Original_Cost": project.Expenditure_Pct_of_Original_Cost,
            "Ministry": project.Ministry,
            "Sector": project.Sector,
            "State": project.State
        }])

        # 2. Run Cost Model (Classification & Regression)
        cost_res = cost_predictor.predict(df_input)

        # 3. Run Time Model (Classification & Delay Estimation)
        time_res = time_predictor.predict(df_input)

        # 4. Compute Overall Risk & Classification
        cost_prob = cost_res["probability"]
        time_prob = time_res["probability"]
        overall_score = calculate_overall_risk_score(cost_prob, time_prob)
        risk_lvl = calculate_risk_level(overall_score)

        # 5. Generate Early Warnings
        warnings = generate_ai_warnings(
            overall_risk=overall_score,
            cost_prob=cost_prob,
            time_prob=time_prob,
            physical_progress=project.Physical_Progress_Pct,
            expenditure_pct=project.Expenditure_Pct_of_Original_Cost
        )

        return PredictionResponse(
            project_id=project.project_id,
            project_name=project.project_name,
            cost_overrun_probability=cost_prob,
            predicted_cost_overrun=cost_res["classification"],
            time_overrun_probability=time_prob,
            predicted_time_overrun=time_res["classification"],
            overall_risk_score=overall_score,
            risk_level=risk_lvl,
            predicted_cost_overrun_cr=cost_res.get("predicted_cost_overrun_cr"),
            estimated_revised_cost_cr=cost_res.get("estimated_revised_cost_cr"),
            predicted_delay_days=time_res.get("predicted_delay_days"),
            warnings=warnings,
            model_version=settings.APP_VERSION,
            execution_mode="ML_REAL" if cost_res.get("mode") == "REAL_MODEL" else "SIMULATION"
        )

    def predict_batch(self, projects: list[ProjectInput]) -> list[PredictionResponse]:
        """
        Runs batch predictions across multiple projects.
        """
        return [self.predict_single(p) for p in projects]

prediction_service = PredictionService()

