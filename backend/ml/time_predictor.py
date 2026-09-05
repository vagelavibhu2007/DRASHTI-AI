import numpy as np
import pandas as pd
import logging
from backend.ml.model_loader import model_loader

logger = logging.getLogger("drishti.ml.time")

class TimePredictor:
    def predict(self, df_features: pd.DataFrame) -> dict:
        """
        Executes Time Overrun Classification & Delay Estimation (np.expm1).
        """
        if model_loader.ml_mode == "real" and model_loader.is_time_classifier_ready:
            try:
                # Predict probability with Random Forest pipeline
                probas = model_loader.time_classifier.predict_proba(df_features)[:, 1]
                prob = float(probas[0])
                prob_pct = round(prob * 100.0, 2)
                is_delay = 1 if prob >= 0.50 else 0

                # Predict Delay in Days
                pred_delay_days = None
                if model_loader.time_regressor is not None:
                    log_delay = model_loader.time_regressor.predict(df_features)[0]
                    delay_days = float(np.expm1(log_delay))
                    pred_delay_days = round(max(0.0, delay_days), 0)

                return {
                    "probability": prob_pct,
                    "classification": is_delay,
                    "predicted_delay_days": pred_delay_days,
                    "mode": "REAL_MODEL"
                }
            except Exception as e:
                logger.error(f"Error executing time prediction model: {e}")
                return self._fallback_prediction(df_features)
        else:
            return self._fallback_prediction(df_features)

    def _fallback_prediction(self, df: pd.DataFrame) -> dict:
        phys = float(df["Physical_Progress_Pct"].iloc[0])
        exp_pct = float(df["Expenditure_Pct_of_Original_Cost"].iloc[0]) if "Expenditure_Pct_of_Original_Cost" in df else 50.0
        sector = str(df["Sector"].iloc[0]) if "Sector" in df else ""

        diff = exp_pct - phys
        base_prob = 40.0 + (diff * 0.65) + ((100.0 - phys) * 0.35)
        if "Water" in sector:
            base_prob += 12.0
        elif "Road" in sector:
            base_prob += 8.0

        prob_pct = round(min(99.0, max(5.0, base_prob)), 2)
        is_delay = 1 if prob_pct >= 50.0 else 0
        pred_delay_days = round((100.0 - phys) * 8.5 + (diff * 4.0), 0) if is_delay else None

        return {
            "probability": prob_pct,
            "classification": is_delay,
            "predicted_delay_days": pred_delay_days,
            "mode": "SIMULATION_FALLBACK"
        }

time_predictor = TimePredictor()

