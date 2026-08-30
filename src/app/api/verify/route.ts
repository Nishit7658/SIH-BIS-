import { NextRequest, NextResponse } from "next/server";
import { lookupLicense, VERIFICATION_DATABASE } from "@/lib/verify-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cml = searchParams.get("cml");

  if (!cml) {
    return NextResponse.json({
      totalRecords: VERIFICATION_DATABASE.length,
      sampleLicenses: VERIFICATION_DATABASE.map(v => ({ cml: v.cmlNumber, brand: v.brand, standard: v.standardCode }))
    });
  }

  const record = lookupLicense(cml);
  if (!record) {
    return NextResponse.json(
      {
        found: false,
        message: `No active or historical BIS certification record found matching "${cml}". Please check for typographical errors or verify on official e-BIS portal.`
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    found: true,
    record
  });
}
