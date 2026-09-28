"""
GRAM-DISHA — End-to-End OpenAI Whisper Speech Intelligence Verification
Team ERGON — Smart India Hackathon 2026
"""

import os
import io
import wave
import struct
import math
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.domains.whisper.service import WhisperService, INDIC_LANG_MAP

client = TestClient(app)

def create_synthetic_wav_bytes(duration_sec: float = 1.0, freq: float = 440.0, is_silent: bool = False) -> bytes:
    """Helper to generate a real, valid WAV binary."""
    buf = io.BytesIO()
    with wave.open(buf, "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(16000)
        n_samples = int(16000 * duration_sec)
        samples = []
        for i in range(n_samples):
            if is_silent:
                val = 0
            else:
                val = int(32767.0 * 0.4 * math.sin(2.0 * math.pi * freq * i / 16000))
            samples.append(struct.pack("<h", val))
        f.writeframes(b"".join(samples))
    return buf.getvalue()


class TestWhisperPipeline:

    def test_01_api_authentication_and_config(self):
        """Verify API config endpoint reports correct model and supported languages without leaking keys."""
        res = client.get("/api/v1/whisper/config")
        assert res.status_code == 200
        data = res.json()
        assert "has_api_key" in data
        assert data["model"] == "whisper-1"
        assert data["supported_languages_count"] >= 22
        # Ensure secret key is NEVER exposed in the config payload
        assert "sk-" not in str(data)
        assert "api_key" not in data or data.get("api_key") is None

    def test_02_empty_audio_rejection(self):
        """Verify empty audio upload is rejected with 400 NO_AUDIO."""
        files = {"file": ("empty.wav", b"", "audio/wav")}
        res = client.post("/api/v1/whisper/transcribe", files=files)
        assert res.status_code == 400
        data = res.json()
        assert data["detail"]["error_code"] == "NO_AUDIO"

    def test_03_intent_extraction_layer(self):
        """Verify Disha NLP deterministic intent & entity extraction from voice transcript."""
        # Test 1: Scheme Eligibility
        res1 = client.post("/api/v1/whisper/intent", json={
            "transcript": "यवतमाल मध्ये मिनी डाळ मिल साठी PMEGP योजना अनुदान काय आहे?",
            "language": "mr",
            "district": "Yavatmal"
        })
        assert res1.status_code == 200
        data1 = res1.json()
        assert data1["intent"] == "SCHEME_ELIGIBILITY"
        assert data1["confidence"] >= 0.9
        assert data1["entities"]["schemeName"] == "PMEGP"
        assert len(data1["suggested_actions"]) > 0

        # Test 2: Market Price Inquiry
        res2 = client.post("/api/v1/whisper/intent", json={
            "transcript": "Show me APMC mandi modal price for chana in Pusad",
            "language": "en",
            "district": "Yavatmal"
        })
        assert res2.status_code == 200
        data2 = res2.json()
        assert data2["intent"] == "MARKET_PRICE_INQUIRY"
        assert data2["entities"]["commodityName"] == "Desi Chana"

        # Test 3: Irreversible confirmation action
        res3 = client.post("/api/v1/whisper/intent", json={
            "transcript": "I want to submit and apply now for this loan",
            "language": "en"
        })
        assert res3.status_code == 200
        data3 = res3.json()
        assert data3["requires_confirmation"] is True
        assert data3["intent"] == "CONFIRMATION_REQUIRED_ACTION"

    def test_04_indic_languages_registry(self):
        """Verify 22+ Scheduled Indian Languages mappings."""
        for code in ["hi", "mr", "ta", "te", "bn", "gu", "kn", "ml", "pa", "ur"]:
            assert code in INDIC_LANG_MAP
            assert "name" in INDIC_LANG_MAP[code]
            assert "script" in INDIC_LANG_MAP[code]

    def test_05_real_openai_api_invocation(self):
        """
        Invokes the real OpenAI Whisper API with real audio binary.
        Verifies actual response and handles exact OpenAI quota/error response.
        """
        wav_data = create_synthetic_wav_bytes(duration_sec=1.2, freq=500.0)
        files = {"file": ("test_voice.wav", wav_data, "audio/wav")}
        
        res = client.post(
            "/api/v1/whisper/transcribe",
            files=files,
            data={"language": "en", "temperature": 0.0}
        )

        # The real OpenAI API was invoked.
        # If the account credit balance is active: status is 200
        # If the account quota is exhausted (credit_balance_exhausted): status is 429 with QUOTA_EXCEEDED
        if res.status_code == 200:
            data = res.json()
            assert "text" in data
            assert "language" in data
            assert "segments" in data
            assert "words" in data
        elif res.status_code == 429:
            data = res.json()
            assert data["detail"]["error_code"] == "QUOTA_EXCEEDED"
            assert "credits" in data["detail"]["message"].lower() or "quota" in data["detail"]["message"].lower()
        elif res.status_code == 400 and res.json().get("detail", {}).get("error_code") == "OPENAI_KEY_MISSING":
            pytest.skip("OPENAI_API_KEY not configured in environment")
        else:
            pytest.fail(f"Unexpected status from real OpenAI Whisper call: {res.status_code} - {res.text}")
