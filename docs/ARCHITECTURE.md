# GRAM-DISHA — System Architecture & Design Specification

**Smart India Hackathon 2026** | **Team: ERGON**

---

## 1. Architectural Philosophy

GRAM-DISHA is an **evidence-first, source-bound decision support and structuring intelligence platform** engineered for rural and semi-urban micro-entrepreneurs.

### Core Architectural Axioms:
1. **Evidence-First & Source-Bound**: No hallucinations or speculative generation. All metrics, benchmark ranges, and eligibility criteria are anchored to authoritative government directories (LGD, AGMARKNET, MSME PMEGP, NSFDC).
2. **Transparent Mathematical Calculations**: All financial projections (EMI, Break-even, DSCR, ROI, Cash Flow) and feasibility calculations (HBFS) use deterministic arithmetic formulas.
3. **Explicit Uncertainty (`UNKNOWN`)**: Where hyper-local datasets or unorganized competitor volumes are not published in official registers, the system displays `UNKNOWN` rather than generating artificial numbers.
4. **AI/NLP Isolation**: The AI co-pilot layer (**DISHA AI OS**) is strictly isolated through a provider-agnostic interface (`BaseAIProvider`). It is bounded by verified deterministic facts.
5. **Low-Bandwidth Resilience**: Mobile-first, progressive loading, offline fallback, and optimized gzip/asset caching for 2G/3G/4G connectivity.

---

## 2. System Layering

```
┌──────────────────────────────────────────────────────────────┐
│                    User Experience Layer                     │
│  React 18 + Vite | Tailwind CSS | Butler/Rosarivo | Bento UI │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│                  DISHA AI OS Advisory Layer                   │
│   Context State | Advisor Drawer | Voice & Multilingual Map  │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│            Deterministic Calculations & Rule Engines         │
│  - Financial Engine (EMI, DSCR, Break-Even, ROI)             │
│  - Feasibility Engine (HBFS Scoring Formula)                 │
│  - Government Scheme Engine (Versioned Rule Matching)        │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│               FastAPI High-Performance Backend               │
│   Pydantic V2 Schemas | Token Auth | CORS & Security Guard   │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│                    MySQL 8.0 Persistence                    │
│   Provenance Sources | LGD Locations | Schemes | Feasibility │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. HBFS Feasibility Formulation

$$\text{HBFS} = 0.25 \cdot D + 0.15 \cdot A + 0.10 \cdot I + 0.10 \cdot S + 0.10 \cdot Sc - 0.05 \cdot C - 0.15 \cdot \text{Cap} - 0.20 \cdot U$$

Where all components are normalized to $[0.0, 1.0]$:
- $D$: Localized Demand Index
- $A$: Raw Material & Market Accessibility Index
- $I$: Infrastructure Readiness Index
- $S$: Socioeconomic & Cluster Support Index
- $Sc$: Scheme Alignment Index
- $C$: Climate & Agro-Ecological Vulnerability Penalty
- $\text{Cap}$: Promoter Capital Deficit Ratio
- $U$: Hyper-Local Uncertainty Ratio

---

## 4. Design System Specification

- **Canvas Background**: Warm White (`#F8F5EE`)
- **Card Background**: Clean Light Surface (`#FCFAF5`)
- **Primary Brand / Terracotta Accent**: `#B95736` (Hover: `#9F452B`)
- **Forest / Heritage Green**: `#174C3A` (Hover: `#123C2E`)
- **Sage Support**: `#71856A`
- **Harvest Gold**: `#C69A45`
- **Charcoal Text**: `#242522` (Secondary: `#68655D`)
- **Dividers & Borders**: `#D9D3C7`
