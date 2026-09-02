import { STANDARDS_DATABASE, Standard, Clause } from "./standards-data";
import { recommendStandardsForBusiness, BusinessRecommendationResult } from "./recommender";
import { getLaboratories, BisLaboratory } from "./laboratories-data";
import { getSchemes, getSchemeById, BisScheme } from "./schemes-data";
import { callExternalLlm } from "./llm-provider";

export interface Citation {
  standardCode: string;
  standardTitle: string;
  clauseNumber: string;
  clauseTitle: string;
  snippet: string;
  standardId: string;
  officialBisUrl: string;
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
  matchedLaboratories?: BisLaboratory[];
  matchedScheme?: BisScheme;
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

const OFFICIAL_BIS_PORTAL_BASE = "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/";

export async function executeRagQuery(rawQuery: string): Promise<RagResult> {
  const startTime = Date.now();
  const normalizedQuery = rawQuery.trim().toLowerCase();

  // 1. Check Out-of-Scope / Strict Abstention Guardrail (Handbook Part 14)
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

  // 3. Check for Testing Laboratory Inquiries (Handbook Part 15.6)
  if (normalizedQuery.includes("lab") || normalizedQuery.includes("testing center") || normalizedQuery.includes("where to test") || normalizedQuery.includes("test house")) {
    const labs = getLaboratories({ product: rawQuery, standard: rawQuery });
    if (labs.length > 0) {
      let answer = `### BIS-Recognized Testing Laboratories (LRS Scheme)\n\n`;
      answer += `Found **${labs.length}** BIS-recognized testing laboratory(ies) accredited under the Laboratory Recognition Scheme:\n\n`;
      labs.slice(0, 4).forEach((lab, idx) => {
        answer += `#### ${idx + 1}. ${lab.name} (${lab.type})\n`;
        answer += `- **Location**: ${lab.city}, ${lab.state}\n`;
        answer += `- **Address**: ${lab.address}\n`;
        answer += `- **NABL Accreditation No**: \`${lab.nablAccreditationNo}\`\n`;
        answer += `- **Contact**: 📞 ${lab.contactPhone} | ✉️ ${lab.contactEmail}\n`;
        answer += `- **Recognized Standards**: ${lab.recognizedStandards.slice(0, 4).join(", ")}\n\n`;
      });
      answer += `> Official Verification: You can cross-verify accredited laboratory scope on the [e-BIS LRS Portal](https://www.services.bis.gov.in/php/BIS_2.0/lrs/).`;

      const result: RagResult = {
        query: rawQuery,
        answer,
        citations: [],
        confidence: 0.96,
        isAbstained: false,
        cached: false,
        costTier: "fast_tier",
        latencyMs: Date.now() - startTime,
        relevantStandards: [],
        matchedLaboratories: labs
      };
      queryCache.set(normalizedQuery, { result, timestamp: Date.now() });
      return result;
    }
  }

  // 4. Check for Certification Scheme Inquiries (Handbook Part 15.4)
  if (normalizedQuery.includes("scheme") || normalizedQuery.includes("crs") || normalizedQuery.includes("fmcs") || normalizedQuery.includes("hallmarking") || normalizedQuery.includes("isi mark")) {
    const allSchemes = getSchemes();
    const matched = allSchemes.find(s => 
      normalizedQuery.includes(s.schemeCode.toLowerCase()) || 
      normalizedQuery.includes(s.name.toLowerCase()) ||
      (normalizedQuery.includes("crs") && s.schemeCode === "CRS") ||
      (normalizedQuery.includes("fmcs") && s.schemeCode === "FMCS") ||
      (normalizedQuery.includes("gold") && s.schemeCode === "Hallmarking") ||
      (normalizedQuery.includes("hallmark") && s.schemeCode === "Hallmarking")
    );

    if (matched) {
      let answer = `### BIS ${matched.fullName}\n\n`;
      answer += `**Governing Regulation**: ${matched.governingRegulation}\n`;
      answer += `**Statutory Mark Issued**: **${matched.markIssued}**\n`;
      answer += `**Target Audience**: ${matched.targetAudience}\n`;
      answer += `**Estimated Timeline**: ${matched.estimatedTimelineDays}\n`;
      answer += `**Fee Structure**: ${matched.feeStructureSummary}\n\n`;
      answer += `#### Step-by-Step Certification Process:\n`;
      matched.keySteps.forEach(st => {
        answer += `- ${st}\n`;
      });
      answer += `\n**Official Portal Link**: [${matched.applicationPortal}](${matched.portalUrl})`;

      const result: RagResult = {
        query: rawQuery,
        answer,
        citations: [],
        confidence: 0.98,
        isAbstained: false,
        cached: false,
        costTier: "fast_tier",
        latencyMs: Date.now() - startTime,
        relevantStandards: [],
        matchedScheme: matched
      };
      queryCache.set(normalizedQuery, { result, timestamp: Date.now() });
      return result;
    }
  }

  // 5. Check for Business Standards Requirement Recommender Intent
  const isBusinessQuery = BUSINESS_QUERY_TRIGGERS.some(t => normalizedQuery.includes(t)) ||
    (normalizedQuery.includes("manufactur") && normalizedQuery.length > 10) ||
    (normalizedQuery.includes("packag") && normalizedQuery.length > 10) ||
    (normalizedQuery.includes("factory") && normalizedQuery.length > 10);

  if (isBusinessQuery) {
    const rec = recommendStandardsForBusiness(rawQuery);
    
    let answer = `### Mandatory & Supporting Standards for: **${rec.matchedDomain}**\n\n`;
    answer += `**Statutory Regulatory Status**: ${rec.mandatoryQcoNotice}\n`;
    answer += `**Certification Scheme**: **${rec.scheme}**\n\n`;
    
    answer += `#### 1. Primary Mandatory Standards (Legally Required):\n`;
    rec.primaryStandards.forEach(std => {
      answer += `- **${std.code}**: ${std.title}\n  *Summary*: ${std.summary}\n  *Official BIS Portal*: [Verify ${std.code} on e-BIS](${OFFICIAL_BIS_PORTAL_BASE})\n`;
    });

    if (rec.supportingStandards.length > 0) {
      answer += `\n#### 2. Supporting Raw Material & Testing Standards:\n`;
      rec.supportingStandards.slice(0, 4).forEach(std => {
        answer += `- **${std.code}**: ${std.title} ([e-BIS Portal](${OFFICIAL_BIS_PORTAL_BASE}))\n`;
      });
    }

    if (rec.keyMandatoryTests.length > 0) {
      answer += `\n#### 3. Key Laboratory Tests Required for Certification:\n`;
      rec.keyMandatoryTests.slice(0, 4).forEach(test => {
        answer += `- **${test.testTitle}** (${test.standardCode} ${test.clauseNumber}): ${test.requirement}\n`;
      });
    }

    if (rec.blueprint) {
      answer += `\n---\n### 🏭 Complete Factory & Business Setup Blueprint\n\n`;

      answer += `#### 1. Raw Material Sourcing & Inward Testing Specifications:\n`;
      rec.blueprint.rawMaterials.forEach(rm => {
        answer += `- **${rm.material}**: ${rm.specification} (*Inward Check*: ${rm.inwardTest})\n`;
      });

      answer += `\n#### 2. Manufacturing Machinery & Production Stages:\n`;
      rec.blueprint.manufacturingMachinery.forEach(m => {
        answer += `- **${m.stage}**: ${m.machine} — *${m.purpose}*\n`;
      });

      answer += `\n#### 3. Mandatory In-House QC Testing Laboratory Setup (BIS STI):\n`;
      rec.blueprint.inHouseLaboratoryEquipment.forEach(lab => {
        answer += `- **${lab.equipmentName}**: Tests *${lab.clauseTested}* (${lab.calibrationRequirement})\n`;
      });

      answer += `\n#### 4. Mandatory Marking, Laser Engraving & Labelling:\n`;
      rec.blueprint.markingAndLabeling.forEach(mk => {
        answer += `- **${mk.item}**: ${mk.requirement}\n`;
      });

      answer += `\n#### 5. Step-by-Step BIS Certification Roadmap (Manakonline / Form V):\n`;
      rec.blueprint.bisLicensingRoadmap.forEach(st => {
        answer += `- **Step ${st.step} (${st.estimatedDays})**: **${st.title}** — ${st.description}\n`;
      });
    } else {
      answer += `\n#### 4. Compliance Action Plan:\n`;
      rec.complianceChecklist.slice(0, 3).forEach(item => {
        answer += `- ${item}\n`;
      });
    }

    const citations: Citation[] = rec.primaryStandards.flatMap(std => 
      std.clauses.slice(0, 2).map(c => ({
        standardCode: std.code,
        standardTitle: std.title,
        clauseNumber: c.number,
        clauseTitle: c.title,
        snippet: c.content,
        standardId: std.id,
        officialBisUrl: OFFICIAL_BIS_PORTAL_BASE
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

  // 6. Hybrid Clause & Standard Search Scoring (Handbook Part 10 & 11)
  const searchTerms = normalizedQuery
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2);

  if (searchTerms.length === 0) {
    return {
      query: rawQuery,
      answer: "Please provide a specific query regarding an Indian Standard (IS code), product category (e.g. corrugated boxes, PVC pipes, stainless steel bottles), or testing clause.",
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

  // 7. Confidence Threshold & Strict Honest Refusal (Handbook Part 14.2)
  if (scoredClauses.length === 0 || scoredClauses[0].score < 4) {
    return {
      query: rawQuery,
      answer: `I could not find sufficient authoritative BIS information or mandatory QCO clauses for "${rawQuery}". Please clarify the exact product type, model, or applicable IS standard. You can also search the official [BIS Manakonline Portal](https://www.manakonline.in).`,
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

  // 8. Synthesize Grounded Answer with Official Citations (Handbook Part 14)
  const topMatches = scoredClauses.slice(0, 4);
  const primaryMatch = topMatches[0];
  const citations: Citation[] = topMatches.map(m => ({
    standardCode: m.standard.code,
    standardTitle: m.standard.title,
    clauseNumber: m.clause.number,
    clauseTitle: m.clause.title,
    snippet: m.clause.content,
    standardId: m.standard.id,
    officialBisUrl: OFFICIAL_BIS_PORTAL_BASE
  }));

  const uniqueStandards = Array.from(new Set(topMatches.map(m => m.standard)));
  const confidence = Math.min(0.99, 0.75 + (primaryMatch.score * 0.02));

  // Prepare retrieved BIS context for LLM
  const contextBlock = topMatches.map((m, idx) => 
    `[${idx + 1}] Standard: ${m.standard.code} (${m.standard.title})\nClause: ${m.clause.number} - ${m.clause.title}\nContent: "${m.clause.content}"\n${m.clause.testRequirement ? `Test Requirement: ${m.clause.testRequirement}` : ""}\nScheme: ${m.standard.scheme}\nQCO: ${m.standard.qcoReference || "Voluntary"}`
  ).join("\n\n");

  const systemPrompt = `You are the official BIS (Bureau of Indian Standards) Conversational Assistant.
RULES:
1. Answer ONLY using the information provided in the CONTEXT section. Never invent a standard number or clause.
2. Whenever you state a requirement, cite the standard number and clause.
3. Keep answers clear, factual, and strictly grounded.`;

  // Attempt external LLM generation (Gemini, OpenAI, or Groq if user provided key from other project)
  const externalLlmResponse = await callExternalLlm({
    systemPrompt,
    context: contextBlock,
    userQuery: rawQuery,
    temperature: 0.2
  });

  let answer = "";
  if (externalLlmResponse) {
    answer = `${externalLlmResponse}\n\n> **Official BIS Reference**: You can verify the official document listing on the [BIS Standards Portal](${OFFICIAL_BIS_PORTAL_BASE}).`;
  } else {
    // Local deterministic grounded generator (runs with 0 external API keys)
    answer = `According to **${primaryMatch.standard.code}** (*${primaryMatch.standard.title}*), `;
    answer += `under **${primaryMatch.clause.number} (${primaryMatch.clause.title})**:\n\n`;
    answer += `> "${primaryMatch.clause.content}"\n\n`;

    if (primaryMatch.clause.testRequirement) {
      answer += `**Mandatory Testing Specification**: ${primaryMatch.clause.testRequirement}\n\n`;
    }

    if (primaryMatch.standard.isMandatory) {
      answer += `*Regulatory Mandate*: Compliance is mandatory under **${primaryMatch.standard.qcoReference || "BIS Quality Control Order"}**. Certification scheme: **${primaryMatch.standard.scheme}**.\n\n`;
    }

    answer += `> **Official BIS Reference**: You can verify the official document listing on the [BIS Standards Portal](${OFFICIAL_BIS_PORTAL_BASE}).`;
  }

  const result: RagResult = {
    query: rawQuery,
    answer,
    citations,
    confidence,
    isAbstained: false,
    cached: false,
    costTier: externalLlmResponse ? "deep_reasoning" : (primaryMatch.score > 15 ? "fast_tier" : "deep_reasoning"),
    latencyMs: Date.now() - startTime,
    relevantStandards: uniqueStandards
  };

  queryCache.set(normalizedQuery, { result, timestamp: Date.now() });
  return result;
}
