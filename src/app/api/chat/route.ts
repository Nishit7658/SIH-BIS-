import { NextRequest, NextResponse } from "next/server";
import { executeRagQuery } from "@/lib/rag-engine";
import { evaluatePromptGuardrail } from "@/lib/guardrails";
import { checkRateLimit } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = checkRateLimit(ip, 60, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too Many Requests. Rate limit exceeded. Please wait before querying again.",
          resetSeconds: rateLimit.resetSeconds
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetSeconds.toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString()
          }
        }
      );
    }

    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "A valid query string is required." },
        { status: 400 }
      );
    }

    // 2. Guardrail / Red-Team Check
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

    // 3. Execute RAG Retrieval
    const ragResult = await executeRagQuery(guardResult.sanitizedInput);

    return NextResponse.json(ragResult, {
      status: 200,
      headers: {
        "X-RateLimit-Limit": rateLimit.limit.toString(),
        "X-RateLimit-Remaining": rateLimit.remaining.toString()
      }
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal processing error while querying standards repository." },
      { status: 500 }
    );
  }
}
