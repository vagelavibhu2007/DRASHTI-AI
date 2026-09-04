import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report
import xgboost as xgb

def train_and_export_actual_models():
    os.makedirs("backend/models/cost_model", exist_ok=True)
    os.makedirs("backend/models/time_model", exist_ok=True)

    print("Loading actual ML_READY.csv dataset (1,966 projects)...")
    csv_path = "backend/data/ML_READY.csv" if os.path.exists("backend/data/ML_READY.csv") else "ML_READY.csv"
    df = pd.read_csv(csv_path)
    print(f"Dataset shape: {df.shape} from {csv_path}")

    # Standard Feature Columns from Notebook
    numeric_features = [
        "Original_Cost_Cr",
        "Cumulative_Expenditure_Cr",
        "Physical_Progress_Pct",
        "Expenditure_Pct_of_Original_Cost"
    ]
    categorical_features = ["Ministry", "Sector", "State"]
    feature_cols = numeric_features + categorical_features

    # Preprocessors
    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median"))
    ])
    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])
    preprocessor = ColumnTransformer(transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features)
    ])

    # -------------------------------------------------------------
    # 1. COST OVERRUN CLASSIFICATION (XGBoost)
    # -------------------------------------------------------------
    print("\n--- 1. Training Cost Overrun Classification (XGBoost) ---")
    cost_df = df.dropna(subset=["Cost_Overrun_Flag"]).copy()
    cost_df["Cost_Overrun_Flag"] = cost_df["Cost_Overrun_Flag"].astype(int)
    
    X_cost = cost_df[feature_cols]
    y_cost = cost_df["Cost_Overrun_Flag"]

    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(
        X_cost, y_cost, test_size=0.20, random_state=42, stratify=y_cost
    )

    xgb_clf = xgb.XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="logloss",
        random_state=42,
        n_jobs=-1
    )

    xgb_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", xgb_clf)
    ])

    xgb_pipeline.fit(X_train_c, y_train_c)
    
    y_prob_c = xgb_pipeline.predict_proba(X_test_c)[:, 1]
    threshold = 0.40
    y_pred_40 = (y_prob_c >= threshold).astype(int)

    acc = accuracy_score(y_test_c, y_pred_40)
    prec = precision_score(y_test_c, y_pred_40, zero_division=0)
    rec = recall_score(y_test_c, y_pred_40, zero_division=0)
    f1 = f1_score(y_test_c, y_pred_40, zero_division=0)
    roc_auc = roc_auc_score(y_test_c, y_prob_c)

    print(f"XGBoost Evaluation at Threshold {threshold}:")
    print(f"Accuracy : {acc*100:.2f}% | Precision: {prec*100:.2f}% | Recall: {rec*100:.2f}% | F1: {f1*100:.2f}% | ROC-AUC: {roc_auc:.4f}")

    cost_clf_path = "backend/models/cost_model/cost_classifier_xgb.joblib"
    joblib.dump(xgb_pipeline, cost_clf_path)
    print(f"Saved: {cost_clf_path}")

    cost_metadata = {
        "model_type": "XGBClassifier (Extreme Gradient Boosting)",
        "version": "4.2.0",
        "threshold": 0.40,
        "features": feature_cols,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "roc_auc": round(float(roc_auc), 4),
        "accuracy_at_threshold_0_4": f"{acc*100:.2f}%",
        "precision": f"{prec*100:.2f}%",
        "recall": f"{rec*100:.2f}%",
        "f1_score": f"{f1*100:.2f}%",
        "status": "Production Calibrated"
    }
    with open("backend/models/cost_model/metadata.json", "w") as f:
        json.dump(cost_metadata, f, indent=2)

    # -------------------------------------------------------------
    # 2. COST OVERRUN REGRESSION (Log-transformed Cost Overrun Cr)
    # -------------------------------------------------------------
    print("\n--- 2. Training Cost Overrun Regression (Random Forest & XGBoost) ---")
    cost_reg_df = df[df["Cost_Overrun_Cr"] > 0].copy()
    cost_reg_df["Log_Cost_Overrun"] = np.log1p(cost_reg_df["Cost_Overrun_Cr"])

    X_cost_reg = cost_reg_df[feature_cols]
    y_cost_reg = cost_reg_df["Log_Cost_Overrun"]

    cost_reg_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(
            n_estimators=300, max_depth=12, min_samples_split=5, min_samples_leaf=2, random_state=42, n_jobs=-1
        ))
    ])
    cost_reg_pipeline.fit(X_cost_reg, y_cost_reg)
    cost_reg_path = "backend/models/cost_model/cost_regressor.joblib"
    joblib.dump(cost_reg_pipeline, cost_reg_path)
    print(f"Saved: {cost_reg_path}")

    # -------------------------------------------------------------
    # 3. TIME OVERRUN CLASSIFICATION (Random Forest)
    # -------------------------------------------------------------
    print("\n--- 3. Training Time Overrun Classification (Random Forest) ---")
    time_df = df.dropna(subset=["Time_Overrun_Flag"]).copy()
    time_df["Time_Overrun_Flag"] = time_df["Time_Overrun_Flag"].astype(int)

    X_time = time_df[feature_cols]
    y_time = time_df["Time_Overrun_Flag"]

    X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(
        X_time, y_time, test_size=0.20, random_state=42, stratify=y_time
    )

    time_rf_model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced",
        n_jobs=-1
    )
    time_rf_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", time_rf_model)
    ])
    time_rf_pipeline.fit(X_train_t, y_train_t)

    y_prob_t = time_rf_pipeline.predict_proba(X_test_t)[:, 1]
    y_pred_t = (y_prob_t >= 0.50).astype(int)
    time_acc = accuracy_score(y_test_t, y_pred_t)
    time_roc_auc = roc_auc_score(y_test_t, y_prob_t)

    print(f"Time Classification Evaluation: Accuracy: {time_acc*100:.2f}% | ROC-AUC: {time_roc_auc:.4f}")

    time_clf_path = "backend/models/time_model/time_classifier_rf.joblib"
    joblib.dump(time_rf_pipeline, time_clf_path)
    print(f"Saved: {time_clf_path}")

    # -------------------------------------------------------------
    # 4. TIME OVERRUN REGRESSION (Log-transformed Delay Days)
    # -------------------------------------------------------------
    print("\n--- 4. Training Time Overrun Regression (Random Forest Regressor) ---")
    time_reg_df = df[df["Time_Overrun_Days"] >= 0].copy()
    time_reg_df["Log_Time_Overrun_Days"] = np.log1p(time_reg_df["Time_Overrun_Days"])

    X_time_reg = time_reg_df[feature_cols]
    y_time_reg = time_reg_df["Log_Time_Overrun_Days"]

    time_reg_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(
            n_estimators=300, max_depth=12, min_samples_split=5, min_samples_leaf=2, random_state=42, n_jobs=-1
        ))
    ])
    time_reg_pipeline.fit(X_time_reg, y_time_reg)
    time_reg_path = "backend/models/time_model/time_regressor_rf.joblib"
    joblib.dump(time_reg_pipeline, time_reg_path)
    print(f"Saved: {time_reg_path}")

    time_metadata = {
        "model_type": "RandomForestClassifier & Regressor Pipeline",
        "version": "4.2.0",
        "features": feature_cols,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "roc_auc": round(float(time_roc_auc), 4),
        "accuracy": f"{time_acc*100:.2f}%",
        "status": "Production Calibrated"
    }
    with open("backend/models/time_model/metadata.json", "w") as f:
        json.dump(time_metadata, f, indent=2)

    print("\nAll production ML models trained & exported from ML_READY.csv successfully!")

if __name__ == "__main__":
    train_and_export_actual_models()

