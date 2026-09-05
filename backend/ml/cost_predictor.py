import numpy as np
import pandas as pd
import logging
from backend.config import settings
from backend.ml.model_loader import model_loader

logger = logging.getLogger("drishti.ml.cost")

class CostPredictor:
    def __init__(self):
        self.threshold = settings.COST_CLASSIFICATION_THRESHOLD

    def predict(self, df_features: pd.DataFrame) -> dict:
        """
        Executes Cost Classification (threshold 0.40) & secondary Regression (np.expm1).
        """
        if model_loader.ml_mode == "real" and model_loader.is_cost_classifier_ready:
            try:
                # Predict probability with XGBoost pipeline
                probas = model_loader.cost_classifier.predict_proba(df_features)[:, 1]
                prob = float(probas[0])
                prob_pct = round(prob * 100.0, 2)
                
                # Apply strict threshold 0.40
                is_overrun = 1 if prob >= self.threshold else 0
                
                # Secondary Cost Regression
                pred_cost_cr = None
                revised_cost_cr = None
                if model_loader.cost_regressor is not None and is_overrun:
                    log_pred = model_loader.cost_regressor.predict(df_features)[0]
                    # Invert log1p transformation with np.expm1
                    cost_overrun_val = float(np.expm1(log_pred))
                    pred_cost_cr = round(max(0.0, cost_overrun_val), 2)
                    orig_cost = float(df_features["Original_Cost_Cr"].iloc[0])
                    revised_cost_cr = round(orig_cost + pred_cost_cr, 2)

                return {
                    "probability": prob_pct,
                    "classification": is_overrun,
                    "predicted_cost_overrun_cr": pred_cost_cr,
                    "estimated_revised_cost_cr": revised_cost_cr,
                    "mode": "REAL_MODEL"
                }
            except Exception as e:
                logger.error(f"Error executing cost prediction model: {e}")
                # Fallback to simulation formula if pipeline execution encounters unexpected data
                return self._fallback_prediction(df_features)
        else:
            return self._fallback_prediction(df_features)

    def _fallback_prediction(self, df: pd.DataFrame) -> dict:
        orig = float(df["Original_Cost_Cr"].iloc[0])
        cum = float(df["Cumulative_Expenditure_Cr"].iloc[0])
        phys = float(df["Physical_Progress_Pct"].iloc[0])
        exp_pct = float(df["Expenditure_Pct_of_Original_Cost"].iloc[0]) if "Expenditure_Pct_of_Original_Cost" in df else (cum / (orig or 1)) * 100.0
        
        diff = exp_pct - phys
        base_prob = 35.0 + (diff * 0.72) + (18.0 if exp_pct > 85 else 0.0)
        if exp_pct > 100:
            base_prob += 15.0
        if phys < 30 and exp_pct > 40:
            base_prob += 14.0

        prob_pct = round(min(98.5, max(5.0, base_prob)), 2)
        is_overrun = 1 if prob_pct >= (self.threshold * 100.0) else 0
        
        pred_cost_cr = round(max(0.0, (cum - orig) + (orig * 0.15)), 2) if is_overrun else None
        revised = round(orig + pred_cost_cr, 2) if pred_cost_cr is not None else None

        return {
            "probability": prob_pct,
            "classification": is_overrun,
            "predicted_cost_overrun_cr": pred_cost_cr,
            "estimated_revised_cost_cr": revised,
            "mode": "SIMULATION_FALLBACK"
        }

cost_predictor = CostPredictor()

