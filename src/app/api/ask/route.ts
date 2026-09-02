import { NextRequest, NextResponse } from "next/server";
import { executeRagQuery } from "@/lib/rag-engine";
import { evaluatePromptGuardrail } from "@/lib/guardrails";

// Endpoint: POST /api/ask (Main RAG endpoint per Handbook Part 5.3)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.question || body.query;
    const language = body.language || "en";

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "A valid 'question' or 'query' string is required in request body." },
        { status: 400 }
      );
    }

    // 1. Prompt Injection & Guardrail Defense (Handbook Part 19)
    const guardResult = evaluatePromptGuardrail(query);
    if (!guardResult.passed) {
      return NextResponse.json({
        question: query,
        answer: `⚠️ **Security & Regulatory Guardrail Interception**: ${guardResult.blockedReason}`,
        citations: [],
        sources: [],
        confidence: 0.0,
        isAbstained: true,
        abstainReason: "ADVERSARIAL_INPUT_DETECTED",
        cached: false,
        costTier: "cached",
        latencyMs: 12,
        relevantStandards: [],
        isAdversarial: true
      });
    }

    // 2. Execute RAG Retrieval & Answer Generation (Handbook Part 11)
    const ragResult = await executeRagQuery(guardResult.sanitizedInput);

    // Format response matching Handbook Part 5.3 JSON contract
    const sources = ragResult.citations.map(c => ({
      standard: c.standardCode,
      title: c.standardTitle,
      clause: c.clauseNumber,
      clauseTitle: c.clauseTitle,
      officialBisLink: `https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/`
    }));

    return NextResponse.json({
      question: query,
      answer: ragResult.answer,
      sources,
      citations: ragResult.citations,
      confidence: ragResult.confidence,
      isAbstained: ragResult.isAbstained,
      abstainReason: ragResult.abstainReason,
      cached: ragResult.cached,
      costTier: ragResult.costTier,
      latencyMs: ragResult.latencyMs,
      relevantStandards: ragResult.relevantStandards,
      businessRecommendation: ragResult.businessRecommendation
    }, { status: 200 });

  } catch (error: any) {
    console.error("API /ask Error:", error);
    return NextResponse.json(
      { error: "Internal processing error while querying standards repository." },
      { status: 500 }
    );
  }
}
