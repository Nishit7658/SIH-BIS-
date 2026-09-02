import { NextRequest, NextResponse } from "next/server";
import { getLaboratories } from "@/lib/laboratories-data";

// Endpoint: GET /api/laboratories (Handbook Part 5.3 & Part 15.6)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const standard = searchParams.get("standard") || searchParams.get("is");
    const product = searchParams.get("product") || searchParams.get("category");
    const city = searchParams.get("city") || searchParams.get("state");

    const results = getLaboratories({ standard: standard || undefined, product: product || undefined, city: city || undefined });

    return NextResponse.json({
      count: results.length,
      results: results.map(lab => ({
        id: lab.id,
        name: lab.name,
        type: lab.type,
        city: lab.city,
        state: lab.state,
        address: lab.address,
        contactEmail: lab.contactEmail,
        contactPhone: lab.contactPhone,
        recognized_for: lab.recognizedStandards,
        productCategories: lab.productCategories,
        nablAccreditationNo: lab.nablAccreditationNo
      }))
    }, { status: 200 });

  } catch (error: any) {
    console.error("API /laboratories Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve recognized testing laboratories." },
      { status: 500 }
    );
  }
}
