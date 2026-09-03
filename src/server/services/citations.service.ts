import { STANDARDS_DATABASE } from "@/lib/standards-data";
import { NotFoundError } from "../utils/errors";

export interface SourceCitationDetail {
  citationId: string;
  standardId: string;
  standardCode: string;
  standardTitle: string;
  clauseNumber: string;
  clauseTitle: string;
  textSnippet: string;
  testRequirement?: string;
  division: string;
  officialBisPortalUrl: string;
}

export class CitationsService {
  static getCitationById(id: string): SourceCitationDetail {
    // Expected id format: "std_id-clause_num" e.g. "is-17526-2021-5.1" or "is-1293-2019-cl6"
    for (const std of STANDARDS_DATABASE) {
      for (const clause of std.clauses) {
        const generatedId = `${std.id}-${clause.number.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
        if (generatedId === id.toLowerCase() || clause.id === id) {
          return {
            citationId: generatedId,
            standardId: std.id,
            standardCode: std.code,
            standardTitle: std.title,
            clauseNumber: clause.number,
            clauseTitle: clause.title,
            textSnippet: clause.content,
            testRequirement: clause.testRequirement || clause.testMethod,
            division: std.division || std.department,
            officialBisPortalUrl: "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/",
          };
        }
      }
    }

    throw new NotFoundError(`Citation with ID '${id}'`);
  }
}
