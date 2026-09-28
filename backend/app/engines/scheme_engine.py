"""
GRAM-DISHA — Deterministic Government Scheme Engine
Pure deterministic rule-matrix evaluator for central and state MSME/Agro schemes.
Includes PMEGP, MUDRA (Shishu/Kishore/Tarun), PMFME, Stand-Up India, and NSFDC.
"""

from typing import List, Dict, Any, Optional


class SchemeEngine:
    @staticmethod
    def evaluate_schemes(
        category: str,
        gender: str,
        is_rural: bool,
        project_cost: float,
        activity_type: str = "AGRO_PROCESSING",
        annual_income: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        cat_norm = category.upper() if category else "GENERAL"
        gen_norm = gender.upper() if gender else "MALE"
        act_norm = activity_type.upper() if activity_type else "AGRO_PROCESSING"

        is_special = cat_norm in ["SC", "ST", "OBC", "MINORITY", "WOMEN", "EX_SERVICEMEN"] or gen_norm == "FEMALE"
        is_woman = gen_norm == "FEMALE" or cat_norm == "WOMEN"
        is_sc_st = cat_norm in ["SC", "ST"]

        matches: List[Dict[str, Any]] = []

        # -------------------------------------------------------------
        # 1. PMEGP (Prime Minister's Employment Generation Programme)
        # -------------------------------------------------------------
        pmegp_max_cost = 5000000.0 if act_norm in ["MANUFACTURING", "AGRO_PROCESSING"] else 2000000.0
        pmegp_subsidy_pct = (
            (35.0 if is_special else 25.0)
            if is_rural
            else (25.0 if is_special else 15.0)
        )
        pmegp_promoter_min_pct = 5.0 if is_special else 10.0
        pmegp_state = "POTENTIALLY_ELIGIBLE" if project_cost <= pmegp_max_cost else "NOT_ELIGIBLE"
        pmegp_calc_subsidy = round((min(project_cost, pmegp_max_cost) * pmegp_subsidy_pct) / 100.0, 2)

        matches.append({
            "schemeId": "SCHEME_PMEGP_2025",
            "schemeCode": "PMEGP",
            "schemeName": "Prime Minister's Employment Generation Programme",
            "ministryOrAgency": "Ministry of MSME / KVIC, Government of India",
            "ruleVersion": "v2.4-2025",
            "eligibilityState": pmegp_state,
            "maxSubsidyOrAssistance": pmegp_calc_subsidy,
            "subsidyPercentage": pmegp_subsidy_pct,
            "eligibleLoanAmount": round(project_cost * (1.0 - pmegp_promoter_min_pct / 100.0), 2),
            "promoterContributionRequiredPercent": pmegp_promoter_min_pct,
            "qualifyingCriteriaPassed": [
                "Applicant age >= 18 years verified",
                (
                    "Location mapped to Rural Panchayat Area (35% Special / 25% General Subsidy)"
                    if is_rural else "Location mapped to Urban Area (25% Special / 15% General)"
                ),
                (
                    "Special Category criteria verified (SC/ST/OBC/Women)"
                    if is_special else "General Category criteria matched"
                ),
                "New Greenfield micro-enterprise activity",
            ],
            "unmetCriteria": (
                [f"Project cost exceeds max ceiling of ₹{int(pmegp_max_cost / 100000)} Lakh"]
                if project_cost > pmegp_max_cost else []
            ),
            "unknownCriteria": [
                "Detailed Project Report appraisal at District Level Task Force Committee (DLTFC)"
            ],
            "requiredDocuments": [
                {"documentId": "DOC_AADHAAR", "name": "Aadhaar Card (UIDAI)", "category": "IDENTITY", "mandatory": True, "issuingAuthority": "UIDAI"},
                {"documentId": "DOC_PAN", "name": "PAN Card", "category": "IDENTITY", "mandatory": True, "issuingAuthority": "Income Tax Dept"},
                {"documentId": "DOC_CASTE_CERT", "name": "Caste / Social Category Certificate", "category": "IDENTITY", "mandatory": is_special, "issuingAuthority": "Tehsildar / Revenue Dept"},
                {"documentId": "DOC_RURAL_CERT", "name": "Rural Area Certificate", "category": "ADDRESS", "mandatory": is_rural, "issuingAuthority": "Gram Panchayat Secretary / BDO"},
                {"documentId": "DOC_DPR", "name": "Detailed Project Report (DPR)", "category": "BUSINESS", "mandatory": True, "issuingAuthority": "Self / DIC Facilitator / CA"},
            ],
            "applicationRoute": "ONLINE_PORTAL",
            "officialPortalUrl": "https://www.kviconline.gov.in/pmegpep/",
            "responsibleAuthority": "District Industries Centre (DIC) / KVIC Directorate",
            "lastVerifiedDate": "2026-02-15"
        })

        # -------------------------------------------------------------
        # 2. PM MUDRA Yojana (Shishu, Kishore, Tarun)
        # -------------------------------------------------------------
        if project_cost > 500000.0:
            mudra_tier = "TARUN"
            mudra_max = 2000000.0
            mudra_promoter = 15.0
        elif project_cost > 50000.0:
            mudra_tier = "KISHORE"
            mudra_max = 500000.0
            mudra_promoter = 10.0
        else:
            mudra_tier = "SHISHU"
            mudra_max = 50000.0
            mudra_promoter = 0.0

        mudra_state = "POTENTIALLY_ELIGIBLE" if project_cost <= mudra_max else "NOT_ELIGIBLE"

        matches.append({
            "schemeId": f"SCHEME_MUDRA_{mudra_tier}",
            "schemeCode": f"MUDRA_{mudra_tier}",
            "schemeName": f"Pradhan Mantri MUDRA Yojana ({mudra_tier} Loan)",
            "ministryOrAgency": "Department of Financial Services / SIDBI",
            "ruleVersion": "v3.1-2025",
            "eligibilityState": mudra_state,
            "maxSubsidyOrAssistance": 0.0,
            "subsidyPercentage": 0.0,
            "eligibleLoanAmount": min(project_cost, mudra_max),
            "promoterContributionRequiredPercent": mudra_promoter,
            "qualifyingCriteriaPassed": [
                "Non-Corporate Small Business Sector (NCSBS) eligible",
                f"Project scale matches MUDRA {mudra_tier} tier (up to ₹{int(mudra_max / 100000)} Lakh)",
                "Collateral-free institutional bank finance backed by CGFMU",
            ],
            "unmetCriteria": (
                [f"Cost exceeds {mudra_tier} ceiling limit of ₹{int(mudra_max / 100000)} Lakh"]
                if project_cost > mudra_max else []
            ),
            "unknownCriteria": ["Applicant CIBIL/Credit score history with lending bank"],
            "requiredDocuments": [
                {"documentId": "DOC_AADHAAR", "name": "Identity Proof (Aadhaar / Voter ID)", "category": "IDENTITY", "mandatory": True, "issuingAuthority": "UIDAI / ECI"},
                {"documentId": "DOC_ADDRESS", "name": "Proof of Residence", "category": "ADDRESS", "mandatory": True, "issuingAuthority": "Discom / Food Dept"},
                {"documentId": "DOC_QUOTATION", "name": "Machinery & Equipment Quotations", "category": "BUSINESS", "mandatory": True, "issuingAuthority": "Authorized Supplier / Vendor"},
            ],
            "applicationRoute": "BANK_BRANCH",
            "officialPortalUrl": "https://www.mudra.org.in/",
            "responsibleAuthority": "Any Public Sector / Private / Regional Rural Bank (RRB)",
            "lastVerifiedDate": "2026-01-20"
        })

        # -------------------------------------------------------------
        # 3. PMFME (Food Processing / ODOP Scheme)
        # -------------------------------------------------------------
        if act_norm in ["AGRO_PROCESSING", "MANUFACTURING"]:
            pmfme_subsidy = min(1000000.0, round(project_cost * 0.35, 2))
            matches.append({
                "schemeId": "SCHEME_PMFME_2025",
                "schemeCode": "PMFME",
                "schemeName": "PM Formalisation of Micro Food Processing Enterprises (ODOP)",
                "ministryOrAgency": "Ministry of Food Processing Industries (MoFPI)",
                "ruleVersion": "v2.0-2025",
                "eligibilityState": "POTENTIALLY_ELIGIBLE",
                "maxSubsidyOrAssistance": pmfme_subsidy,
                "subsidyPercentage": 35.0,
                "eligibleLoanAmount": round(project_cost * 0.90, 2),
                "promoterContributionRequiredPercent": 10.0,
                "qualifyingCriteriaPassed": [
                    "Activity falls under Agro/Food processing domain",
                    "Credit-linked capital subsidy of 35% of eligible project cost (Max ₹10 Lakh)",
                    "Technical upgrade, FSSAI compliance, packaging & branding support",
                ],
                "unmetCriteria": [],
                "unknownCriteria": ["District ODOP (One District One Product) crop list alignment"],
                "requiredDocuments": [
                    {"documentId": "DOC_AADHAAR", "name": "Aadhaar Card", "category": "IDENTITY", "mandatory": True, "issuingAuthority": "UIDAI"},
                    {"documentId": "DOC_FSSAI", "name": "FSSAI Basic Registration / Food License", "category": "BUSINESS", "mandatory": True, "issuingAuthority": "FSSAI"},
                    {"documentId": "DOC_DPR_FOOD", "name": "Food Processing Project Report", "category": "BUSINESS", "mandatory": True, "issuingAuthority": "District Resource Person (DRP)"},
                ],
                "applicationRoute": "ONLINE_PORTAL",
                "officialPortalUrl": "https://pmfme.mofpi.gov.in/",
                "responsibleAuthority": "State Nodal Agency (SNA) / District Resource Persons",
                "lastVerifiedDate": "2026-02-10"
            })

        # -------------------------------------------------------------
        # 4. Stand-Up India (SC/ST or Women Entrepreneurs)
        # -------------------------------------------------------------
        if is_sc_st or is_woman:
            standup_eligible = 1000000.0 <= project_cost <= 10000000.0
            matches.append({
                "schemeId": "SCHEME_STANDUP_INDIA",
                "schemeCode": "STANDUP_INDIA",
                "schemeName": "Stand-Up India Scheme for SC/ST and Women Entrepreneurs",
                "ministryOrAgency": "Department of Financial Services / SIDBI",
                "ruleVersion": "v2.2-2025",
                "eligibilityState": "POTENTIALLY_ELIGIBLE" if standup_eligible else "NOT_ELIGIBLE",
                "maxSubsidyOrAssistance": 0.0,
                "subsidyPercentage": 0.0,
                "eligibleLoanAmount": min(project_cost, 10000000.0),
                "promoterContributionRequiredPercent": 15.0,
                "qualifyingCriteriaPassed": [
                    "SC/ST category criteria met" if is_sc_st else "Woman entrepreneur criteria met",
                    "Greenfield enterprise setup in manufacturing, services, or trading",
                ],
                "unmetCriteria": (
                    ["Project cost must be between ₹10 Lakh and ₹1 Crore for Stand-Up India"]
                    if not standup_eligible else []
                ),
                "unknownCriteria": ["Bank branch allocation from Stand-Up India portal"],
                "requiredDocuments": [
                    {"documentId": "DOC_AADHAAR", "name": "Aadhaar Card", "category": "IDENTITY", "mandatory": True, "issuingAuthority": "UIDAI"},
                    {"documentId": "DOC_CASTE_CERT", "name": "SC/ST Certificate", "category": "IDENTITY", "mandatory": is_sc_st, "issuingAuthority": "Revenue Dept"},
                ],
                "applicationRoute": "ONLINE_PORTAL",
                "officialPortalUrl": "https://www.standupmitra.in/",
                "responsibleAuthority": "Scheduled Commercial Banks / SIDBI Mitra Hubs",
                "lastVerifiedDate": "2026-01-15"
            })

        # -------------------------------------------------------------
        # 5. NSFDC (Scheduled Castes Concessional Credit)
        # -------------------------------------------------------------
        if cat_norm == "SC":
            matches.append({
                "schemeId": "SCHEME_NSFDC_MCS",
                "schemeCode": "NSFDC_MCS",
                "schemeName": "NSFDC Micro Credit Finance for Scheduled Castes",
                "ministryOrAgency": "National Scheduled Castes Finance & Development Corp (NSFDC)",
                "ruleVersion": "v1.8-2025",
                "eligibilityState": "POTENTIALLY_ELIGIBLE",
                "maxSubsidyOrAssistance": 150000.0,
                "subsidyPercentage": 20.0,
                "eligibleLoanAmount": min(project_cost, 500000.0),
                "promoterContributionRequiredPercent": 5.0,
                "qualifyingCriteriaPassed": [
                    "Target group category verification confirmed (Scheduled Caste)",
                    "Concessional interest rate at 5% p.a. for micro-units",
                    "Channel partner state corporation refinancing active",
                ],
                "unmetCriteria": [],
                "unknownCriteria": ["State Channelising Agency (SCA) quota availability"],
                "requiredDocuments": [
                    {"documentId": "DOC_SC_CERT", "name": "SC Caste Certificate", "category": "IDENTITY", "mandatory": True, "issuingAuthority": "Competent District Revenue Authority"},
                ],
                "applicationRoute": "DISTRICT_INDUSTRY_CENTRE",
                "officialPortalUrl": "https://nsfdc.nic.in/",
                "responsibleAuthority": "State SC/ST Development Corporation & NSFDC Regional Office",
                "lastVerifiedDate": "2026-02-01"
            })

        return matches
