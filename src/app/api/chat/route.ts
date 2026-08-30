import { NextRequest, NextResponse } from "next/server";
import { executeRagQuery } from "@/lib/rag-engine";
import { evaluatePromptGuardrail } from "@/lib/guardrails";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "A valid query string is required." },
        { status: 400 }
      );
    }

    // 1. Guardrail / Red-Team Check
    const guardResult = evaluatePromptGuardrail(query);
    if (!guardResult.passed) {
      return NextResponse.json({
        query,
        answer: `⚠️ **Security & Regulatory Guardrail Interception**: ${guardResult.blockedReason}`,
        citations: [],
        confidence: 0.0,
        isAbstained: true,
        abstainReason: "ADVERSARIAL_INPUT_DETECTED",
        cached: false,
        costTier: "cached",
        latencyMs: 12,
        relevantStandards: [],
        isAdversarial: true,
      });
    }

    // 2. Execute RAG Retrieval
    const ragResult = await executeRagQuery(guardResult.sanitizedInput);

    return NextResponse.json(ragResult);
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal processing error while querying standards repository." },
      { status: 500 }
    );
  }
}
