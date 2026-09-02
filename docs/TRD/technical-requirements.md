# GRAM-DISHA — Technical Requirements Document (TRD)

**Architecture Stack:**
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Motion
- **Backend:** FastAPI + Python 3.11 + Pydantic v2
- **Database:** MySQL 8.0 (InnoDB) with provenance audit logging
- **Authentication:** Google OAuth 2.0 with JWT token signing & session verification
- **Deployment:** Linux VPS (Docker + Nginx reverse proxy + Gzip compression)
- **AI / NLP Isolation:** Provider-agnostic `BaseAIProvider` layer supporting Gemini API with deterministic grounding.

## Deterministic Formulation Standards
- **Loan EMI**: `P * r * (1+r)^n / ((1+r)^n - 1)`
- **DSCR**: `Net Operating Income (NOI) / Annual Debt Service`
- **Break-Even**: `Fixed Costs / (Unit Selling Price - Unit Variable Cost)`
- **Feasibility (HBFS)**: `0.25*D + 0.15*A + 0.10*I + 0.10*S + 0.10*Sc - 0.05*C - 0.15*Cap - 0.20*U`
