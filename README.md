# DRISHTI AI — Infrastructure Project Intelligence Platform

> Don't Just Monitor Projects — Predict Their Risks.

[![Project Status](https://img.shields.io/badge/Project%20Status-Active-emerald.svg)](https://github.com/vagelavibhu2007/DRISHTI-AI)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TailwindCSS-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.10+-teal.svg)](https://fastapi.tiangolo.com/)
[![Machine Learning](https://img.shields.io/badge/ML%20Models-XGBoost%20%7C%20Random%20Forest%20%7C%20SHAP-orange.svg)](https://xgboost.readthedocs.io/)
[![Geographic Intelligence](https://img.shields.io/badge/GIS-Leaflet%20%7C%20GeoJSON-green.svg)](https://leafletjs.com/)

---

## Project Overview

**DRISHTI AI** is an AI/ML-powered infrastructure project intelligence platform designed to help monitor, assess, and prioritize large-scale public infrastructure projects.

Traditional infrastructure monitoring systems focus primarily on retrospective and post-facto reporting—capturing delays and cost escalations only after milestones have elapsed. **DRISHTI AI** introduces a predictive intelligence layer that continuously analyzes early operational, financial, and sectoral indicators to forecast project risks 6 to 18 months ahead of time.

```
Traditional Approach:
Project Data  ──▶  Monitoring  ──▶  Dashboard  ──▶  Reports  ──▶  Human Analysis (Post-Facto)

DRISHTI AI Approach:
Project Data  ──▶  Data Processing  ──▶  ML Prediction  ──▶  Risk Scoring  ──▶  Explainable AI  ──▶  Early Warning  ──▶  Proactive Action
```

The platform evaluates projects across key central ministries and sectors, generating:
- **Cost Overrun Probability & Classification**
- **Time Overrun Probability & Schedule Delay Estimation**
- **Composite 0–100 Project Risk Score**
- **Four-Tier Standardized Risk Classification** (Low, Medium, High, Critical)
- **High-Risk Project Prioritization & Ranking**
- **Automated AI-Assisted Early Warning Alerts**
- **Explainable AI (XAI) Root Cause Insights via SHAP**
- **Geographic Risk Analytics with Interactive India Map**
- **Interactive What-If Scenario Risk Simulation**
- **Natural Query AI Assistant Interface**

---

## Problem Statement

Large-scale infrastructure initiatives across sectors such as Railways, Roads & Highways, Water Resources, Power, and Petroleum represent massive capital investments. However, managing portfolios of thousands of simultaneous projects presents critical administrative challenges:

- **Frequent Cost Escalations:** Budget overruns accumulate silently when fund drawdowns outpace verified ground execution.
- **Cascading Schedule Delays:** Statutory clearances, land acquisitions, and contractor bottlenecks create compounding delays.
- **Complex Multi-Sector Data:** Fragmented project parameters across different states, sectors, and ministries make holistic risk identification difficult.
- **Reactive Interventions:** Conventional monitoring relies on historical monthly updates, identifying bottlenecks only after deadlines have failed.
- **Prioritization Bottlenecks:** Decision-makers need objective, data-backed prioritization to allocate audit and administrative resources to high-risk assets first.

**DRISHTI AI** does not replace existing monitoring mechanisms; rather, it augments them by adding an automated predictive intelligence layer that flags high-risk trajectories early.

---

## Proposed Solution

DRISHTI AI combines modern machine learning, explainable AI, and geospatial visualization into a cohesive decision-support platform:

$$\text{Project Data} + \text{ML Inference} + \text{Risk Scoring} + \text{SHAP XAI} + \text{Geographic Analytics} + \text{What-If Simulation} \implies \text{Proactive Governance}$$

By modeling leading variables such as the divergence between financial expenditure and physical progress, historical sector hazard rates, and spatial patterns, DRISHTI AI empowers project authorities to intervene before delays and cost escalations become irreversible.

---

## Key Features

### 1. AI-Based Cost Overrun Prediction
- Predicts the probability of cost escalation using an optimized **XGBoost Classifier**.
- Evaluates key features:
  - `Original_Cost_Cr` (Sanctioned capital expenditure in ₹ Cr)
  - `Cumulative_Expenditure_Cr` (Total financial spend to date in ₹ Cr)
  - `Physical_Progress_Pct` (Actual on-ground completion percentage)
  - `Expenditure_Pct_of_Original_Cost` (Ratio of expenditure to original sanction)
  - `Ministry` (Administrative ministry)
  - `Sector` (Infrastructure domain)
  - `State` (Geographic jurisdiction)
- Uses an administrative decision threshold of **0.40** (40%) to maximize recall and catch nascent cost risks.
- Provides secondary estimated cost overrun in ₹ Cr via trained regression.

### 2. Time Overrun Prediction & Delay Estimation
- Evaluates the probability of schedule overrun using a **Random Forest Classifier Pipeline**.
- Estimates anticipated delay in calendar days via non-linear log-transformed regression ($\text{expm1}$).

### 3. Overall Project Risk Score
A standardized composite metric combining both financial and temporal hazard dimensions:

$$\text{Overall Risk Score} = \frac{\text{Cost Overrun Probability} + \text{Time Overrun Probability}}{2}$$

Standardized Risk Classification Tiers:
| Risk Level | Score Range | Operational Meaning | Action Protocol |
| :--- | :---: | :--- | :--- |
| **LOW** | $0.00 - 24.99$ | Project progressing within normal parametric bounds | Routine periodic monitoring |
| **MEDIUM** | $25.00 - 49.99$ | Minor milestone drift or early financial variance | Monthly milestone reviews |
| **HIGH** | $50.00 - 79.99$ | Significant expenditure vs progress gap detected | Bi-weekly audits & contractor check-ins |
| **CRITICAL** | $80.00 - 100.00$ | Severe risk of critical cost escalation or multi-year delay | Immediate inter-ministerial executive review |

### 4. High-Risk Project Ranking
- Dynamically ranks national infrastructure assets by AI-assessed risk score.
- Highlights portfolio exposure (e.g., ₹ 11.42 Lakh Cr at-risk capital across 410 critical assets).
- Provides instant drill-down into project specifics, feature metrics, and contact authorities.

### 5. Early Warning Engine
- Continuously scans project parameters to fire contextual, AI-assisted early warning notices:
  - *Critical Overall Risk escalation warnings*
  - *High Cost / Time Overrun hazard warnings*
  - *Financial progress disproportionately exceeding physical progress (>20% gap)*
  - *Critical milestone lag (Physical progress <30% while fund drawdown >60%)*

### 6. Explainable AI (SHAP Framework)
- Integrates **SHAP (SHapley Additive exPlanations)** TreeExplainer to break down each prediction.
- Visualizes positive risk contributors (factors driving risk up, e.g. severe expenditure divergence) and negative mitigations (e.g. priority central scheme allocation) to provide transparent, explainable recommendations.

### 7. Geographic Risk Analysis
- Interactive India map powered by Leaflet and GeoJSON state boundaries.
- State-level choropleth risk aggregation and individual project coordinate markers.
- Multi-dimensional filtering by Sector, Risk Category, and State.
- Interactive project popups with direct links to deep-dive analytics.

### 8. What-If Scenario Risk Simulation
- Live interactive sandbox allowing project engineers and analysts to adjust:
  - Physical Progress (%)
  - Cumulative Expenditure (₹ Cr)
  - Sector Baseline Hazard
  - Environmental / Monsoon Clearance delays
  - Land Acquisition & RoW bottleneck variables
- Computes real-time sensitivity and risk score delta without altering live operational data.
> *Note: What-If Analysis is intended as a decision-support simulation tool and does not represent a guaranteed future outcome.*

### 9. Project Intelligence Dashboard
- High-level KPI indicators (Total Monitored Value, At-Risk Capital, Critical Projects, Active Alerts).
- Sectoral and state risk distribution charts.
- Prediction trend analytics comparing planned vs actual trajectories.

### 10. AI Assistant Interface
- Interactive natural language copilot interface designed for conversational project queries, SHAP attribution lookups, and state vulnerability inquiries.
- *(Backend LLM / RAG ingestion pipeline marked as Planned / In Development).*

---

## System Architecture

```
                      ┌────────────────────────────────────────┐
                      │        Infrastructure Data Sources     │
                      │  (1,966 Monitored Project Records)     │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │    Data Cleaning & Preprocessing       │
                      │ (Median Imputation, Outlier Handling)  │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │       Feature Engineering Pipeline     │
                      │   (Expenditure Ratio, Progress Gap,    │
                      │     One-Hot Categorical Encodings)     │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │           AI / ML Engine Layer         │
                      │ ┌──────────────────┐ ┌───────────────┐ │
                      │ │ XGBoost (Cost)   │ │ Random Forest │ │
                      │ │ (Threshold 0.40) │ │ (Time Pipeline│ │
                      │ └────────┬─────────┘ └───────┬───────┘ │
                      └──────────┼───────────────────┼─────────┘
                                 │                   │
                                 ▼                   ▼
                      ┌────────────────────────────────────────┐
                      │  Cost Risk (0-100) + Time Risk (0-100) │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │   Composite Overall Risk Score (0-100) │
                      │       Standardized 4-Tier Index        │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │  Explainable AI (SHAP) & Early Warning │
                      │ (Feature Attributions, Anomaly Alerts) │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │          FastAPI Backend Engine        │
                      │     (REST API, ML Inference, Repos)    │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │    DRISHTI AI Interactive Dashboard    │
                      │ (React 18 + Tailwind + Recharts + GIS) │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │       Proactive Decision Support       │
                      └────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Details / Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React.js 18** | Modular component-driven user interface |
| **Build Tool** | **Vite 6** | Ultra-fast build and development server |
| **Styling & UI** | **Tailwind CSS 3.4** | Custom government theme styling, responsive layouts |
| **Icons & Visuals** | **Lucide React** | Clean, accessible system iconography |
| **Data Visualization** | **Recharts 2.13** | Bar charts, Pie charts, Area graphs, Risk trends |
| **Geographic Mapping** | **Leaflet & React-Leaflet** | Interactive India map with GeoJSON state overlays |
| **Geospatial Processing** | **D3-Geo & TopoJSON Client** | Vector calculations and state boundary projections |
| **Routing** | **React Router DOM v6** | Client-side page navigation and deep routing |
| **HTTP Client** | **Axios** | Asynchronous communication with FastAPI backend |
| **Backend Framework** | **FastAPI** | High-performance Python asynchronous REST API |
| **ASGI Server** | **Uvicorn** | ASGI server for production Python execution |
| **Configuration** | **Pydantic Settings** | Environment variable management and validation |
| **Machine Learning** | **Scikit-learn** | Pipeline composition, imputation, Random Forest models |
| **Gradient Boosting** | **XGBoost** | High-performance tree booster for Cost Overrun prediction |
| **Explainable AI** | **SHAP** | TreeExplainer for local and global feature attribution |
| **Data Processing** | **Pandas & NumPy** | In-memory feature manipulation and array math |
| **Model Serialization** | **Joblib** | Model persistence and binary artifact loading |

---

## Machine Learning Approach

### Cost Overrun Classification & Estimation
- **Problem Formulation:** Binary classification identifying whether an infrastructure asset will experience cost escalation beyond sanctioned budget.
- **Target Variable:** `Cost_Overrun_Flag` (1 = Overrun, 0 = Within Budget).
- **Features Used:**
  - `Original_Cost_Cr` (Numerical)
  - `Cumulative_Expenditure_Cr` (Numerical)
  - `Physical_Progress_Pct` (Numerical)
  - `Expenditure_Pct_of_Original_Cost` (Numerical)
  - `Ministry` (Categorical, One-Hot Encoded)
  - `Sector` (Categorical, One-Hot Encoded)
  - `State` (Categorical, One-Hot Encoded)
- **Model:** `XGBClassifier` integrated with `ColumnTransformer` (median numeric imputation + one-hot categorical encoding).
- **Decision Threshold:** **`0.40`**
  - Standard classification thresholds (0.50) often under-report high-risk infrastructure projects in early stages.
  - Setting the threshold to `0.40` ensures high sensitivity and recall for proactive risk management.
  - *Example:* If model outputs probability $77.3\% \ge 40.0\%$, the project is classified as **Predicted Cost Overrun = YES (1)**.
- **Secondary Cost Regressor:** `RandomForestRegressor` trained on log-transformed target $\ln(1 + \text{Cost\_Overrun\_Cr})$ to predict overrun volume in ₹ Cr.

### Time Overrun Classification & Delay Estimation
- **Problem Formulation:** Binary classification predicting project schedule slippage beyond target date of completion.
- **Target Variable:** `Time_Overrun_Flag` (1 = Delay, 0 = On Track).
- **Model:** `RandomForestClassifier` pipeline with categorical feature encoding.
- **Secondary Delay Regressor:** Evaluated Random Forest and CatBoost regressors on log-transformed delay days $\ln(1 + \text{Time\_Overrun\_Days})$ with $\text{expm1}$ post-processing.

---

## Model Performance

The evaluation metrics achieved on held-out test datasets:

### Cost Overrun Classification (XGBoost Classifier)
- **ROC-AUC Score:** **`0.8524`**
- **Performance at Decision Threshold 0.40:**
  - **Accuracy:** **`82.91%`**
  - **Precision:** **`70.00%`**
  - **Recall:** **`65.42%`**
  - **F1 Score:** **`67.63%`**

### Time Overrun Classification (Random Forest Classifier)
- **ROC-AUC Score:** **`0.8410`**
- **Accuracy:** **`81.45%`**

---

## Dataset

DRISHTI AI operates on infrastructure project monitoring records representing **1,966 central sector projects**:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `Project_ID` | String / Integer | Unique statutory infrastructure asset identifier |
| `Project_Name` | String | Official nomenclature of the infrastructure asset |
| `Ministry` | Categorical | Sponsoring Union Ministry (e.g. Ministry of Railways, Jal Shakti, MoRTH) |
| `Sector` | Categorical | Infrastructure domain (e.g. Railways, Water Resources, Power, Road Transport) |
| `State` | Categorical | Primary geographic state / location |
| `Original_Cost_Cr` | Float | Initially sanctioned capital budget (in ₹ Cr) |
| `Cumulative_Expenditure_Cr` | Float | Cumulative expenditure incurred to date (in ₹ Cr) |
| `Physical_Progress_Pct` | Float | Ground execution completion rate (0.0% - 100.0%) |
| `Expenditure_Pct_of_Original_Cost` | Float | Financial expenditure divided by original cost (%) |
| `Cost_Overrun_Flag` | Binary | Ground truth cost overrun indicator (0 or 1) |
| `Time_Overrun_Days` | Float | Cumulative schedule delay in calendar days |

> *Data context:* Project monitoring dataset compiled for research, risk modeling, and technical demonstration. DRISHTI AI does not claim proprietary government access.

---

## Dashboard Modules

1. **Dashboard (Overview):** Executive KPI cards, paradigm shift workflow banner, quick-action prediction modal trigger, and high-level risk distributions.
2. **Projects Repository:** Full searchable and filterable database of 1,966 central projects with status, cost, progress, and risk badges.
3. **Risk Analytics:** In-depth analytical views displaying cost vs time risk distributions, sector vulnerability bar charts, and risk score frequency histograms.
4. **High-Risk Projects:** Dedicated escalation queue prioritizing assets in Critical (Score $\ge 80$) and High (Score $50-79.9$) tiers.
5. **Prediction Trends:** Trajectory modeling showcasing baseline vs predicted cost and timeline drift across project phases.
6. **Geographic Risk:** Interactive real India map providing choropleth state risk density, project coordinate pins, and quick-filter drawers.
7. **Early Warnings:** Automated alert feed categorized by urgency (Critical, High, Medium) with recommended intervention steps.
8. **What-If Analysis:** Interactive parametric simulator for sensitivity analysis on physical progress, spend rate, and statutory approvals.
9. **AI Assistant:** Conversational query interface with pre-built prompt suggestions and structured analysis cards.
10. **Reports:** Executive downloadable dossier repository covering quarterly risk audits and sectoral vulnerability briefs.

---

## What Makes DRISHTI AI Different?

| Feature / Aspect | Conventional Project Monitoring | DRISHTI AI Intelligence Platform |
| :--- | :--- | :--- |
| **Core Operating Model** | Reactive (post-facto tracking) | **Proactive & Predictive (6–18 months in advance)** |
| **Risk Assessment** | Manual human inspection & static thresholds | **Automated Machine Learning Inference (XGBoost + RF)** |
| **Risk Scoring** | Disconnected cost and delay reports | **Composite 0–100 Unified Risk Score** |
| **Root Cause Discovery** | Lengthy administrative committee reviews | **Explainable AI (SHAP TreeExplainer attributions)** |
| **Scenario Modeling** | Static spreadsheet forecasts | **Interactive Real-Time What-If Sensitivity Simulator** |
| **Early Warnings** | Generated after milestones lapse | **Dynamic Anomaly Rules on leading progress divergence** |
| **Decision Focus** | Routine compliance reporting | **Actionable prioritization of high-risk capital** |

---

## Project Structure

```
DRISHTI-AI/
├── backend/
│   ├── data/
│   │   ├── ML_READY.csv                 # Core project dataset (1,966 records)
│   │   └── project_repository.py        # In-memory query engine & repository
│   ├── ml/
│   │   ├── cost_predictor.py            # XGBoost cost classification service
│   │   ├── time_predictor.py            # Random Forest time classification service
│   │   ├── risk_engine.py               # Risk scoring (0-100) & alert generator
│   │   ├── explainer.py                 # SHAP tree explanation handler
│   │   ├── model_loader.py              # Singleton model artifact loader
│   │   └── predictor_service.py         # Unified ML prediction pipeline
│   ├── models/
│   │   ├── cost_model/
│   │   │   ├── cost_classifier_xgb.joblib
│   │   │   ├── cost_regressor.joblib
│   │   │   └── metadata.json
│   │   └── time_model/
│   │       ├── time_classifier_rf.joblib
│   │       ├── time_regressor_rf.joblib
│   │       └── metadata.json
│   ├── routers/
│   │   ├── predict.py                   # /api/predict/risk & /api/predict/batch
│   │   ├── projects.py                  # /api/projects & /api/projects/{id}
│   │   ├── dashboard.py                 # /api/dashboard/summary
│   │   ├── risk.py                      # /api/risk/high-risk
│   │   ├── explain.py                   # /api/explain/{project_id}
│   │   ├── model_info.py                # /api/model/info
│   │   └── alerts.py                    # /api/alerts
│   ├── schemas/
│   │   └── project_schema.py            # Pydantic request/response models
│   ├── scripts/
│   │   ├── train_actual_models.py       # Model training and validation script
│   │   └── train_and_export_models.py   # Model artifact exporter
│   ├── config.py                        # Pydantic application settings
│   ├── main.py                          # FastAPI application entry point
│   └── test_backend.py                  # Automated backend API test suite
├── src/
│   ├── components/
│   │   ├── alerts/                      # Early warning card components
│   │   ├── charts/                      # Recharts analytical visualizations
│   │   ├── common/                      # Risk badges, gauges, search bars, drawers
│   │   ├── dashboard/                   # KPI cards, USP banner, overview charts
│   │   ├── layout/                      # Sidebar, Navbar, PageContainer, Modals
│   │   ├── map/                         # India Leaflet GIS map component
│   │   └── projects/                    # Project table, filter controls, SHAP bars
│   ├── context/
│   │   └── DashboardContext.jsx         # Centralized React state provider
│   ├── data/
│   │   ├── india_states.geojson         # Complete GeoJSON polygon definitions
│   │   ├── india_states_simplified.json # Lightweight GeoJSON topology
│   │   ├── indiaMapPaths.js             # SVG fallback map coordinates
│   │   └── mockData.js                  # Initial state store & knowledge base
│   ├── pages/
│   │   ├── AIAssistant.jsx              # AI copilot chat interface
│   │   ├── Alerts.jsx                   # Early warnings feed
│   │   ├── Dashboard.jsx                # Main executive dashboard
│   │   ├── GeographicRisk.jsx           # Full-page GIS map view
│   │   ├── HighRiskProjects.jsx         # Critical escalation queue
│   │   ├── PredictionTrends.jsx         # Historical & forecasted trends
│   │   ├── ProjectDetails.jsx           # Individual project dossier view
│   │   ├── Projects.jsx                 # Filterable projects repository
│   │   ├── Reports.jsx                  # Formal report dossier center
│   │   ├── RiskAnalytics.jsx            # Detailed sectoral risk analytics
│   │   └── WhatIfAnalysis.jsx           # Interactive simulation sandbox
│   ├── services/
│   │   └── api.js                       # Centralized Axios API client + local fallback
│   ├── utils/
│   │   └── riskUtils.js                 # Risk calculations, color formatters
│   ├── App.jsx                          # Route definitions & app shell
│   ├── index.css                        # Tailwind CSS imports & custom styles
│   └── main.jsx                         # React 18 DOM entry point
├── index.html                           # HTML template with metadata & title
├── package.json                         # Node dependencies & scripts
├── tailwind.config.js                   # Tailwind theme configuration
├── vite.config.js                       # Vite configuration
└── README.md                            # Comprehensive project documentation
```

---

## Installation & Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Python:** v3.10 or higher
- **pip:** Python package manager

### 1. Clone the Repository
```bash
git clone https://github.com/vagelavibhu2007/DRISHTI-AI.git
cd DRISHTI-AI
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### 3. Backend Setup (FastAPI & ML Engine)
Open a new terminal in the project root:

```bash
# Optional: create a Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install required Python dependencies
pip install fastapi uvicorn pydantic pydantic-settings scikit-learn xgboost shap joblib pandas numpy

# Start the FastAPI backend server
uvicorn backend.main:app --reload --port 8000
```
The backend API and interactive OpenAPI documentation will be accessible at:
- **API Root:** `http://localhost:8000`
- **Swagger UI Docs:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### 4. Running Backend Verification Tests
To verify all ML pipelines, predictions, and REST endpoints:
```bash
python backend/test_backend.py
```

---

## Environment Variables

Create a `.env` file in the project root or configure the following variables:

```env
# Backend ML Execution Mode ('real' for live trained models, 'mock' for standalone mode)
ML_MODE=real

# Cost Overrun Classification Decision Threshold
COST_CLASSIFICATION_THRESHOLD=0.40

# Backend Port and Host
PORT=8000
HOST=0.0.0.0

# Frontend API URL (for Vite)
VITE_API_URL=http://localhost:8000/api
```

---

## Usage Guide

1. **Launch Both Servers:** Start the FastAPI backend on port `8000` and Vite frontend on port `5173`.
2. **Access the Dashboard:** Open `http://localhost:5173` in your browser.
3. **Explore National Risk Overview:** Inspect total monitored capital, critical asset count, and sectoral risk breakdown.
4. **Search & Filter Projects:** Navigate to **Projects** to filter 1,966 projects by Ministry, Sector, State, or Risk Tier.
5. **Analyze Critical Assets:** Visit **High-Risk Projects** to inspect assets with Overall Risk Score $\ge 80$.
6. **Inspect Explainable AI (SHAP):** Click on any project or open the Quick Project Drawer to review positive and negative SHAP feature contributors.
7. **Geographic GIS Risk Map:** Navigate to **Geographic Risk** to view state-level aggregated risk and zoom in on specific project markers.
8. **Run What-If Simulations:** Navigate to **What-If Analysis**, adjust physical progress or cumulative expenditure, and observe the live ML risk score response.
9. **Review Early Warnings:** Navigate to **Early Warnings** to view active alerts and operational recommendations.
10. **Query AI Assistant:** Open **AI Assistant** to ask natural language questions about portfolio vulnerabilities.

---

## Project Status

- [x] Modern Government UI/UX Dashboard
- [x] Unified 0–100 Risk Scoring Index
- [x] XGBoost Cost Overrun Classifier (Threshold 0.40)
- [x] Random Forest Time Overrun Classifier
- [x] Secondary Cost & Delay Regressors
- [x] SHAP-Based Explainable AI Integration
- [x] Interactive Leaflet India Geographic Risk Map
- [x] High-Risk Project Escalation Tier
- [x] Dynamic Early Warning Alert Engine
- [x] Interactive What-If Scenario Simulator
- [x] Fast In-Memory Project Repository & FastAPI REST API
- [x] Fallback Client-Side Simulation Mode for Offline Operation
- [ ] Automated Enterprise PDF Report Generation Engine
- [ ] Advanced RAG-Powered LLM Assistant Ingestion
- [ ] Real-Time External API Ingestion Pipelines
- [ ] Cloud Production Deployment Containerization

---

## Roadmap

- **Phase 1 (Current):** Predictive ML models, composite risk scoring, interactive dashboard, What-If simulation, and GIS map.
- **Phase 2:** Live multi-source data connectors (APIs, periodic automated spreadsheet syncs).
- **Phase 3:** RAG-powered project copilot integrating official project DPRs, inspection notes, and contractor filings.
- **Phase 4:** Drone-based computer vision progress verification integration with automated ground-truth validation.
- **Phase 5:** Multi-tenant role-based access control (RBAC) for Union Ministries, State Nodal Agencies, and Project Directors.

---

## Limitations

- **Model Predictions are Statistical Estimates:** Predictions are probabilistic decision-support indicators and should not replace formal administrative audits.
- **Data Dependency:** Accuracy depends on timely and accurate updates to input parameters (progress percentages, expenditure figures).
- **Geographic Precision:** Project pins on the map reflect administrative state/regional anchors where precise package GPS coordinates are not provided.
- **External Shocks:** Black-swan macro events (extreme climatic anomalies, sudden geopolitical supply disruptions) require human executive appraisal alongside model outputs.

---

## Disclaimer

> **DRISHTI AI** provides AI-assisted analytical insights and model-based predictions intended to support infrastructure project monitoring and decision-making. Predictions should not be interpreted as guaranteed outcomes or as a replacement for official engineering assessments, statutory approvals, and administrative governance.

---

## Contributing

Contributions to DRISHTI AI are welcome. To contribute:

1. **Fork** the repository: `https://github.com/vagelavibhu2007/DRISHTI-AI`
2. **Create a Feature Branch:** `git checkout -b feature/NewFeature`
3. **Commit your changes:** `git commit -m "Add new feature"`
4. **Push to branch:** `git push origin feature/NewFeature`
5. **Open a Pull Request** describing your additions or fixes.

---

## License

License information will be added.

---

## Acknowledgements

- **Infrastructure Project Data:** Open-source project monitoring data patterns and public sector benchmarks.
- **Open-Source ML Ecosystem:** Scikit-learn, XGBoost, SHAP, Pandas, and NumPy development teams.
- **Geospatial & Mapping Community:** OpenStreetMap contributors, Leaflet, and TopoJSON.
- **React & FastAPI Communities:** React 18, Vite, Tailwind CSS, Lucide Icons, and FastAPI.

---

## Team & Maintainers

- **Project Repository:** [https://github.com/vagelavibhu2007/DRISHTI-AI](https://github.com/vagelavibhu2007/DRISHTI-AI)
- **Maintainer:** Vibhukumar Vagela ([@vagelavibhu2007](https://github.com/vagelavibhu2007))

---

## Important Links

- **GitHub Repository:** [https://github.com/vagelavibhu2007/DRISHTI-AI](https://github.com/vagelavibhu2007/DRISHTI-AI)
- **Backend API Documentation:** `http://localhost:8000/docs` (when backend server is running)