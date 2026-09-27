import { NextRequest, NextResponse } from "next/server";
import { executeRagQuery } from "@/lib/rag-engine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query string is required" },
        { status: 400 }
      );
    }

    const result = await executeRagQuery(query);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error executing RAG query:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat query",
        details: error?.message || "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "BIS Standards Intelligence Engine",
    mode: process.env.GEMINI_API_KEY ? "cloud_gemini" : "local_sovereign"
  });
}
