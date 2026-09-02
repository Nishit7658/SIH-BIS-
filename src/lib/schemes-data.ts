// BIS CONFORMITY ASSESSMENT SCHEMES REPOSITORY
// Mapped per BIS Conformity Assessment Regulations, 2018 & Handbook Part 15.4

export interface BisScheme {
  id: string;
  schemeCode: string;
  name: string;
  fullName: string;
  targetAudience: string;
  regulatoryNature: "Mandatory for QCO products / Voluntary for others" | "Compulsory Statutory Registration" | "Mandatory for Precious Metals" | "Voluntary Green Seal" | "Voluntary System Certification";
  markIssued: "Standard Mark (ISI Mark)" | "CRS Standard Mark" | "BIS Hallmark (Purity in Karats/Fineness)" | "ECO Mark (Earthen Pot Logo)" | "Management System Certificate";
  governingRegulation: string;
  applicationPortal: string;
  portalUrl: string;
  estimatedTimelineDays: string;
  feeStructureSummary: string;
  keySteps: string[];
  applicableProductCategories: string[];
}

export const BIS_SCHEMES_DATABASE: BisScheme[] = [
  {
    id: "scheme-1-isi-mark",
    schemeCode: "Scheme-I",
    name: "Product Certification Scheme (Domestic Manufacturers)",
    fullName: "BIS Product Certification Scheme for Domestic Manufacturers (Scheme I)",
    targetAudience: "Indian domestic manufacturing facilities",
    regulatoryNature: "Mandatory for QCO products / Voluntary for others",
    markIssued: "Standard Mark (ISI Mark)",
    governingRegulation: "Scheme-I of BIS (Conformity Assessment) Regulations, 2018",
    applicationPortal: "Manakonline (e-BIS)",
    portalUrl: "https://www.manakonline.in/MANAK/home",
    estimatedTimelineDays: "45 - 75 Days",
    feeStructureSummary: "Application Fee: ₹1,000; Audit Processing: ₹7,000/man-day; Annual Minimum Marking Fee: Variable per product (e.g. ₹20,000 - ₹1,00,000).",
    keySteps: [
      "1. Factory in-house laboratory setup conforming to Scheme of Testing & Inspection (STI).",
      "2. Online Form V submission on Manakonline with calibration certificates and layout.",
      "3. Physical on-site factory audit by BIS technical officer.",
      "4. Independent drawing and sealing of production samples for NABL testing.",
      "5. Grant of CM/L license number and authorization to emboss the ISI mark."
    ],
    applicableProductCategories: [
      "Stainless Steel Bottles (IS 17526)",
      "Corrugated Boxes (IS 2771)",
      "Plugs & Sockets (IS 1293)",
      "Household Appliances (IS 302)",
      "Cables & Wires (IS 694 / IS 7098)",
      "UPVC & HDPE Pipes (IS 4984 / IS 4985)",
      "TMT Steel Bars (IS 1786)",
      "Cement (IS 269 / IS 1489)",
      "Toys (IS 9873)",
      "Packaged Drinking Water (IS 14543)"
    ]
  },
  {
    id: "scheme-2-crs",
    schemeCode: "CRS",
    name: "Compulsory Registration Scheme (CRS)",
    fullName: "Compulsory Registration Scheme for Electronic and IT Goods (Scheme II)",
    targetAudience: "Domestic and international electronics & IT hardware manufacturers",
    regulatoryNature: "Compulsory Statutory Registration",
    markIssued: "CRS Standard Mark",
    governingRegulation: "Electronics and IT Goods (Requirement for Compulsory Registration) Order, MeitY & BIS",
    applicationPortal: "e-BIS CRS Portal",
    portalUrl: "https://www.crsbis.in/BIS/",
    estimatedTimelineDays: "15 - 30 Days (Fast-Track Self-Declaration)",
    feeStructureSummary: "Application Registration Fee: ₹1,000; Model processing fee: ₹20,000 - ₹50,000 based on series inclusion.",
    keySteps: [
      "1. Submit sample directly to BIS-recognized Indian test laboratory.",
      "2. Receive test report passing all electrical safety & thermal parameters.",
      "3. Submit online registration on crsbis.in with Self-Declaration of Conformity (SDoC).",
      "4. Instant grant of R-Number (e.g. R-XXXXXXXX) for the registered product series."
    ],
    applicableProductCategories: [
      "Lithium-Ion Batteries (IS 16046-2)",
      "Laptops & Desktops (IS 13252-1)",
      "Smart TVs & Audio Sets (IS 616)",
      "LED Bulbs & Drivers (IS 16102 / IS 15885)",
      "Solar PV Inverters (IS 16221-2)",
      "Power Adapters & SMPS"
    ]
  },
  {
    id: "scheme-3-fmcs",
    schemeCode: "FMCS",
    name: "Foreign Manufacturers Certification Scheme",
    fullName: "BIS Certification Scheme for Overseas Manufacturers (FMCS)",
    targetAudience: "Overseas manufacturing units exporting goods to India",
    regulatoryNature: "Mandatory for QCO products / Voluntary for others",
    markIssued: "Standard Mark (ISI Mark)",
    governingRegulation: "Scheme-I Foreign Certification under BIS Act, 2016",
    applicationPortal: "Manakonline FMCS Desk",
    portalUrl: "https://www.services.bis.gov.in/php/BIS_2.0/fmcs/",
    estimatedTimelineDays: "90 - 180 Days",
    feeStructureSummary: "Application Fee: $1,000 USD; Overseas audit travel & per diem; Performance Bank Guarantee (PBG): $10,000 USD.",
    keySteps: [
      "1. Appoint an Authorized Indian Representative (AIR) residing in India.",
      "2. Submit overseas factory technical documentation and STI in-house testing evidence.",
      "3. BIS officer flies to overseas factory for physical plant surveillance.",
      "4. Samples shipped to India for independent NABL testing.",
      "5. Grant of FMCS CM/L license upon clearance."
    ],
    applicableProductCategories: [
      "Imported Steel & Rebars",
      "Imported Electrical Plugs & Sockets",
      "Imported Chemicals & Polymer Resins",
      "Imported Heavy Tires & Auto Parts"
    ]
  },
  {
    id: "scheme-4-hallmarking",
    schemeCode: "Hallmarking",
    name: "Hallmarking of Precious Metals (Gold & Silver)",
    fullName: "BIS Gold and Silver Jewellery Hallmarking Scheme",
    targetAudience: "Jewellery retailers, manufacturers, and Assaying & Hallmarking Centres (AHCs)",
    regulatoryNature: "Mandatory for Precious Metals",
    markIssued: "BIS Hallmark (Purity in Karats/Fineness)",
    governingRegulation: "Hallmarking Regulations under Section 14 & 16 of BIS Act, 2016",
    applicationPortal: "Manakonline Hallmarking Portal",
    portalUrl: "https://www.manakonline.in/MANAK/hallmarking",
    estimatedTimelineDays: "1 - 5 Days for Jeweller Registration",
    feeStructureSummary: "Jeweller Registration: ₹0 for turnover up to ₹5 Cr; ₹2,500 - ₹5,000 for higher turnover; Hallmarking fee: ₹45/gold article + GST.",
    keySteps: [
      "1. Jeweller registration on Manakonline portal.",
      "2. Submit jewellery batches to BIS-recognized AHC for XRF and fire assay testing.",
      "3. AHC laser-engraves 6-digit alphanumeric HUID (Hallmark Unique Identification).",
      "4. Consumer verifies purity and AHC license via the official BIS Care mobile app."
    ],
    applicableProductCategories: [
      "14K, 18K, 20K, 22K, 23K, 24K Gold Jewellery & Artefacts",
      "Fine Silver & Sterling Silver Articles"
    ]
  },
  {
    id: "scheme-5-lrs",
    schemeCode: "LRS",
    name: "Laboratory Recognition Scheme (LRS)",
    fullName: "BIS Laboratory Recognition and Accreditation Scheme",
    targetAudience: "Testing and analytical laboratories",
    regulatoryNature: "Mandatory for QCO products / Voluntary for others",
    markIssued: "Management System Certificate",
    governingRegulation: "BIS (Conformity Assessment) Regulations, 2018 - Rule 11",
    applicationPortal: "e-BIS LRS Portal",
    portalUrl: "https://www.services.bis.gov.in/php/BIS_2.0/lrs/",
    estimatedTimelineDays: "60 - 90 Days",
    feeStructureSummary: "Application fee: ₹10,000; Assessment charges: ₹25,000/man-day; Annual recognition fee: ₹50,000.",
    keySteps: [
      "1. Obtain NABL accreditation per ISO/IEC 17025.",
      "2. Apply on e-BIS LRS portal specifying test scope of Indian Standards.",
      "3. Joint assessment by BIS technical committee and proficiency testing (PT).",
      "4. Inclusion in the official BIS Recognized Laboratory Directory."
    ],
    applicableProductCategories: [
      "Third-Party Testing Laboratories",
      "University & Government Research Test Houses"
    ]
  }
];

export function getSchemes(): BisScheme[] {
  return BIS_SCHEMES_DATABASE;
}

export function getSchemeById(id: string): BisScheme | undefined {
  return BIS_SCHEMES_DATABASE.find(s => s.id === id || s.schemeCode.toLowerCase() === id.toLowerCase());
}
