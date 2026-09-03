import { STANDARDS_DATABASE, Standard, Clause, FactoryBlueprint } from "@/lib/standards-data";
import { NotFoundError } from "../utils/errors";

export interface StandardsQueryOptions {
  category?: string;
  query?: string;
  mandatoryOnly?: boolean;
  division?: string;
  page?: number;
  limit?: number;
}

export class StandardsService {
  static listStandards(opts: StandardsQueryOptions = {}) {
    const { category, query, mandatoryOnly, division, page = 1, limit = 20 } = opts;

    let filtered = STANDARDS_DATABASE;

    if (category && category !== "All") {
      const cat = category.toLowerCase();
      filtered = filtered.filter((s) => s.category.toLowerCase().includes(cat));
    }

    if (division) {
      const div = division.toLowerCase();
      filtered = filtered.filter((s) => (s.division || s.department).toLowerCase().includes(div));
    }

    if (mandatoryOnly) {
      filtered = filtered.filter((s) => s.isMandatory || s.mandatory);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.businessTypes.some((b) => b.toLowerCase().includes(q)) ||
          s.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);

    return {
      items: items.map((s) => ({
        id: s.id,
        code: s.code,
        title: s.title,
        year: s.year,
        category: s.category,
        department: s.department,
        division: s.division || s.department,
        isMandatory: s.isMandatory || s.mandatory,
        scheme: s.scheme,
        qcoReference: s.qcoReference || s.qcoOrder,
        clausesCount: s.clauses.length,
        hasBlueprint: Boolean(s.factoryBlueprint || s.blueprint),
        summary: s.summary,
        officialBisPortalUrl: "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/",
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static getStandardById(id: string): Standard {
    const standard = STANDARDS_DATABASE.find(
      (s) =>
        s.id.toLowerCase() === id.toLowerCase() ||
        s.code.toLowerCase().replace(/[\s\(\):]/g, "-") === id.toLowerCase()
    );

    if (!standard) {
      throw new NotFoundError(`Indian Standard '${id}'`);
    }

    return standard;
  }

  static getClauses(id: string, clauseQuery?: string): { standardCode: string; clauses: Clause[] } {
    const standard = this.getStandardById(id);
    let clauses = standard.clauses;

    if (clauseQuery && clauseQuery.trim()) {
      const q = clauseQuery.toLowerCase().trim();
      clauses = clauses.filter(
        (c) =>
          c.number.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.content.toLowerCase().includes(q)
      );
    }

    return {
      standardCode: standard.code,
      clauses,
    };
  }

  static getBlueprint(id: string): FactoryBlueprint {
    const standard = this.getStandardById(id);
    const blueprint = standard.factoryBlueprint || standard.blueprint;

    if (!blueprint) {
      throw new NotFoundError(`Factory Setup Blueprint for Standard '${standard.code}'`);
    }

    return blueprint;
  }
}
