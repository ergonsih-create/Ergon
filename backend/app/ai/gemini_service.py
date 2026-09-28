"""
GRAM-DISHA — Google Gemini AI Integration
Grounds conversations on verified domain data with fallback to deterministic mock.
"""

from typing import Optional, Dict, Any
from app.core.config import settings
from app.ai.base import (
    BaseAIProvider,
    ExplanationPayload,
    ExplanationResult,
    IntentPayload,
    IntentResult
)
from app.ai.prompts import DISHA_SYSTEM_PROMPT, DISHA_GROUNDING_TEMPLATE
from app.ai.mock_service import MockAIService


class GeminiAIService(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize Google GenAI Client: {e}")
                self.client = None

    async def generate_explanation(self, payload: ExplanationPayload) -> ExplanationResult:
        mock = MockAIService()
        return await mock.generate_explanation(payload)

    async def extract_intent(self, payload: IntentPayload) -> IntentResult:
        mock = MockAIService()
        return await mock.extract_intent(payload)

    def explain_metric(self, metric_name: str, value: float, context: dict) -> ExplanationPayload:
        if not self.client:
            return MockAIService().explain_metric(metric_name, value, context)

        prompt = f"Explain the business metric '{metric_name}' which is currently {value}. Context: {context}. Keep it concise, practical, and clear for a rural entrepreneur."
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            return ExplanationPayload(
                metric_name=metric_name,
                explanation=response.text,
                actionable_advice="Review your financial schedule in the Financial Planning tab."
            )
        except Exception as e:
            print(f"Gemini API call failed ({e}), falling back to mock provider.")
            return MockAIService().explain_metric(metric_name, value, context)

    def parse_intent(self, text: str) -> dict:
        return MockAIService().parse_intent(text)

    def generate_grounded_response(
        self,
        user_query: str,
        grounding_data: Dict[str, Any]
    ) -> str:
        biz = grounding_data.get("business", {})
        fin = grounding_data.get("financials", {})
        schemes = grounding_data.get("schemes", [])
        feas = grounding_data.get("feasibility", {})

        schemes_lines = []
        for s in schemes[:3]:
            schemes_lines.append(
                f"- {s.get('schemeName', s.get('schemeCode', 'Scheme'))}: "
                f"Subsidy ₹{s.get('maxSubsidy', s.get('maxSubsidyOrAssistance', 0)):,.2f} "
                f"({s.get('subsidyPercentage', 0)}%) | Status: {s.get('eligibilityState', 'ELIGIBLE')}"
            )
        schemes_text = "\n".join(schemes_lines) if schemes_lines else "No specific schemes matched yet."

        full_prompt = DISHA_GROUNDING_TEMPLATE.format(
            business_name=biz.get("name", "Rural Enterprise"),
            sector=biz.get("sector", "Agro-Processing"),
            industry_type=biz.get("industry_type", "Manufacturing"),
            district=biz.get("district", "Yavatmal"),
            state=biz.get("state", "Maharashtra"),
            location_type=biz.get("location_type", "Rural"),
            category=biz.get("category", "General"),
            gender=biz.get("gender", "Male"),
            total_project_cost=fin.get("totalProjectCost", 850000.0),
            promoter_contribution=fin.get("promoterContribution", 150000.0),
            promoter_pct=fin.get("promoterContributionPercentage", 17.6),
            term_loan=fin.get("requiredTermLoan", 595000.0),
            working_capital_loan=fin.get("requiredWorkingCapitalLoan", 105000.0),
            monthly_emi=fin.get("monthlyEMI", 12500.0),
            dscr=fin.get("projectedDSCR", 1.85),
            bep=fin.get("contributionMarginPercentage", 42.0),
            roi=fin.get("projectedAnnualROI", 24.5),
            schemes_summary=schemes_text,
            feasibility_score=feas.get("totalScore", 0.78),
            feasibility_tier=feas.get("rankingTier", "HIGH_FEASIBILITY"),
            strengths=", ".join(feas.get("strengths", ["Local raw materials nearby"]))[:120],
            risks=", ".join(feas.get("threats", ["Seasonal raw material price variation"]))[:120],
            user_query=user_query
        )

        if not self.client:
            cost = fin.get("totalProjectCost", 850000.0)
            subsidy = schemes[0].get("maxSubsidy", 297500.0) if schemes else 297500.0
            return (
                f"Namaste! Based on your verified project profile for **{biz.get('name', 'your enterprise')}**, "
                f"your total project cost is **₹{cost:,.2f}** with a promoter margin requirement of "
                f"**₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%).\n\n"
                f"Under the **PMEGP Scheme**, your rural manufacturing setup qualifies for a **35% capital subsidy** "
                f"amounting to approximately **₹{subsidy:,.2f}**, leaving a bank term loan requirement of "
                f"**₹{fin.get('requiredTermLoan', 595000.0):,.2f}**.\n\n"
                f"Your Debt Service Coverage Ratio (DSCR) stands at **{fin.get('projectedDSCR', 1.85):.2f}**, "
                f"which satisfies bank viability norms (minimum 1.50). You can proceed to submit your DPR to the "
                f"District Industries Centre (DIC) Task Force."
            )

        try:
            from google.genai import types
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=DISHA_SYSTEM_PROMPT,
                    temperature=0.3
                )
            )
            return response.text
        except Exception as e:
            print(f"Error calling Gemini: {e}. Falling back to deterministic response.")
            return (
                f"Namaste! Under your verified enterprise data for **{biz.get('name', 'your unit')}**, "
                f"your bank term loan requirement is **₹{fin.get('requiredTermLoan', 595000.0):,.2f}** "
                f"with an EMI of **₹{fin.get('monthlyEMI', 12500.0):,.2f}** and an eligible PMEGP subsidy of "
                f"**₹{schemes[0].get('maxSubsidy', 297500.0) if schemes else 297500.0:,.2f}**."
            )
