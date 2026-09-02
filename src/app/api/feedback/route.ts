import { NextRequest, NextResponse } from "next/server";

interface FeedbackEntry {
  id: string;
  query: string;
  answerSnippet: string;
  rating: "helpful" | "unhelpful" | "flag_inaccuracy";
  comments?: string;
  timestamp: string;
}

const FEEDBACK_STORE: FeedbackEntry[] = [];

// Endpoint: POST /api/feedback (Handbook Part 5.3 & Part 20)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, answerSnippet, rating, comments } = body;

    if (!rating) {
      return NextResponse.json(
        { error: "A 'rating' ('helpful', 'unhelpful', or 'flag_inaccuracy') is required." },
        { status: 400 }
      );
    }

    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      query: query || "Not provided",
      answerSnippet: answerSnippet || "Not provided",
      rating,
      comments: comments || "",
      timestamp: new Date().toISOString()
    };

    FEEDBACK_STORE.push(entry);

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully. Thank you for helping improve the BIS AI Assistant.",
      feedbackId: entry.id
    }, { status: 201 });

  } catch (error: any) {
    console.error("API /feedback Error:", error);
    return NextResponse.json(
      { error: "Failed to record feedback." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    totalFeedback: FEEDBACK_STORE.length,
    recent: FEEDBACK_STORE.slice(-20)
  }, { status: 200 });
}
