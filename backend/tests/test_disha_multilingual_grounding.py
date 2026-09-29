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

