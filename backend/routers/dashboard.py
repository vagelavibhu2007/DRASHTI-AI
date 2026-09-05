from fastapi import APIRouter
from fastapi import APIRouter, Depends, Query
from typing import Optional
from backend.data.project_repository import project_repository
from backend.models.user_model import User
from backend.utils.dependencies import get_optional_current_user

router = APIRouter(prefix="", tags=["Dashboard & Risk Analytics"])

@router.get("/dashboard/summary")
def get_dashboard_summary():
def get_dashboard_summary(
    state: Optional[str] = Query(None, description="Optional State filter"),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    GET /api/dashboard/summary
    Aggregated portfolio metrics and KPI statistics computed from ML outputs.
    """
    return project_repository.get_kpi_summary()
    if current_user and current_user.authority_type == "STATE_AUTHORITY" and current_user.state:
        state = current_user.state
    return project_repository.get_kpi_summary(state=state)

@router.get("/risk/distribution")
def get_risk_distribution():
    """
    GET /api/risk/distribution
    Portfolio risk level breakdown for Donut Chart.
    """
    summary = project_repository.get_kpi_summary()
    return {
        "distribution": [
            {"name": "Critical", "value": summary["criticalProjects"], "color": "#EF4444", "level": "CRITICAL", "percentage": "20.9%"},
            {"name": "High", "value": summary["highRisk"], "color": "#F97316", "level": "HIGH", "percentage": "32.6%"},
            {"name": "Medium", "value": summary["mediumRisk"], "color": "#F59E0B", "level": "MEDIUM", "percentage": "30.3%"},
            {"name": "Low", "value": summary["lowRisk"], "color": "#10B981", "level": "LOW", "percentage": "16.3%"}
        ],
        "costRiskDistribution": [
            {"range": "0-20%", "count": 240, "label": "Minimal (0-20%)"},
            {"range": "21-40%", "count": 380, "label": "Low (21-40%)"},
            {"range": "41-60%", "count": 520, "label": "Moderate (41-60%)"},
            {"range": "61-80%", "count": 516, "label": "High (61-80%)"},
            {"range": "81-100%", "count": 310, "label": "Severe (81-100%)"}
        ],
        "timeRiskDistribution": [
            {"range": "0-20%", "count": 210, "label": "On Schedule"},
            {"range": "21-40%", "count": 415, "label": "Minor Delay"},
            {"range": "41-60%", "count": 495, "label": "Moderate Delay"},
            {"range": "61-80%", "count": 546, "label": "High Delay"},
            {"range": "81-100%", "count": 300, "label": "Severe Delay"}
        ]
    }

@router.get("/risk/trends")
def get_risk_trends():
    """
    GET /api/risk/trends
    Longitudinal historical & projected risk trends.
    """
    trends_6m = [
        {"month": "Mar 2026", "overallRisk": 58.2, "costRisk": 60.1, "timeRisk": 56.3, "criticalCount": 372},
        {"month": "Apr 2026", "overallRisk": 59.4, "costRisk": 61.5, "timeRisk": 57.3, "criticalCount": 385},
        {"month": "May 2026", "overallRisk": 60.8, "costRisk": 62.8, "timeRisk": 58.8, "criticalCount": 396},
        {"month": "Jun 2026", "overallRisk": 62.4, "costRisk": 65.2, "timeRisk": 59.6, "criticalCount": 418},
        {"month": "Jul 2026", "overallRisk": 61.9, "costRisk": 64.6, "timeRisk": 59.2, "criticalCount": 412},
        {"month": "Aug 2026", "overallRisk": 61.8, "costRisk": 64.2, "timeRisk": 59.4, "criticalCount": 410}
    ]
    return {
        "trends6M": trends_6m,
        "trends12M": [
            {"month": "Sep 2025", "overallRisk": 54.1, "costRisk": 56.0, "timeRisk": 52.2, "criticalCount": 340},
            {"month": "Oct 2025", "overallRisk": 54.9, "costRisk": 57.1, "timeRisk": 52.7, "criticalCount": 348},
            {"month": "Nov 2025", "overallRisk": 55.6, "costRisk": 58.0, "timeRisk": 53.2, "criticalCount": 355},
            {"month": "Dec 2025", "overallRisk": 56.8, "costRisk": 59.2, "timeRisk": 54.4, "criticalCount": 362},
            {"month": "Jan 2026", "overallRisk": 57.3, "costRisk": 59.7, "timeRisk": 54.9, "criticalCount": 365},
            {"month": "Feb 2026", "overallRisk": 57.9, "costRisk": 60.2, "timeRisk": 55.6, "criticalCount": 369},
            *trends_6m
        ]
    }

