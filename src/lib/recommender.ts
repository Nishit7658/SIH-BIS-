import { STANDARDS_DATABASE, Standard, Clause, FactoryBlueprint } from "./standards-data";

export interface BusinessRecommendationResult {
  query: string;
  matchedDomain: string;
  primaryStandards: Standard[];
  supportingStandards: Standard[];
  mandatoryQcoNotice: string;
  scheme: string;
  keyMandatoryTests: {
    standardCode: string;
    clauseNumber: string;
    testTitle: string;
    requirement: string;
  }[];
  complianceChecklist: string[];
  blueprint?: FactoryBlueprint | null;
}

// Business domain keywords to standard IDs mapping
const DOMAIN_MAPPINGS: {
  domain: string;
  keywords: string[];
  primaryIds: string[];
  supportingIds: string[];
  qcoNotice: string;
  scheme: string;
}[] = [
  {
    domain: "Corrugated Box & Paper Packaging Manufacturing",
    keywords: ["corrugated", "carton", "box", "kraft paper", "packaging", "cardboard", "shipping box", "fluting"],
    primaryIds: ["is-2771-1-2020", "is-2771-2-2020"],
    supportingIds: ["is-1060-1-1966", "is-1060-2-1960", "is-1397-1990", "is-15495-2020"],
    qcoNotice: "Mandatory under Packaging Material Quality Control Order for commercial shipping containers.",
    scheme: "Scheme I (ISI Mark)"
  },
  {
    domain: "Food Grade Plastic & Flexible Packaging Converting",
    keywords: ["food packaging", "plastic pouch", "milk pouch", "food container", "bottle cap", "pet bottle", "bopp", "blister", "food contact"],
    primaryIds: ["is-10146-1982", "is-9845-1998", "is-14534-1998"],
    supportingIds: ["is-12252-1987", "is-10910-1984", "is-10142-1999", "is-10151-1982", "is-15495-2020", "is-14444-1997"],
    qcoNotice: "Mandatory under FSSAI & BIS Food Contact Materials Quality Control Regulations.",
    scheme: "Scheme I (ISI Mark)"
  },
  {
    domain: "Stainless Steel Water Bottles, Vacuum Flasks & Insulated Containers",
    keywords: ["steel bottle", "steel water bottle", "metal water bottle", "stainless steel bottle", "vacuum flask", "insulated bottle", "ss bottle", "steel flask", "sipper", "steel utensil", "thermos", "insulated flask"],
    primaryIds: ["is-17526-2021"],
    supportingIds: ["is-6911-2017", "is-9845-1998"],
    qcoNotice: "Mandatory under Cookware, Utensils and Insulated Flasks (Quality Control) Order, 2023 (DPIIT).",
    scheme: "Scheme I (ISI Mark)"
  },
  {
    domain: "Electrical Plugs, Sockets & Switch Accessories",
    keywords: ["plug", "socket", "adaptor", "extension board", "switch", "modular switch", "multiplug", "wall socket"],
    primaryIds: ["is-1293-2019", "is-3854-1997"],
    supportingIds: ["is-694-2010", "is-8130-2013", "is-8828-1996"],
    qcoNotice: "Mandatory under Electrical Accessories (Quality Control) Order, 2020 (DPIIT).",
    scheme: "Scheme I (ISI Mark)"
  },
  {
    domain: "Household Electrical Appliances (Irons, Geysers, Mixers, Heaters)",
    keywords: ["appliance", "electric iron", "geyser", "water heater", "mixer grinder", "blender", "food processor", "room heater", "immersion rod", "ceiling fan"],
    primaryIds: ["is-302-1-2008"],
    supportingIds: ["is-302-2-3-2007", "is-302-2-21-2018", "is-302-2-201-2008", "is-374-2019", "is-1293-2019", "is-694-2010"],
    qcoNotice: "Mandatory under Household Electrical Appliances (Quality Control) Order.",
    scheme: "Scheme I (ISI Mark)"
  },
  {
    domain: "Electric Cables, Building Wires & HT Conductors",
    keywords: ["cable", "electric wire", "copper wire", "building wire", "xlpe", "armoured cable", "ht cable", "conductor"],
    primaryIds: ["is-694-2010", "is-7098-1-1988"],
    supportingIds: ["is-8130-2013", "is-7098-2-2011"],
    qcoNotice: "Mandatory under Wires and Cables (Quality Control) Order, 2023.",
    scheme: "Scheme I (ISI Mark)"
  },
  {
    domain: "LED Lighting & Power Drivers Manufacturing",
    keywords: ["led bulb", "led driver", "street light", "luminaire", "batten light", "smps driver", "lighting fixture"],
    primaryIds: ["is-16102-1-2012", "is-15885-2-13-2012"],
    supportingIds: ["is-10322-5-1-2012", "is-10322-5-3-2012"],
    qcoNotice: "Mandatory under MeitY Compulsory Registration Scheme (CRS) for Electronic Goods.",
    scheme: "Compulsory Registration Scheme (CRS)"
  },
  {
    domain: "Lithium-Ion Batteries & Portable IT Hardware",
    keywords: ["lithium battery", "li-ion cell", "power bank", "ev battery", "laptop", "desktop computer", "smart meter", "solar inverter"],
    primaryIds: ["is-16046-2-2018", "is-13252-1-2010"],
    supportingIds: ["is-16046-1-2018", "is-616-2017", "is-16221-2-2015", "is-14286-2010", "is-16444-1-2015"],
    qcoNotice: "Mandatory under MeitY Electronics Compulsory Registration Order (CRO).",
    scheme: "Compulsory Registration Scheme (CRS)"
  },
  {
    domain: "Plastic & Polymer Pipes (HDPE, UPVC, CPVC)",
    keywords: ["hdpe pipe", "upvc pipe", "cpvc pipe", "pvc pipe", "plumbing pipe", "water pipe", "swr pipe", "drainage pipe"],
    primaryIds: ["is-4984-2016", "is-4985-2021", "is-15778-2007"],
    supportingIds: ["is-13592-2013", "is-8329-2000"],
    qcoNotice: "Mandatory under Pipes and Fittings (Quality Control) Order, 2021.",
    scheme: "Scheme I (ISI Mark)"
  },
  {
    domain: "TMT Steel Rebars, Structural Steel & Cement",
    keywords: ["tmt steel", "tmt rebar", "reinforcement steel", "structural steel", "steel beam", "i beam", "opc cement", "ppc cement", "concrete reinforcement"],
    primaryIds: ["is-1786-2020", "is-269-2015"],
    supportingIds: ["is-1489-1-2015", "is-2062-2011", "is-456-2000"],
    qcoNotice: "Mandatory under Steel and Cement Quality Control Orders (Ministry of Steel & DPIIT).",
    scheme: "Scheme I (ISI Mark)"
  },
  {
    domain: "Toys, Footwear & Consumer Protective Gear",
    keywords: ["toy", "toys", "plastic toys", "baby product", "footwear", "sports shoe", "sneaker", "packaged drinking water", "mineral water plant", "two wheeler helmet", "safety helmet", "insulating mat"],
    primaryIds: ["is-9873-1-2019", "is-15844-1-2023", "is-14543-2016"],
    supportingIds: ["is-9873-3-2020", "is-15652-2006", "is-4151-2015"],
    qcoNotice: "Mandatory under Toys QCO 2020, Footwear QCO 2023, and Packaged Water Order.",
    scheme: "Scheme I (ISI Mark)"
  }
];

export function recommendStandardsForBusiness(query: string): BusinessRecommendationResult {
  const normalized = query.toLowerCase().trim();

  // Find best domain match with phrase-length weighting
  let bestMatch = DOMAIN_MAPPINGS[0];
  let maxScore = -1;

  for (const mapping of DOMAIN_MAPPINGS) {
    let score = 0;
    
    // Exact domain name match
    if (normalized.includes(mapping.domain.toLowerCase())) {
      score += 30;
    }

    // Match keywords with length-based boost (multi-word phrases like 'steel bottle' get higher score)
    for (const kw of mapping.keywords) {
      if (normalized.includes(kw)) {
        score += kw.split(" ").length * 5;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = mapping;
    }
  }

  // Retrieve actual standard objects
  const primaryStandards: Standard[] = [];
  for (const id of bestMatch.primaryIds) {
    const s = STANDARDS_DATABASE.find(item => item.id === id);
    if (s) primaryStandards.push(s);
  }

  const supportingStandards: Standard[] = [];
  for (const id of bestMatch.supportingIds) {
    const s = STANDARDS_DATABASE.find(item => item.id === id);
    if (s) supportingStandards.push(s);
  }

  // Extract key mandatory tests across primary standards
  const keyMandatoryTests: { standardCode: string; clauseNumber: string; testTitle: string; requirement: string }[] = [];
  for (const std of primaryStandards) {
    for (const clause of std.clauses) {
      if (clause.testRequirement) {
        keyMandatoryTests.push({
          standardCode: std.code,
          clauseNumber: clause.number,
          testTitle: clause.title,
          requirement: clause.testRequirement
        });
      }
    }
  }

  const complianceChecklist = [
    `Ensure complete alignment with primary specification ${primaryStandards.map(s => s.code).join(", ")}.`,
    `Establish an in-house laboratory testing setup for mandatory routine parameters.`,
    `Apply for statutory license under ${bestMatch.scheme} via the official e-BIS / Manakonline portal.`,
    `Verify raw material compliance against supporting standards (${supportingStandards.slice(0, 3).map(s => s.code).join(", ")}).`,
    `Schedule BIS factory surveillance and initial sample testing at a recognized NABL laboratory.`
  ];

  return {
    query,
    matchedDomain: bestMatch.domain,
    primaryStandards,
    supportingStandards,
    mandatoryQcoNotice: bestMatch.qcoNotice,
    scheme: bestMatch.scheme,
    keyMandatoryTests,
    complianceChecklist,
    blueprint: primaryStandards[0]?.factoryBlueprint
  };
}
