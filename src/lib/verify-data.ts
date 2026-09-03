export interface LicenseRecord {
  cmlNumber: string;
  applicantName: string;
  licenseeName?: string;
  brand: string;
  standardCode: string;
  standardTitle?: string;
  productName: string;
  productDescription?: string;
  factoryAddress: string;
  status: "ACTIVE" | "EXPIRED" | "SUSPENDED" | "CANCELLED";
  issueDate: string;
  validFrom?: string;
  validUpto: string;
  validUntil?: string;
  branchOffice?: string;
  scheme: "Scheme I (ISI Mark)" | "Scheme II" | "Compulsory Registration (CRS)";
  qrPayload?: string;
}

export const VERIFICATION_DATABASE: LicenseRecord[] = [
  {
    cmlNumber: "CM/L-8400012345",
    applicantName: "Anchor Electricals Pvt Ltd",
    brand: "Anchor by Panasonic",
    standardCode: "IS 1293:2019",
    productName: "16A 3-Pin Shuttered Socket-Outlet with Switch",
    factoryAddress: "Plot No. 42, GIDC Industrial Estate, Daman - 396210, India",
    status: "ACTIVE",
    issueDate: "2020-01-15",
    validUpto: "2027-01-14",
    scheme: "Scheme I (ISI Mark)",
    qrPayload: "BIS:CML:8400012345:IS1293:ANCHOR:VALID"
  },
  {
    cmlNumber: "CM/L-9123456789",
    applicantName: "Havells India Limited",
    brand: "Havells Life Line Plus",
    standardCode: "IS 694:2010",
    productName: "PVC Insulated Copper Conductor Single Core Cables (1.5 sq mm)",
    factoryAddress: "Industrial Area Phase II, Alwar, Rajasthan - 301030, India",
    status: "ACTIVE",
    issueDate: "2018-05-10",
    validUpto: "2026-05-09",
    scheme: "Scheme I (ISI Mark)",
    qrPayload: "BIS:CML:9123456789:IS694:HAVELLS:VALID"
  },
  {
    cmlNumber: "CM/L-7234567890",
    applicantName: "UltraTech Cement Ltd",
    brand: "UltraTech Super",
    standardCode: "IS 269:2015",
    productName: "53 Grade Ordinary Portland Cement",
    factoryAddress: "Aditya Nagar, Malkhed, Kalaburagi, Karnataka - 585292",
    status: "ACTIVE",
    issueDate: "2016-03-20",
    validUpto: "2028-03-19",
    scheme: "Scheme I (ISI Mark)",
    qrPayload: "BIS:CML:7234567890:IS269:ULTRATECH:VALID"
  },
  {
    cmlNumber: "CM/L-3344556677",
    applicantName: "Shree Ganesh Electrical Appliances",
    brand: "Ganesh Deluxe",
    standardCode: "IS 302-1:2008",
    productName: "Electric Immersion Water Heater 1500W",
    factoryAddress: "Sector 58, Ballabgarh, Faridabad, Haryana - 121004",
    status: "EXPIRED",
    issueDate: "2017-02-01",
    validUpto: "2022-01-31",
    scheme: "Scheme I (ISI Mark)",
    qrPayload: "BIS:CML:3344556677:IS302:GANESH:EXPIRED"
  },
  {
    cmlNumber: "CM/L-5566778899",
    applicantName: "Speedy Plugs & Polymers",
    brand: "SpeedyCon",
    standardCode: "IS 1293:2019",
    productName: "2-Pin 16A High-Power Adaptor",
    factoryAddress: "Bawana Industrial Area, Delhi - 110039",
    status: "SUSPENDED",
    issueDate: "2021-08-10",
    validUpto: "2024-08-09",
    scheme: "Scheme I (ISI Mark)",
    qrPayload: "BIS:CML:5566778899:IS1293:SPEEDY:SUSPENDED"
  },
  {
    cmlNumber: "R-41001234",
    applicantName: "Samsung Electronics India Information & Telecommunication Ltd",
    brand: "Samsung",
    standardCode: "IS 16046 (Part 2):2018",
    productName: "Rechargeable Lithium-ion Battery Pack (EB-BA536ABY)",
    factoryAddress: "Sector 81, Phase II, Noida, Uttar Pradesh - 201305",
    status: "ACTIVE",
    issueDate: "2022-04-01",
    validUpto: "2027-03-31",
    scheme: "Compulsory Registration (CRS)",
    qrPayload: "BIS:CRS:R41001234:IS16046:SAMSUNG:VALID"
  }
];

export function lookupLicense(query: string): LicenseRecord | null {
  const clean = query.trim().toUpperCase().replace(/[\s\-\/]/g, "");
  for (const record of VERIFICATION_DATABASE) {
    const recordClean = record.cmlNumber.toUpperCase().replace(/[\s\-\/]/g, "");
    if (recordClean === clean || record.cmlNumber.toUpperCase() === query.trim().toUpperCase()) {
      return record;
    }
  }
  return null;
}
