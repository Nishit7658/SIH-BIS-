import { NextRequest, NextResponse } from "next/server";
import { STANDARDS_DATABASE } from "@/lib/standards-data";

export const dynamic = "force-dynamic";

// Endpoint: GET /api/standards (Handbook Part 5.3)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q") || searchParams.get("query") || searchParams.get("search");
    const mandatory = searchParams.get("mandatory");

    let results = STANDARDS_DATABASE;

    if (category && category !== "All") {
      results = results.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (mandatory === "true" || mandatory === "1") {
      results = results.filter(s => s.isMandatory);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(s => 
        s.code.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.businessTypes.some(b => b.toLowerCase().includes(q)) ||
        s.keywords.some(k => k.toLowerCase().includes(q))
      );
    }

    // Format results with official BIS verification links
    const formattedResults = results.map(s => ({
      id: s.id,
      number: s.code,
      title: s.title,
      year: s.year,
      category: s.category,
      department: s.department,
      isMandatory: s.isMandatory,
      scheme: s.scheme,
      qcoReference: s.qcoReference,
      clausesCount: s.clauses.length,
      summary: s.summary,
      officialBisDownloadUrl: `https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/`
    }));

    return NextResponse.json({
      count: formattedResults.length,
      results: formattedResults
    }, { status: 200 });

  } catch (error: any) {
    console.error("API /standards Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve standards catalog." },
      { status: 500 }
    );
  }
}
