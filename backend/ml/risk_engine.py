def calculate_overall_risk_score(cost_prob: float, time_prob: float) -> float:
    """
    Overall Risk Score = (Cost Overrun Probability + Time Overrun Probability) / 2
    """
    return round((cost_prob + time_prob) / 2.0, 2)

def calculate_risk_level(score: float) -> str:
    """
    Standardized DRASHTI AI Risk Classification:
    0 <= score < 25    : LOW
    25 <= score < 50   : MEDIUM
    50 <= score < 80   : HIGH
    80 <= score <= 100 : CRITICAL
    """
    if score >= 80.0:
        return "CRITICAL"
    elif score >= 50.0:
        return "HIGH"
    elif score >= 25.0:
        return "MEDIUM"
    else:
        return "LOW"

def generate_ai_warnings(
    overall_risk: float,
    cost_prob: float,
    time_prob: float,
    physical_progress: float,
    expenditure_pct: float
) -> list[str]:
    """
    Generates AI-assisted early warning notices.
    """
    warnings = []

    if overall_risk >= 80.0:
        warnings.append("Project requires immediate priority review based on elevated AI-assessed risk.")
    elif overall_risk >= 50.0:
        warnings.append("Project exhibits elevated risk trajectory; recommended for bi-weekly milestone audits.")

    if cost_prob >= 80.0:
        warnings.append("High probability of cost overrun detected.")
    elif cost_prob >= 60.0:
        warnings.append("Moderate fiscal exposure detected; monitor commodity and contract price index adjustments.")

    if time_prob >= 80.0:
        warnings.append("High probability of time overrun detected.")
    elif time_prob >= 60.0:
        warnings.append("Moderate schedule delay hazard detected; check land acquisition and RoW status.")

    if (expenditure_pct - physical_progress) > 20.0:
        warnings.append("Financial progress is significantly ahead of physical progress.")

    if physical_progress < 30.0 and expenditure_pct > 60.0:
        warnings.append("Critical milestone lag: Ground delivery is under 30% while fund drawdown exceeds 60%.")

    return warnings

