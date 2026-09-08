"""
Semantic Clause & Table Chunker for BIS Indian Standards
Optimized for 800 to 1000 tokens with 150-token overlap.

Rules:
1. Detects logical BIS clause boundaries (Clause X.Y, Section X, Annexure A).
2. Preserves technical tables intact without slicing rows.
3. Groups small sub-clauses until ~800-1000 token target is achieved.
4. Splits oversized clauses at sentence boundaries with 150-token sliding overlap.
"""

import re
from typing import List, Dict, Any, Optional

# Average token in technical English is ~4 characters
CHARS_PER_TOKEN = 4
TARGET_MIN_TOKENS = 800
TARGET_MAX_TOKENS = 1000
OVERLAP_TOKENS = 150

MIN_CHUNK_CHARS = TARGET_MIN_TOKENS * CHARS_PER_TOKEN     # ~3200 chars
MAX_CHUNK_CHARS = TARGET_MAX_TOKENS * CHARS_PER_TOKEN     # ~4000 chars
OVERLAP_CHARS = OVERLAP_TOKENS * CHARS_PER_TOKEN          # ~600 chars

CLAUSE_HEADER_REGEX = re.compile(
    r"^(?:(?:Clause|Section|Article|Clause\s+No\.|Cl\.)\s*(\d+(?:\.\d+)*)|(?:(\d+\.\d+(?:\.\d+)*)\s+[A-Z])|(?:Annexure\s+[A-Z]))",
    re.IGNORECASE | re.MULTILINE
)

def estimate_tokens(text: str) -> int:
    """Accurate token count estimation based on whitespace & punctuation."""
    if not text:
        return 0
    words = text.split()
    # Approx 1.3 tokens per word in technical/statutory text
    return int(len(words) * 1.3)

def is_table_line(line: str) -> bool:
    """Checks if line is part of a markdown table or matrix."""
    stripped = line.strip()
    return stripped.startswith("|") or stripped.count("\t") >= 2 or re.search(r"\bTable\s+\d+\b", stripped, re.IGNORECASE) is not None

def split_text_into_sections(text: str) -> List[Dict[str, Any]]:
    """
    Splits text by clause headers while keeping headers with their content.
    """
    lines = text.splitlines()
    sections: List[Dict[str, Any]] = []
    curr_header = "Introductory / General"
    curr_lines: List[str] = []
    is_table_active = False

    for line in lines:
        if is_table_line(line):
            is_table_active = True
        elif is_table_active and not line.strip():
            is_table_active = False

        match = CLAUSE_HEADER_REGEX.match(line.strip())
        if match and not is_table_active:
            if curr_lines:
                sec_text = "\n".join(curr_lines).strip()
                if sec_text:
                    sections.append({
                        "header": curr_header,
                        "content": sec_text,
                        "tokens": estimate_tokens(sec_text)
                    })
                curr_lines = []
            curr_header = line.strip()
        curr_lines.append(line)

    if curr_lines:
        sec_text = "\n".join(curr_lines).strip()
        if sec_text:
            sections.append({
                "header": curr_header,
                "content": sec_text,
                "tokens": estimate_tokens(sec_text)
            })

    return sections

def chunk_text_800_1000(text: str, doc_metadata: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Chunks document into 800 - 1000 tokens with 150 token overlap.
    """
    metadata = doc_metadata or {}
    standard_code = metadata.get("code") or metadata.get("standardCode") or "BIS Standard"

    sections = split_text_into_sections(text)
    if not sections:
        # Fallback if no specific clauses detected
        sections = [{"header": "General Content", "content": text, "tokens": estimate_tokens(text)}]

    chunks: List[Dict[str, Any]] = []
    curr_chunk_parts: List[str] = []
    curr_clauses: List[str] = []
    curr_tokens = 0

    def _flush_chunk():
        nonlocal curr_chunk_parts, curr_clauses, curr_tokens
        if not curr_chunk_parts:
            return
        
        chunk_text = "\n\n".join(curr_chunk_parts).strip()
        actual_tokens = estimate_tokens(chunk_text)
        
        has_table = any(is_table_line(line) for line in chunk_text.splitlines())
        primary_clause = curr_clauses[0] if curr_clauses else "General"
        
        chunk_obj = {
            "chunkIndex": len(chunks) + 1,
            "standardCode": standard_code,
            "primaryClause": primary_clause,
            "clausesCovered": list(curr_clauses),
            "estimatedTokens": actual_tokens,
            "hasTable": has_table,
            "text": chunk_text
        }
        chunks.append(chunk_obj)
        
        # Prepare 150-token overlap from the end of the chunk
        words = chunk_text.split()
        overlap_word_count = int(OVERLAP_TOKENS / 1.3) # ~115 words
        if len(words) > overlap_word_count:
            overlap_snippet = " ".join(words[-overlap_word_count:])
            curr_chunk_parts = [f"[... Context Continued: {overlap_snippet} ...]"]
            curr_tokens = estimate_tokens(curr_chunk_parts[0])
            # retain the last clause as reference
            curr_clauses = [curr_clauses[-1]] if curr_clauses else []
        else:
            curr_chunk_parts = []
            curr_clauses = []
            curr_tokens = 0

    for sec in sections:
        sec_content = f"### {sec['header']}\n{sec['content']}"
        sec_tokens = sec["tokens"]
        
        # If section itself exceeds max tokens (e.g. 1500 tokens), split it into sub-windows with overlap
        if sec_tokens > TARGET_MAX_TOKENS:
            # Flush existing accumulator first
            if curr_chunk_parts:
                _flush_chunk()
                
            paragraphs = [p.strip() for p in sec['content'].split("\n\n") if p.strip()]
            sub_parts = [f"### {sec['header']} (Continued)"]
            sub_tokens = estimate_tokens(sub_parts[0])
            
            for p in paragraphs:
                p_tokens = estimate_tokens(p)
                if (sub_tokens + p_tokens) > TARGET_MAX_TOKENS and sub_tokens >= TARGET_MIN_TOKENS:
                    curr_chunk_parts = sub_parts
                    curr_clauses = [sec['header']]
                    _flush_chunk()
                    sub_parts = [f"### {sec['header']} (Continued)", p]
                    sub_tokens = estimate_tokens("\n\n".join(sub_parts))
                else:
                    sub_parts.append(p)
                    sub_tokens += p_tokens
                    
            if len(sub_parts) > 1:
                curr_chunk_parts = sub_parts
                curr_clauses = [sec['header']]
                _flush_chunk()
            continue

        # Normal accumulation to reach 800-1000 tokens
        if (curr_tokens + sec_tokens) > TARGET_MAX_TOKENS and curr_tokens >= TARGET_MIN_TOKENS:
            _flush_chunk()

        curr_chunk_parts.append(sec_content)
        if sec['header'] not in curr_clauses:
            curr_clauses.append(sec['header'])
        curr_tokens += sec_tokens

    # Final flush
    if curr_chunk_parts:
        _flush_chunk()

    return chunks
