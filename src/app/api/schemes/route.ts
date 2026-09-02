import { NextRequest, NextResponse } from "next/server";
import { getSchemes, getSchemeById } from "@/lib/schemes-data";

// Endpoint: GET /api/schemes (Handbook Part 5.3 & Part 15.4)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const scheme = getSchemeById(id);
      if (!scheme) {
        return NextResponse.json({ error: `Scheme '${id}' not found.` }, { status: 404 });
      }
      return NextResponse.json(scheme, { status: 200 });
    }

    const schemes = getSchemes();
    return NextResponse.json({
      count: schemes.length,
      schemes
    }, { status: 200 });

  } catch (error: any) {
    console.error("API /schemes Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve BIS certification schemes." },
      { status: 500 }
    );
  }
}
