from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from datetime import datetime, timedelta
import logging
import os

# ── Logging ───────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ── App setup ─────────────────────────────────────────────────
app = FastAPI(title="HMS AI Microservice", version="1.0.0")

# CORS origins from environment variable — no hardcoded localhost
_raw_origins = os.getenv("AI_CORS_ORIGINS", "http://localhost")
CORS_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── AI model (lazy-loaded, graceful fallback) ─────────────────
summarizer = None
try:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    logger.info("Summarization model loaded successfully")
except Exception as exc:
    logger.warning("Summarization model unavailable — using rule-based fallback: %s", exc)

# ── Request models ────────────────────────────────────────────
class ChatMessage(BaseModel):
    message: str

class SummarizeRequest(BaseModel):
    text: str

class AppointmentSuggestionRequest(BaseModel):
    patient_id: int
    preferred_specialization: str | None = None
    preferred_time: str | None = None
    urgency: str = "normal"   # low | normal | high | emergency

# ── Static data ───────────────────────────────────────────────
DOCTORS_DATA = [
    {"id": 1, "name": "Dr. Sarah Smith",    "specialization": "Cardiology",    "availability": "morning"},
    {"id": 2, "name": "Dr. Michael Johnson","specialization": "Neurology",     "availability": "afternoon"},
    {"id": 3, "name": "Dr. Emily Davis",    "specialization": "Pediatrics",    "availability": "morning"},
    {"id": 4, "name": "Dr. Robert Wilson",  "specialization": "Orthopedics",   "availability": "evening"},
    {"id": 5, "name": "Dr. Lisa Anderson",  "specialization": "Dermatology",   "availability": "afternoon"},
]

FAQ_RESPONSES = {
    "appointment":      "To book an appointment, go to the Appointments section and click 'Book New Appointment'. Select your preferred doctor and available time slot.",
    "payment":          "You can view and pay your bills in the Bills section. We accept credit cards, debit cards, and online banking.",
    "medical records":  "Your medical records are available in the Medical Records section. You can view your history and download reports there.",
    "contact":          "You can reach us at: Phone: +1234567890, Email: info@hospital.com, Address: 123 Hospital Street, Medical City.",
    "doctors":          "You can view all available doctors in the Doctors section. Filter by specialization to find the right doctor.",
    "emergency":        "For emergencies, please call 911 immediately or visit our Emergency Department.",
    "hours":            "Regular clinic hours are Monday–Friday 8 AM–6 PM, Saturday 9 AM–4 PM. Emergency services are available 24/7.",
    "insurance":        "We accept most major insurance plans. Please bring your insurance card to your appointment.",
}

# ── Routes ────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"message": "HMS AI Microservice is running", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models": {"summarizer": summarizer is not None},
    }


@app.post("/chat")
async def chat_with_bot(request: ChatMessage):
    """Keyword-based chatbot for common hospital questions."""
    try:
        message = request.message.lower().strip()

        for keyword, response in FAQ_RESPONSES.items():
            if keyword in message:
                return {"response": response, "confidence": 0.95, "type": "faq"}

        if any(g in message for g in ["hello", "hi", "hey", "good morning", "good afternoon"]):
            return {
                "response": "Hello! I'm your HMS AI Assistant. How can I help you today?",
                "confidence": 0.9,
                "type": "greeting",
            }

        if any(t in message for t in ["thank", "thanks"]):
            return {
                "response": "You're welcome! Is there anything else I can help you with?",
                "confidence": 0.9,
                "type": "gratitude",
            }

        return {
            "response": "I can help with appointments, payments, medical records, doctors, emergencies, hours, and insurance. What would you like to know?",
            "confidence": 0.7,
            "type": "default",
            "suggestions": ["Book appointment", "Payment info", "Doctor availability", "Emergency contact"],
        }

    except Exception as exc:
        logger.error("Error in /chat: %s", exc)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/summarize")
async def summarize_report(request: SummarizeRequest):
    """AI-powered (or rule-based fallback) medical report summarisation."""
    try:
        text = request.text

        if not summarizer:
            sentences = text.split(". ")
            summary = (
                text if len(sentences) <= 3
                else f"{sentences[0]}. {sentences[len(sentences) // 2]}. {sentences[-1]}"
            )
            return {
                "original_length": len(text),
                "summary": summary,
                "summary_length": len(summary),
                "method": "rule_based",
            }

        if len(text) < 50:
            return {
                "original_length": len(text),
                "summary": text,
                "summary_length": len(text),
                "method": "no_summary_needed",
            }

        result  = summarizer(text, max_length=150, min_length=30, do_sample=False)
        summary = result[0]["summary_text"]
        return {
            "original_length": len(text),
            "summary": summary,
            "summary_length": len(summary),
            "method": "ai_model",
        }

    except Exception as exc:
        logger.error("Error in /summarize: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to generate summary")


@app.post("/suggest-appointments")
async def suggest_appointments(request: AppointmentSuggestionRequest):
    """Heuristic appointment slot suggestions for the next 7 days."""
    try:
        doctors = DOCTORS_DATA
        if request.preferred_specialization:
            doctors = [
                d for d in doctors
                if request.preferred_specialization.lower() in d["specialization"].lower()
            ]

        now = datetime.now()
        suggestions = []

        for doctor in doctors[:3]:
            for day in range(1, 8):
                date = now + timedelta(days=day)
                if date.weekday() >= 5 and request.urgency == "normal":
                    continue

                slots = {
                    "morning":   ["09:00", "10:00", "11:00"],
                    "afternoon": ["14:00", "15:00", "16:00"],
                    "evening":   ["17:00", "18:00", "19:00"],
                }.get(doctor["availability"], ["09:00"])

                for slot in slots:
                    score = 1.0
                    score += {"high": 0.5, "emergency": 1.0}.get(request.urgency, 0)
                    if day <= 2:
                        score += 0.3
                    suggestions.append({
                        "doctor_id":              doctor["id"],
                        "doctor_name":            doctor["name"],
                        "specialization":         doctor["specialization"],
                        "appointment_datetime":   f"{date.strftime('%Y-%m-%d')} {slot}",
                        "priority_score":         score,
                        "availability_confidence": 0.85,
                    })

        suggestions.sort(key=lambda x: x["priority_score"], reverse=True)
        return {
            "suggestions": suggestions[:10],
            "total_suggestions": len(suggestions),
            "criteria_used": {
                "specialization":  request.preferred_specialization,
                "urgency":         request.urgency,
                "preferred_time":  request.preferred_time,
            },
        }

    except Exception as exc:
        logger.error("Error in /suggest-appointments: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to generate appointment suggestions")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
