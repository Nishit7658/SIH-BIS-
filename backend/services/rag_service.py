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

        # 2. Tokenize search terms & detect domain context
        search_terms = [t for t in re.sub(r"[^\w\s]", " ", normalized).split() if len(t) > 2]
        if not search_terms:
            search_terms = [t for t in normalized.split() if len(t) > 1]

        METALLURGY_TERMS = {"steel", "iron", "tmt", "rebar", "alloy", "metal", "sheet", "pipe", "wire", "plate", "billet"}
        is_metallurgy = any(term in METALLURGY_TERMS for term in search_terms)

        scored_clauses = []
        for std in STANDARDS_DB:
            std_code = std.get("code", "").lower()
            std_title = std.get("title", "").lower()
            std_keywords = " ".join(std.get("keywords", [])).lower()
            std_biz = " ".join(std.get("businessTypes", [])).lower()
            std_summary = std.get("summary", "").lower()
            std_cat = f"{std.get('category', '')} {std.get('department', '')} {std.get('division', '')}".lower()

            std_score = 0
            for term in search_terms:
                if term in std_code:
                    std_score += 150
                if term in std_title:
                    std_score += 80
                if term in std_keywords:
                    std_score += 50
                if term in std_biz:
                    std_score += 35
                if term in std_cat:
                    std_score += 30
                if term in std_summary:
                    std_score += 20

            # Domain boost for primary structural & metallurgical standards over incidental utensils
            if is_metallurgy and ("metallurgical" in std_cat or "civil" in std_cat or "structural" in std_title or "bars" in std_title or "plate" in std_title):
                std_score += 40

            for clause in std.get("clauses", []):
                cl_num = clause.get("number", "").lower()
                cl_title = clause.get("title", "").lower()
                cl_content = clause.get("content", "").lower()

                # Clause inherits standard domain authority
                cl_score = std_score * 1.5

                for term in search_terms:
                    if term in cl_num:
                        cl_score += 60
                    if term in cl_title:
                        cl_score += 35
                    if term in cl_content:
                        cl_score += 20

                # High-density quantitative specifications bonus
                if any(u in cl_content for u in ["mpa", "kpa", "%", "mm", "kn", "table", "yield", "tensile"]):
                    cl_score += 15

                if cl_score > 0 and (std_score > 0 or any(term in cl_title or term in cl_content for term in search_terms)):
                    scored_clauses.append((cl_score, std, clause))

        scored_clauses.sort(key=lambda x: x[0], reverse=True)

        # Pick diverse top clauses across distinct standards (max 1-2 clauses per standard, up to 3 standards)
        top_clauses = []
        seen_standards = {}
        for score, std, cl in scored_clauses:
            code = std["code"]
            if seen_standards.get(code, 0) < 1 and len(top_clauses) < 3:
                top_clauses.append((score, std, cl))
                seen_standards[code] = seen_standards.get(code, 0) + 1

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

        # 5. LLM Prompt Construction with Strict Concise Format
        prompt = (
            "You are the official Bureau of Indian Standards (BIS) Smart Digital Expert.\n"
            "Answer the user's technical inquiry strictly using ONLY the verified BIS clauses provided below.\n\n"
            "STRICT FORMATTING REQUIREMENTS:\n"
            "1. Output format must ONLY be concise structured blocks in this exact format:\n\n"
            f"Greetings, I am the official Bureau of Indian Standards (BIS) Smart Digital Expert. Based on your inquiry regarding **{raw_query}**, here are the verified technical requirements from our official standards context:\n\n"
            "### **[Standard Code] ([Standard Title])**\n\n"
            "*   **[Clause Number] - [Clause Title]**\n"
            "    *   **Requirement:** [Concise technical limits, dimensions, or chemical/mechanical requirements strictly from context]\n"
            "    *   **Test Method:** [Exact test method, STI procedure, or apparatus strictly from context]\n\n"
            "2. If multiple standards are present, separate them with '---'.\n"
            "3. Do NOT include conversational filler, long paragraphs, or narrative conclusions. Keep the bullet points clean and executive.\n"
            "4. Never invent or speculate values outside the provided context.\n\n"
            f"=== VERIFIED BIS CONTEXT ===\n{context_text}\n\n"
            f"=== USER INQUIRY ===\n{raw_query}\n\n"
            "=== OFFICIAL ADVISORY RESPONSE ==="
        )

        llm_answer = await call_gemini_llm(prompt)

        if not llm_answer:
            # Deterministic offline synthesis matching the exact 4-bullet structure
            standards_shown = {}
            for _, std, cl in top_clauses:
                code = std["code"]
                if code not in standards_shown:
                    standards_shown[code] = {
                        "title": std["title"],
                        "clauses": []
                    }
                standards_shown[code]["clauses"].append(cl)

            blocks = []
            for code, s_data in standards_shown.items():
                cl_blocks = []
                for cl in s_data["clauses"]:
                    t_method = cl.get("testRequirement") or cl.get("testMethod") or "Standard STI Procedure"
                    cl_blocks.append(
                        f"*   **{cl['number']} - {cl['title']}**\n"
                        f"    *   **Requirement:** {cl['content']}\n"
                        f"    *   **Test Method:** {t_method}"
                    )
                blocks.append(f"### **{code} ({s_data['title']})**\n\n" + "\n\n".join(cl_blocks))

            llm_answer = (
                f"Greetings, I am the official Bureau of Indian Standards (BIS) Smart Digital Expert. "
                f"Based on your inquiry regarding **{raw_query}**, here are the verified technical requirements from our official standards context:\n\n"
                + "\n\n---\n\n".join(blocks)
            )

        latency = int((time.time() - start_time) * 1000)
        seen_ids = set()
        unique_stds = []
        for _, std, _ in top_clauses:
            if std["id"] not in seen_ids:
                seen_ids.add(std["id"])
                unique_stds.append(std)

        return {
            "query": raw_query,
            "answer": llm_answer,
            "citations": citations,
            "confidence": 0.98,
            "isAbstained": False,
            "cached": False,
            "costTier": "fast_tier",
            "latencyMs": latency,
            "relevantStandards": unique_stds
        }
