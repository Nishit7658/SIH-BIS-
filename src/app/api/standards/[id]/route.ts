import { NextRequest, NextResponse } from "next/server";
import { getStandardById } from "@/lib/standards-data";

// Endpoint: GET /api/standards/:id (Handbook Part 5.3)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const standard = getStandardById(id);

    if (!standard) {
      return NextResponse.json(
        { error: `Indian Standard with ID or code '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...standard,
      officialBisPortalUrl: `https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/`
    }, { status: 200 });

  } catch (error: any) {
    console.error("API /standards/:id Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve standard details." },
      { status: 500 }
    );
  }
}
