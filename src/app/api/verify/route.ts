import { NextRequest, NextResponse } from "next/server";
import { VERIFICATION_DATABASE } from "@/lib/verify-data";

export const dynamic = "force-dynamic";

function normalizeCml(cml: string): string {
  return cml.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

export async function GET(req: NextRequest) {
  const cml = req.nextUrl.searchParams.get("cml");

  if (!cml) {
    return NextResponse.json({
      totalRecords: VERIFICATION_DATABASE.length,
      sampleLicenses: VERIFICATION_DATABASE.map((v) => ({
        cml: v.cmlNumber,
        brand: v.brand,
        standard: v.standardCode
      }))
    });
  }

  const queryNorm = normalizeCml(cml);
  const found = VERIFICATION_DATABASE.find(
    (item) => normalizeCml(item.cmlNumber) === queryNorm || item.cmlNumber.toLowerCase() === cml.toLowerCase().trim()
  );

  if (found) {
    return NextResponse.json({
      success: true,
      record: found
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: `CM/L license number "${cml}" was not found in the active Bureau of Indian Standards registry.`
    },
    { status: 404 }
  );
}
