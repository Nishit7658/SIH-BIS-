import re
import time
import httpx
from typing import Dict, Any, List, Optional
from backend.config import GEMINI_API_KEY
from backend.database import STANDARDS_DB

OUT_OF_SCOPE_TRIGGERS = [
    "traffic fine", "motor vehicle act", "prescription", "paracetamol", "dosage",
    "stock market", "weather tomorrow", "recipe", "ipl match", "movie review",
    "income tax slab", "driving license rto", "passport renewal"
]

ADVERSARIAL_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|prior)\s+instructions",
    r"you\s+are\s+now\s+(an?\s+)?unrestricted",
    r"system\s+override",
    r"jailbreak",
    r"generate\s+a\s+valid\s+(isi|bis|cml|cml-)\s+license",
    r"grant\s+me\s+(an?\s+)?(official\s+)?(bis|isi)\s+certificate",
    r"bypass\s+(safety|testing|compliance)",
    r"waive\s+clause",
    r"dan\s+mode",
    r"prompt\s+injection"
]

OFFICIAL_BIS_PORTAL_BASE = "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"

def evaluate_prompt_guardrail(raw_input: str) -> Dict[str, Any]:
    # 1. Strip zero-width control chars
    sanitized = re.sub(r"[\u200B-\u200D\uFEFF\u200E\u200F\u0000-\u0008\u000B\u000C\u000E-\u001F]", "", raw_input).strip()

    if len(sanitized) > 2000:
        return {"passed": False, "blockedReason": "Query exceeds maximum limit of 2000 characters.", "sanitizedInput": sanitized[:2000]}

    lowered = sanitized.lower()
    for pattern in ADVERSARIAL_PATTERNS:
        if re.search(pattern, lowered):
            return {
                "passed": False,
                "blockedReason": "Query matches restricted pattern: Attempt to bypass BIS statutory compliance or forge official credentials.",
                "sanitizedInput": sanitized
            }

    return {"passed": True, "blockedReason": None, "sanitizedInput": sanitized}

async def call_gemini_llm(prompt: str) -> Optional[str]:
    if not GEMINI_API_KEY:
        return None

    models = [
        "gemini-flash-lite-latest",
        "gemini-pro-latest"
    ]

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 1024}
    }

    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            for model in models:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
                try:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                return parts[0].get("text", "").strip()
                except Exception:
                    continue
    except Exception:
        pass
    return None

GREETING_TRIGGERS = ["hello", "hi", "hey", "namaste", "good morning", "good afternoon", "good evening", "help"]

class RagService:
    @staticmethod
    async def execute_rag_query(raw_query: str) -> Dict[str, Any]:
        start_time = time.time()
        normalized = raw_query.strip().lower()

        # 0. Polite Greeting Handler
        if normalized in GREETING_TRIGGERS or any(normalized.startswith(g + " ") for g in GREETING_TRIGGERS):
            latency = int((time.time() - start_time) * 1000)
            return {
                "query": raw_query,
                "answer": (
                    "### Namaste! Welcome to the BIS Smart Digital Expert\n\n"
                    "I am your authoritative technical intelligence assistant for the **Bureau of Indian Standards (BIS)**.\n\n"
                    "How may I assist your regulatory inquiry today? You can ask about:\n"
                    "- **Indian Standards (IS)** (e.g., *IS 1293 for plugs*, *IS 17526 for vacuum flasks*, *IS 694 for cables*)\n"
                    "- **Mandatory Quality Control Orders (QCOs)** & statutory enforcement dates\n"
                    "- **Conformity Schemes** (Scheme I ISI Mark vs Scheme II CRS)\n"
                    "- **Factory Testing Setup** (Raw materials, manufacturing stages, and STI testing laboratory equipment)\n"
                    "- **License Verification** (CM/L 10-digit registration numbers)"
                ),
                "citations": [],
                "confidence": 1.0,
                "isAbstained": False,
                "cached": False,
                "costTier": "fast_tier",
                "latencyMs": latency,
                "relevantStandards": []
            }

        # 1. Out-of-Scope Trigger Check (Strict Abstention per Rule 20)
        if any(t in normalized for t in OUT_OF_SCOPE_TRIGGERS):
            latency = int((time.time() - start_time) * 1000)
            return {
                "query": raw_query,
                "answer": (
                    "### Strict Regulatory Notice\n\n"
                    "This inquiry falls outside the statutory scope of the **Bureau of Indian Standards (BIS)**.\n\n"
                    "I am an authoritative compliance assistant specifically grounded in Indian Standards (IS), "
                    "Quality Control Orders (QCOs), and factory testing blueprints. I could not find sufficient "
                    "information in the available BIS documents to address non-standards matters."
                ),
                "citations": [],
                "confidence": 1.0,
                "isAbstained": True,
                "abstainReason": "OUT_OF_SCOPE_REGULATORY_QUERY",
                "cached": False,
                "costTier": "fast_tier",
                "latencyMs": latency,
                "relevantStandards": []
            }

        # 2. Tokenize search terms
        search_terms = [t for t in re.sub(r"[^\w\s]", " ", normalized).split() if len(t) > 2]
        if not search_terms:
            search_terms = [t for t in normalized.split() if len(t) > 1]

        scored_clauses = []
        for std in STANDARDS_DB:
            std_code = std.get("code", "").lower()
            std_text = f"{std_code} {std.get('title', '')} {' '.join(std.get('businessTypes', []))} {' '.join(std.get('keywords', []))} {std.get('summary', '')}".lower()
            std_score = 0

            # Check for exact code match or term match
            for term in search_terms:
                if term in std_code:
                    std_score += 60
                elif term in std_text:
                    std_score += 12

            for clause in std.get("clauses", []):
                cl_num = clause.get("number", "").lower()
                cl_title = clause.get("title", "").lower()
                cl_content = clause.get("content", "").lower()
                cl_text = f"{cl_num} {cl_title} {cl_content}".replace("-", " ")

                cl_score = std_score
                for term in search_terms:
                    if term in cl_num:
                        cl_score += 40
                    if term in cl_title:
                        cl_score += 25
                    if term in cl_text:
                        cl_score += 15

                if cl_score > 0:
                    scored_clauses.append((cl_score, std, clause))

        scored_clauses.sort(key=lambda x: x[0], reverse=True)
        top_clauses = scored_clauses[:4]

        # 3. If no relevant clauses found -> Grounded Abstention
        if not top_clauses:
            latency = int((time.time() - start_time) * 1000)
            return {
                "query": raw_query,
                "answer": (
                    "### Regulatory Finding\n\n"
                    "I could not find sufficient verified technical specifications in the active Bureau of Indian Standards "
                    "catalog matching your exact query. To maintain strict conformity integrity under the BIS Act 2016, "
                    "I abstain from speculating without a gazetted clause reference. Please verify on the official e-BIS portal."
                ),
                "citations": [],
                "confidence": 0.3,
                "isAbstained": True,
                "abstainReason": "NO_MATCHING_STANDARDS_FOUND",
                "cached": False,
                "costTier": "fast_tier",
                "latencyMs": latency,
                "relevantStandards": []
            }

        # 4. Form Citations
        citations = []
        context_snippets = []
        for score, std, clause in top_clauses:
            citations.append({
                "standardCode": std["code"],
                "standardTitle": std["title"],
                "clauseNumber": clause["number"],
                "clauseTitle": clause["title"],
                "snippet": clause["content"],
                "standardId": std["id"],
                "officialBisUrl": OFFICIAL_BIS_PORTAL_BASE
            })
            context_snippets.append(
                f"- Standard: {std['code']} ({std['title']})\n"
                f"  Clause: {clause['number']} - {clause['title']}\n"
                f"  Requirement: {clause['content']}\n"
                f"  Test Method: {clause.get('testRequirement') or clause.get('testMethod') or 'Standard STI Procedure'}"
            )

        context_text = "\n\n".join(context_snippets)

        # 5. LLM Prompt Construction with Strict Grounding
        prompt = (
            "You are the official Bureau of Indian Standards (BIS) Smart Digital Expert.\n"
            "Answer the user's technical inquiry strictly using ONLY the verified BIS clauses provided below.\n"
            "Rules:\n"
            "1. Cite the exact IS code and clause numbers.\n"
            "2. Do NOT invent or speculate values outside the provided context.\n"
            "3. Format your response cleanly with clear headings and bullet points.\n\n"
            f"=== VERIFIED BIS CONTEXT ===\n{context_text}\n\n"
            f"=== USER INQUIRY ===\n{raw_query}\n\n"
            "=== OFFICIAL ADVISORY RESPONSE ==="
        )

        llm_answer = await call_gemini_llm(prompt)

        if not llm_answer:
            # Deterministic offline synthesis
            primary_std = top_clauses[0][1]
            primary_cl = top_clauses[0][2]
            llm_answer = (
                f"### Bureau of Indian Standards (BIS) Technical Advisory\n\n"
                f"**Standard Code:** {primary_std['code']}\n"
                f"**Title:** {primary_std['title']}\n\n"
                f"**Governing Clause:** {primary_cl['number']} — {primary_cl['title']}\n\n"
                f"{primary_cl['content']}\n\n"
                f"**Mandatory Testing & Quality Requirements:**\n"
                f"- **Test Method:** {primary_cl.get('testRequirement') or primary_cl.get('testMethod') or 'Conforming to BIS Scheme of Testing & Inspection (STI)'}\n"
                f"- **Conformity Scheme:** {primary_std.get('scheme', 'Scheme I (ISI Mark)')}\n"
                f"- **Regulatory Status:** {'Mandatory Quality Control Order (QCO) Enforced' if primary_std.get('isMandatory') else 'Voluntary Indian Standard'}\n\n"
                f"For full legal conformity or application under Form V, consult the official e-BIS portal at services.bis.gov.in."
            )

        latency = int((time.time() - start_time) * 1000)
        return {
            "query": raw_query,
            "answer": llm_answer,
            "citations": citations,
            "confidence": 0.98,
            "isAbstained": False,
            "cached": False,
            "costTier": "fast_tier",
            "latencyMs": latency,
            "relevantStandards": [top_clauses[0][1]]
        }
