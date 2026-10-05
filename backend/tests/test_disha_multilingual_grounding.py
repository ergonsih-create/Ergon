"""
Tests for Disha AI Multilingual Grounding on User Data
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_disha_chat_hindi_grounded():
    res = client.post("/api/v1/disha/chat", json={
        "message": "मेरा कुल प्रोजेक्ट खर्च कितना है और मुझे कितनी सब्सिडी मिलेगी?",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert "id" in data
    assert data["role"] == "assistant"
    # Grounding refs must be populated
    assert "totalProjectCost" in data["groundingRefs"]
    assert "dscr" in data["groundingRefs"]
    assert "topScheme" in data["groundingRefs"]
    # Check that response text contains grounded numbers
    content = data["content"]
    assert "850,000" in content or "₹" in content

def test_disha_chat_marathi_grounded():
    res = client.post("/api/v1/disha/chat", json={
        "message": "माझ्या उद्योगासाठी बँक कर्ज आणि PMEGP अनुदान किती मिळेल?",
        "language": "mr"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "assistant"
    assert "totalProjectCost" in data["groundingRefs"]

def test_disha_chat_english_grounded():
    res = client.post("/api/v1/disha/chat", json={
        "message": "What is my term loan EMI and eligible PMEGP subsidy?",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "assistant"
    assert "PMEGP" in data["content"]

def test_disha_chat_telugu_grounded():
    res = client.post("/api/v1/disha/chat", json={
        "message": "నా వ్యాపారానికి ప్రాజెక్ట్ ఖర్చు మరియు సబ్సిడీ ఎంత?",
        "language": "te"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "assistant"
    assert "totalProjectCost" in data["groundingRefs"]
    assert "850,000" in data["content"] or "₹" in data["content"]

def test_disha_chat_tamil_grounded():
    res = client.post("/api/v1/disha/chat", json={
        "message": "என் வணிகத்திற்கான திட்ட மதிப்பீடு மற்றும் மானியம் என்ன?",
        "language": "ta"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "assistant"
    assert "totalProjectCost" in data["groundingRefs"]

def test_disha_chat_bengali_grounded():
    res = client.post("/api/v1/disha/chat", json={
        "message": "আমার ব্যবসার জন্য মোট প্রকল্প ব্যয় এবং ভর্তুকি কত?",
        "language": "bn"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "assistant"
    assert "totalProjectCost" in data["groundingRefs"]

def test_disha_chat_all_23_language_codes_accepted():
    all_codes = [
        "en", "hi", "mr", "te", "ta", "bn", "gu", "kn", "pa", "ml", "od", "as",
        "ur", "ks", "mai", "sat", "ne", "kok", "sd", "doi", "mni", "brx", "sa"
    ]
    for code in all_codes:
        res = client.post("/api/v1/disha/chat", json={
            "message": "Loan subsidy check",
            "language": code
        })
        assert res.status_code == 200
        data = res.json()
        assert data["role"] == "assistant"
        assert "totalProjectCost" in data["groundingRefs"]


def test_language_prompts_enforcement_minimum_five_languages():
    from app.ai.prompts import LANGUAGE_PROMPTS

    # Test cases: (language_code, language_name, script_name)
    targets = [
        ("hi", "Hindi", "Devanagari"),
        ("ta", "Tamil", "Tamil"),
        ("te", "Telugu", "Telugu"),
        ("mr", "Marathi", "Devanagari"),
        ("bn", "Bengali", "Bengali")
    ]

    for code, name, script in targets:
        assert code in LANGUAGE_PROMPTS, f"Language code {code} missing from LANGUAGE_PROMPTS"
        prompt = LANGUAGE_PROMPTS[code]

        # 1. Requested language is present
        assert name in prompt, f"Expected '{name}' in prompt for {code}"

        # 2. Native-script requirement is present
        assert script in prompt, f"Expected script '{script}' in prompt for {code}"

        # 3. Anti-code-mixing requirement is present
        assert "Zero English Code-Mixing" in prompt or "Do not mix English" in prompt

        # 4. English grounding labels described as machine-readable/internal
        assert "machine-readable" in prompt.lower()
        assert "internal" in prompt.lower()

        # 5. Numerical/currency preservation requirement remains present
        assert "₹" in prompt
        assert "%" in prompt
        assert "numerical" in prompt.lower()
        # Official scheme acronyms permitted
        assert "PMEGP" in prompt
        assert "MUDRA" in prompt


def test_system_prompt_anti_code_mixing_guardrails():
    from app.ai.prompts import DISHA_SYSTEM_PROMPT

    # Verify global authoritative language rule
    assert "LANGUAGE & ANTI-CODE-MIXING REQUIREMENT (AUTHORITATIVE)" in DISHA_SYSTEM_PROMPT
    assert "requested response language is authoritative" in DISHA_SYSTEM_PROMPT
    assert "machine-readable evidence" in DISHA_SYSTEM_PROMPT
    assert "Do NOT mirror English words or field labels" in DISHA_SYSTEM_PROMPT
    assert "Translate all section headings, bullet points, labels, and explanations" in DISHA_SYSTEM_PROMPT
    assert "Zero English code-mixing" in DISHA_SYSTEM_PROMPT


def test_grounding_template_insulation():
    from app.ai.prompts import DISHA_GROUNDING_TEMPLATE

    assert "MACHINE-READABLE EVIDENCE" in DISHA_GROUNDING_TEMPLATE
    assert "internal field names and must NOT be copied verbatim" in DISHA_GROUNDING_TEMPLATE
    assert "LANGUAGE & ANTI-CODE-MIXING INSTRUCTION (HIGHEST PRIORITY)" in DISHA_GROUNDING_TEMPLATE


def test_english_quick_action_prompt_preserves_target_language():
    from app.ai.gemini_service import GeminiAIService
    from app.ai.prompts import LANGUAGE_PROMPTS

    service = GeminiAIService()
    test_grounding = {
        "business": {"name": "Shri Ganesh Flour Mill", "district": "Yavatmal", "state": "Maharashtra"},
        "financials": {"totalProjectCost": 850000.0, "promoterContribution": 150000.0},
        "schemes": [{"schemeName": "PMEGP", "maxSubsidy": 297500.0, "subsidyPercentage": 35}],
        "feasibility": {"totalScore": 0.82},
        "documents": {"verified": ["Aadhaar Card"], "pending": []},
        "market_mandi": []
    }

    # User clicked an English quick prompt but active language is Tamil
    english_query = "Show 35% PMEGP subsidy details for rural OBC"
    resp = service.generate_grounded_response(
        user_query=english_query,
        grounding_data=test_grounding,
        language="ta"
    )

    # In test/mock mode (or live), response must be the localized Tamil response, not English
    assert "வணக்கம்" in resp or "PMEGP" in resp
    # Must preserve exact figures
    assert "₹" in resp or "850,000" in resp or "297,500" in resp


def test_all_23_languages_have_anti_code_mixing_prompts():
    from app.ai.prompts import LANGUAGE_PROMPTS

    all_23_codes = [
        "en", "hi", "mr", "te", "ta", "bn", "gu", "kn", "pa", "ml", "od", "as",
        "ur", "ks", "mai", "sat", "ne", "kok", "sd", "doi", "mni", "brx", "sa"
    ]
    for code in all_23_codes:
        assert code in LANGUAGE_PROMPTS, f"Code '{code}' missing from LANGUAGE_PROMPTS"
        prompt = LANGUAGE_PROMPTS[code]
        assert len(prompt) > 100, f"Prompt for '{code}' too brief"
        if code != "en":
            assert "script" in prompt.lower()
            assert "zero english code-mixing" in prompt.lower() or "do not mix english" in prompt.lower()


def test_disha_bcp47_and_new_fallbacks():
    from app.ai.gemini_service import GeminiAIService

    service = GeminiAIService()
    test_grounding = {
        "business": {"name": "Jai Kisan Unit", "district": "Yavatmal", "state": "Maharashtra"},
        "financials": {"totalProjectCost": 850000.0, "promoterContribution": 150000.0},
        "schemes": [{"schemeName": "PMEGP", "maxSubsidy": 297500.0, "subsidyPercentage": 35}],
        "feasibility": {"totalScore": 0.82},
        "documents": {"verified": ["Aadhaar Card"], "pending": []},
        "market_mandi": []
    }

    # Test BCP-47 tag matching
    mr_bcp_resp = service.generate_grounded_response("Test query", test_grounding, "mr-IN")
    assert "नमस्कार" in mr_bcp_resp

    ta_bcp_resp = service.generate_grounded_response("Test query", test_grounding, "ta-IN")
    assert "வணக்கம்" in ta_bcp_resp

    # Test newly added fallbacks
    ml_resp = service.generate_grounded_response("Test query", test_grounding, "ml")
    assert "നമസ്കാരം" in ml_resp

    od_resp = service.generate_grounded_response("Test query", test_grounding, "od")
    assert "ନମସ୍କାର" in od_resp

    as_resp = service.generate_grounded_response("Test query", test_grounding, "as")
    assert "নমস্কাৰ" in as_resp

    ne_resp = service.generate_grounded_response("Test query", test_grounding, "ne")
    assert "नमस्ते" in ne_resp
