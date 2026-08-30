import { STANDARDS_DATABASE, Standard, Clause } from "./standards-data";

export interface Citation {
  standardCode: string;
  standardTitle: string;
  clauseNumber: string;
  clauseTitle: string;
  snippet: string;
  standardId: string;
}

export interface RagResult {
  query: string;
  answer: string;
  citations: Citation[];
  confidence: number; // 0.0 to 1.0
  isAbstained: boolean;
  abstainReason?: string;
  cached: boolean;
  costTier: "cached" | "fast_tier" | "deep_reasoning";
  latencyMs: number;
  relevantStandards: Standard[];
}

// In-Memory Query Cache for repeated questions
interface CacheEntry {
  result: RagResult;
  timestamp: number;
}
const queryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

// Pre-compiled high-frequency FAQ Cache entries
const FREQUENT_QUERIES: Record<string, { answer: string; citations: Citation[]; confidence: number; standardId: string }> = {
  "is isi mark mandatory for plugs": {
    answer: "Yes, under the Electrical Accessories (Quality Control) Order 2020 issued by DPIIT, compliance with **IS 1293:2019** and obtaining the **ISI Mark (Scheme I)** is legally mandatory for all plugs and socket-outlets manufactured, imported, or sold in India.",
    citations: [
      {
        standardCode: "IS 1293:2019",
        standardTitle: "Plugs and Socket-Outlets",
        clauseNumber: "Clause 1.1",
        clauseTitle: "Scope & Ratings",
        snippet: "Applies to plugs and fixed or portable socket-outlets for a.c. only, with a rated voltage not exceeding 250 V and rated current up to 16 A.",
        standardId: "is-1293-2019"
      }
    ],
    confidence: 0.98,
    standardId: "is-1293-2019"
  },
  "what is the leakage current limit in is 302": {
    answer: "Under **IS 302-1:2008 Clause 13.2**, the maximum allowable leakage current at operating temperature is **0.75 mA** for Class I portable appliances and **0.25 mA** for Class 0 and Class II appliances.",
    citations: [
      {
        standardCode: "IS 302-1:2008",
        standardTitle: "Safety of Household Electrical Appliances",
        clauseNumber: "Clause 13.2",
        clauseTitle: "Leakage Current and Electric Strength",
        snippet: "Class I portable appliances: 0.75 mA; Class 0, Class II appliances: 0.25 mA.",
        standardId: "is-302-1-2008"
      }
    ],
    confidence: 0.99,
    standardId: "is-302-1-2008"
  },
  "is lithium battery under isi mark or crs": {
    answer: "Portable lithium cells and batteries fall under the **Compulsory Registration Scheme (CRS)** of BIS pursuant to the MeitY Electronics and IT Goods (Requirement for Compulsory Registration) Order, under standard **IS 16046 (Part 2):2018 / IEC 62133-2**. It requires self-declaration of conformity with BIS registration number rather than standard Scheme I ISI mark stamping.",
    citations: [
      {
        standardCode: "IS 16046 (Part 2):2018",
        standardTitle: "Secondary Cells and Batteries (Lithium)",
        clauseNumber: "Clause 1",
        clauseTitle: "Scope & Registration Scheme",
        snippet: "Mandatory under MeitY Compulsory Registration Scheme (CRS) for electronic goods.",
        standardId: "is-16046-2018"
      }
    ],
    confidence: 0.97,
    standardId: "is-16046-2018"
  }
};

// Out-of-scope non-standards keywords trigger strict abstention
const OUT_OF_SCOPE_TRIGGERS = [
  "traffic fine", "motor vehicle act", "prescription", "paracetamol", "dosage",
  "stock market", "weather tomorrow", "recipe", "ipl match", "movie review",
  "income tax slab", "driving license rto", "passport renewal"
];

export async function executeRagQuery(rawQuery: string): Promise<RagResult> {
  const startTime = Date.now();
  const normalizedQuery = rawQuery.trim().toLowerCase();

  // 1. Check Out-of-Scope / Strict Abstention Guardrail
  const isOutOfScope = OUT_OF_SCOPE_TRIGGERS.some(trigger => normalizedQuery.includes(trigger));
  if (isOutOfScope) {
    return {
      query: rawQuery,
      answer: "This query is outside the domain of the Bureau of Indian Standards (BIS) technical standards, ISI certification, and QCO regulations. I am programmed to abstain from non-standard regulatory queries to ensure reliable compliance guidance.",
      citations: [],
      confidence: 0.0,
      isAbstained: true,
      abstainReason: "OUT_OF_DOMAIN_QUERY",
      cached: false,
      costTier: "cached",
      latencyMs: Date.now() - startTime,
      relevantStandards: []
    };
  }

  // 2. Exact Cache Lookup
  if (queryCache.has(normalizedQuery)) {
    const cachedEntry = queryCache.get(normalizedQuery)!;
    if (Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      return {
        ...cachedEntry.result,
        cached: true,
        costTier: "cached",
        latencyMs: Date.now() - startTime
      };
    }
  }

  // 3. Check High-Frequency Pre-compiled FAQ Cache
  for (const [key, val] of Object.entries(FREQUENT_QUERIES)) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
      const std = STANDARDS_DATABASE.find(s => s.id === val.standardId);
      const result: RagResult = {
        query: rawQuery,
        answer: val.answer,
        citations: val.citations,
        confidence: val.confidence,
        isAbstained: false,
        cached: true,
        costTier: "cached",
        latencyMs: Date.now() - startTime,
        relevantStandards: std ? [std] : []
      };
      queryCache.set(normalizedQuery, { result, timestamp: Date.now() });
      return result;
    }
  }

  // 4. Hybrid Clause & Standard Search Scoring
  const searchTerms = normalizedQuery
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2);

  if (searchTerms.length === 0) {
    return {
      query: rawQuery,
      answer: "Please provide a more specific question regarding an Indian Standard (IS number), product category, test requirement, or ISI mark compliance rule.",
      citations: [],
      confidence: 0.2,
      isAbstained: true,
      abstainReason: "QUERY_TOO_VAGUE",
      cached: false,
      costTier: "fast_tier",
      latencyMs: Date.now() - startTime,
      relevantStandards: []
    };
  }

  interface ScoredClause {
    standard: Standard;
    clause: Clause;
    score: number;
    matchedSnippets: string[];
  }

  const scoredClauses: ScoredClause[] = [];

  for (const std of STANDARDS_DATABASE) {
    let stdScore = 0;
    const stdText = `${std.code} ${std.title} ${std.keywords.join(" ")} ${std.summary} ${std.scope}`.toLowerCase();
    
    searchTerms.forEach(term => {
      if (stdText.includes(term)) stdScore += 3;
    });

    for (const clause of std.clauses) {
      let clauseScore = stdScore;
      const clauseText = `${clause.number} ${clause.title} ${clause.content} ${clause.testRequirement || ""}`.toLowerCase();
      const matchedSnippets: string[] = [];

      searchTerms.forEach(term => {
        if (clauseText.includes(term)) {
          clauseScore += 5;
          // Capture snippet around match
          const idx = clauseText.indexOf(term);
          const start = Math.max(0, idx - 40);
          const end = Math.min(clause.content.length, idx + term.length + 40);
          matchedSnippets.push(`...${clause.content.substring(start, end)}...`);
        }
      });

      if (clause.mandatory) clauseScore += 1;

      if (clauseScore > 4) {
        scoredClauses.push({
          standard: std,
          clause,
          score: clauseScore,
          matchedSnippets
        });
      }
    }
  }

  scoredClauses.sort((a, b) => b.score - a.score);

  // 5. Confidence Threshold & Abstention Check
  if (scoredClauses.length === 0 || scoredClauses[0].score < 5) {
    return {
      query: rawQuery,
      answer: `No matching Bureau of Indian Standards (BIS) clauses or QCO mandates found for "${rawQuery}". You can log an inquiry with the BIS SME Helpdesk or check the official Manakonline repository.`,
      citations: [],
      confidence: 0.15,
      isAbstained: true,
      abstainReason: "NO_GROUNDED_CLAUSES_MATCHED",
      cached: false,
      costTier: "fast_tier",
      latencyMs: Date.now() - startTime,
      relevantStandards: []
    };
  }

  // 6. Synthesize Grounded Answer with Strict Citations
  const topMatches = scoredClauses.slice(0, 3);
  const primaryMatch = topMatches[0];
  const citations: Citation[] = topMatches.map(m => ({
    standardCode: m.standard.code,
    standardTitle: m.standard.title,
    clauseNumber: m.clause.number,
    clauseTitle: m.clause.title,
    snippet: m.clause.content,
    standardId: m.standard.id
  }));

  const uniqueStandards = Array.from(new Set(topMatches.map(m => m.standard)));
  const confidence = Math.min(0.99, 0.70 + (primaryMatch.score * 0.03));

  // Synthesize structured compliance response
  let answer = `According to **${primaryMatch.standard.code}** (${primaryMatch.standard.title}), `;
  answer += `under **${primaryMatch.clause.number} (${primaryMatch.clause.title})**:\n\n`;
  answer += `> "${primaryMatch.clause.content}"\n\n`;

  if (primaryMatch.clause.testRequirement) {
    answer += `**Testing Requirement**: ${primaryMatch.clause.testRequirement}\n\n`;
  }

  if (primaryMatch.standard.isMandatory) {
    answer += `*Regulatory Note*: Compliance is mandatory under **${primaryMatch.standard.qcoReference || "BIS Quality Control Order"}**. Certification scheme: **${primaryMatch.standard.scheme}**.`;
  }

  const result: RagResult = {
    query: rawQuery,
    answer,
    citations,
    confidence,
    isAbstained: false,
    cached: false,
    costTier: primaryMatch.score > 15 ? "fast_tier" : "deep_reasoning",
    latencyMs: Date.now() - startTime,
    relevantStandards: uniqueStandards
  };

  // Cache successful grounded result
  queryCache.set(normalizedQuery, { result, timestamp: Date.now() });

  return result;
}
