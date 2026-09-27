import { STANDARDS_DATABASE, Standard, Clause } from "./standards-data";
import { recommendStandardsForBusiness, BusinessRecommendationResult } from "./recommender";
import { getLaboratories, BisLaboratory } from "./laboratories-data";
import { getSchemes, getSchemeById, BisScheme } from "./schemes-data";
import { callExternalLlm } from "./llm-provider";
import { getRichStandardChunk } from "./rich-standards";

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
  isAdversarial?: boolean;
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

    // Call live Gemini to expand and format the master guide
    const systemPrompt = `You are the official Senior Technical Standards Consultant at the Bureau of Indian Standards (BIS).
Provide a comprehensive, exhaustive, and structured master engineering and compliance guide for starting this manufacturing business.
Use the provided BIS factsheet to write a detailed, practical guide covering:
1. Statutory Regulatory Status & Applicable Standards (Primary & Raw Materials)
2. Raw Material Sourcing & Inward Quality Verification Tolerances
3. Complete Manufacturing Line Machinery & Stage-by-Stage Flow
4. Mandatory In-House QC Laboratory Setup (BIS Scheme of Testing & Inspection - STI) with Calibration Mandates
5. Marking, Embossing & Legal Metrology Rules
6. Step-by-Step 70-Day BIS Certification Roadmap on Manakonline (Form V)
Ensure every section is thoroughly explained with concrete numbers, machine specifications, and testing tolerances.`;

    const externalLlmResponse = await callExternalLlm({
      systemPrompt,
      context: answer,
      userQuery: rawQuery,
      temperature: 0.2
    });

    if (externalLlmResponse) {
      answer = `${externalLlmResponse}\n\n> **Official BIS Verification**: Verify current standards and portal guidelines on the [e-BIS Standards Portal](${OFFICIAL_BIS_PORTAL_BASE}).`;
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

  // 1. Build comprehensive rich standards context blocks with full engineering tables
  const richDossiers = uniqueStandards.slice(0, 2).map(std => getRichStandardChunk(std));

  // 2. Add clause-specific deep matches
  const specificClauseDetails = topMatches.map((m, idx) => 
    `[Clause Ref ${idx + 1}] Standard: ${m.standard.code} (${m.standard.title})\n` +
    `- Clause Number: ${m.clause.number} - ${m.clause.title}\n` +
    `- Technical Content: "${m.clause.content}"\n` +
    `${m.clause.testRequirement ? `- Mandatory Test Method / Limit: ${m.clause.testRequirement}\n` : ""}` +
    `${m.clause.testMethod ? `- Reference Test Standard: ${m.clause.testMethod}\n` : ""}` +
    `- Statutory Scheme: ${m.standard.certificationScheme}\n` +
    `- Regulatory Mandate: ${m.standard.mandatory ? `Mandatory QCO (${m.standard.qcoOrder || "Gazetted Order"})` : "Voluntary BIS Standard"}`
  ).join("\n\n");

  const combinedContext = [
    "=== OFFICIAL BUREAU OF INDIAN STANDARDS TECHNICAL SPECIFICATIONS & TABLES ===",
    ...richDossiers,
    "=== RELEVANT CLAUSES & TESTING THRESHOLDS ===",
    specificClauseDetails
  ].join("\n\n");

  const systemPrompt = `You are the official Bureau of Indian Standards (BIS) Smart Digital Expert and Senior Regulatory Consultant.
Your mission is to provide an authoritative, exhaustive, and detailed technical engineering memorandum answering the user's inquiry strictly based on official Indian Standards (IS).

MANDATORY RESPONSE STRUCTURE:
1. **Executive Statutory Summary**: State the governing Indian Standard(s), current edition, Division Council, and whether it is under a Mandatory Quality Control Order (QCO) issued by the Ministry (DPIIT/MeitY/MoC) or Voluntary.
2. **Technical Specifications & Acceptance Criteria**: Detail the numerical requirements, dimensions, chemical compositions, physical/mechanical properties, and tolerances. Render complete Markdown tables where applicable.
3. **Mandatory Testing Procedures & Acceptance Limits**: Explain the specific laboratory tests (e.g. Temperature Rise, Glow-wire 850°C, Tensile/Proof Stress, Bend/Rebend, Migration limits) and their exact pass/fail criteria.
4. **Scheme of Testing and Inspection (STI) & Quality Control**: Detail the factory batch sampling frequency, in-house laboratory calibration, and inspection routine required for BIS licensing.
5. **Marking, Certification Scheme & Manakonline Compliance**: Detail the Standard Mark (ISI mark or CRS registration), product embossing/labeling rules, and licensing roadmap under Scheme I / Form V.

RULES:
- Be thorough, specific, and detailed—never output a shallow one-paragraph or two-bullet summary.
- Always include concrete values, units (MPa, mm, °C, K, Ohm/km, % by mass), and exact clause references.
- Ground all facts strictly in the provided BIS context.`;

  // Attempt external LLM generation (Gemini)
  const externalLlmResponse = await callExternalLlm({
    systemPrompt,
    context: combinedContext,
    userQuery: rawQuery,
    temperature: 0.1
  });

  let answer = "";
  if (externalLlmResponse) {
    answer = `${externalLlmResponse}\n\n> **Official BIS Verification**: Verify current gazette notifications and licensing standards on the [e-BIS Standards Portal](${OFFICIAL_BIS_PORTAL_BASE}).`;
  } else {
    // Rich, detailed deterministic grounded fallback dossier
    const sections: string[] = [];
    
    uniqueStandards.slice(0, 2).forEach(std => {
      sections.push(
        `### Standard Specification: ${std.code} — ${std.title}\n\n` +
        `- **Division Council**: ${std.division} (${std.department || "Bureau of Indian Standards"})\n` +
        `- **Statutory Status**: ${std.mandatory ? `**Mandatory Quality Control Order (QCO)** (${std.qcoOrder || "Legally Enforced"})` : "Voluntary BIS Standard"}\n` +
        `- **Conformity Scheme**: **${std.certificationScheme}**\n\n` +
        `**Scope & Regulatory Intent**:\n${std.scope}`
      );
    });

    // Clause Analysis
    const clauseLines = topMatches.map(m => 
      `#### Clause ${m.clause.number}: ${m.clause.title}\n` +
      `- **Prescribed Requirement**: ${m.clause.content}\n` +
      (m.clause.testRequirement ? `- **Mandatory Testing Parameter**: ${m.clause.testRequirement}\n` : "") +
      (m.clause.testMethod ? `- **Test Standard / Methodology**: ${m.clause.testMethod}\n` : "")
    );
    sections.push("### Critical Technical Clauses & Acceptance Criteria:\n\n" + clauseLines.join("\n\n"));

    // If pre-curated table exists
    const richSnippet = getRichStandardChunk(primaryMatch.standard);
    if (richSnippet.includes("| --- |")) {
      const tablePart = richSnippet.split("\n\n").find(part => part.includes("| --- |"));
      if (tablePart) {
        sections.push("### Technical Parameter & Specification Table:\n\n" + tablePart);
      }
    }

    if (primaryMatch.standard.blueprint) {
      const bp = primaryMatch.standard.blueprint;
      let bpSection = "### Scheme of Testing and Inspection (STI) & Quality Control Setup:\n\n";
      if (bp.rawMaterials && bp.rawMaterials.length > 0) {
        bpSection += "**Raw Material Inward Acceptance**:\n" + bp.rawMaterials.map(rm => `- **${rm.material}**: ${rm.specification} (*Inward Check*: ${rm.inwardTest})`).join("\n") + "\n\n";
      }
      if (bp.inHouseLaboratoryEquipment && bp.inHouseLaboratoryEquipment.length > 0) {
        bpSection += "**Mandatory In-House QC Lab Instruments**:\n" + bp.inHouseLaboratoryEquipment.map(lab => `- **${lab.equipmentName}**: Tests clause *${lab.clauseTested}* (${lab.calibrationRequirement})`).join("\n") + "\n\n";
      }
      sections.push(bpSection);
    }

    sections.push(`> **Official BIS Verification**: Full standard gazette texts and laboratory test schedules can be cross-verified on the official [BIS Manakonline Portal](${OFFICIAL_BIS_PORTAL_BASE}).`);
    answer = sections.join("\n\n---\n\n");
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
