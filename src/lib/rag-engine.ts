import { STANDARDS_DATABASE, Standard, Clause } from "./standards-data";
import { recommendStandardsForBusiness, BusinessRecommendationResult } from "./recommender";

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
  confidence: number;
  isAbstained: boolean;
  abstainReason?: string;
  cached: boolean;
  costTier: "cached" | "fast_tier" | "deep_reasoning";
  latencyMs: number;
  relevantStandards: Standard[];
  businessRecommendation?: BusinessRecommendationResult;
}

interface CacheEntry {
  result: RagResult;
  timestamp: number;
}
const queryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

const OUT_OF_SCOPE_TRIGGERS = [
  "traffic fine", "motor vehicle act", "prescription", "paracetamol", "dosage",
  "stock market", "weather tomorrow", "recipe", "ipl match", "movie review",
  "income tax slab", "driving license rto", "passport renewal"
];

// Business intent keywords
const BUSINESS_QUERY_TRIGGERS = [
  "i manufacture", "i make", "i produce", "i am starting", "which standards do i need",
  "which standard is required", "what standards do i require", "starting a factory",
  "manufacturing unit", "packaging unit", "requirements to manufacture", "standards for my business"
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

  // 3. Check for Business Standards Requirement Recommender Intent
  const isBusinessQuery = BUSINESS_QUERY_TRIGGERS.some(t => normalizedQuery.includes(t)) ||
    (normalizedQuery.includes("manufactur") && normalizedQuery.length > 10) ||
    (normalizedQuery.includes("packag") && normalizedQuery.length > 10);

  if (isBusinessQuery) {
    const rec = recommendStandardsForBusiness(rawQuery);
    
    let answer = `### Mandatory & Supporting Standards for: **${rec.matchedDomain}**\n\n`;
    answer += `**Statutory Regulatory Status**: ${rec.mandatoryQcoNotice}\n`;
    answer += `**Certification Scheme**: **${rec.scheme}**\n\n`;
    
    answer += `#### 1. Primary Mandatory Standards (Legally Required):\n`;
    rec.primaryStandards.forEach(std => {
      answer += `- **${std.code}**: ${std.title}\n  *Summary*: ${std.summary}\n`;
    });

    if (rec.supportingStandards.length > 0) {
      answer += `\n#### 2. Supporting Raw Material & Testing Standards:\n`;
      rec.supportingStandards.slice(0, 4).forEach(std => {
        answer += `- **${std.code}**: ${std.title}\n`;
      });
    }

    if (rec.keyMandatoryTests.length > 0) {
      answer += `\n#### 3. Key Laboratory Tests Required for Certification:\n`;
      rec.keyMandatoryTests.slice(0, 3).forEach(test => {
        answer += `- **${test.testTitle}** (${test.standardCode} ${test.clauseNumber}): ${test.requirement}\n`;
      });
    }

    answer += `\n#### 4. Compliance Action Plan:\n`;
    rec.complianceChecklist.slice(0, 3).forEach(item => {
      answer += `- ${item}\n`;
    });

    const citations: Citation[] = rec.primaryStandards.flatMap(std => 
      std.clauses.slice(0, 2).map(c => ({
        standardCode: std.code,
        standardTitle: std.title,
        clauseNumber: c.number,
        clauseTitle: c.title,
        snippet: c.content,
        standardId: std.id
      }))
    );

    const result: RagResult = {
      query: rawQuery,
      answer,
      citations,
      confidence: 0.98,
      isAbstained: false,
      cached: false,
      costTier: "deep_reasoning",
      latencyMs: Date.now() - startTime,
      relevantStandards: [...rec.primaryStandards, ...rec.supportingStandards],
      businessRecommendation: rec
    };

    queryCache.set(normalizedQuery, { result, timestamp: Date.now() });
    return result;
  }

  // 4. Hybrid Clause & Standard Search Scoring
  const searchTerms = normalizedQuery
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2);

  if (searchTerms.length === 0) {
    return {
      query: rawQuery,
      answer: "Please provide a specific query regarding an Indian Standard (IS code), product category (e.g. corrugated boxes, PVC pipes, LED lamps), or testing clause.",
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
    const stdText = `${std.code} ${std.title} ${std.businessTypes.join(" ")} ${std.keywords.join(" ")} ${std.summary} ${std.scope}`.toLowerCase();
    
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
          const idx = clauseText.indexOf(term);
          const start = Math.max(0, idx - 40);
          const end = Math.min(clause.content.length, idx + term.length + 40);
          matchedSnippets.push(`...${clause.content.substring(start, end)}...`);
        }
      });

      if (clause.mandatory) clauseScore += 1;

      if (clauseScore > 3) {
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
  if (scoredClauses.length === 0 || scoredClauses[0].score < 4) {
    return {
      query: rawQuery,
      answer: `No matching Bureau of Indian Standards (BIS) clauses or QCO mandates found for "${rawQuery}". You can log an inquiry with the BIS Technical Helpdesk or check the official Manakonline repository.`,
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
  const topMatches = scoredClauses.slice(0, 4);
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
  const confidence = Math.min(0.99, 0.75 + (primaryMatch.score * 0.02));

  let answer = `According to **${primaryMatch.standard.code}** (*${primaryMatch.standard.title}*), `;
  answer += `under **${primaryMatch.clause.number} (${primaryMatch.clause.title})**:\n\n`;
  answer += `> "${primaryMatch.clause.content}"\n\n`;

  if (primaryMatch.clause.testRequirement) {
    answer += `**Mandatory Testing Specification**: ${primaryMatch.clause.testRequirement}\n\n`;
  }

  if (primaryMatch.standard.isMandatory) {
    answer += `*Regulatory Mandate*: Compliance is mandatory under **${primaryMatch.standard.qcoReference || "BIS Quality Control Order"}**. Certification scheme: **${primaryMatch.standard.scheme}**.`;
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

  queryCache.set(normalizedQuery, { result, timestamp: Date.now() });
  return result;
}
