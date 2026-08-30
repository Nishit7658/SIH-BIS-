import { Standard } from "./standards-data";

export function generateStandardSchemaJsonLd(standard: Standard) {
  return {
    "@context": "https://schema.org",
    "@type": "Legislation",
    "name": `${standard.code} — ${standard.title}`,
    "legislationType": "Technical Standard / Quality Control Regulation",
    "legislationIdentifier": standard.code,
    "legislationDate": `${standard.year}-01-01`,
    "description": standard.summary,
    "publisher": {
      "@type": "GovernmentOrganization",
      "name": "Bureau of Indian Standards",
      "alternateName": "BIS",
      "url": "https://www.bis.gov.in"
    },
    "about": {
      "@type": "Thing",
      "name": standard.category,
      "description": standard.scope
    },
    "keywords": standard.keywords.join(", "),
    "spatialCoverage": {
      "@type": "Place",
      "name": "India"
    },
    "hasPart": standard.clauses.map(clause => ({
      "@type": "Legislation",
      "name": `${clause.number}: ${clause.title}`,
      "description": clause.content
    }))
  };
}
