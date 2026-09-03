import { STANDARDS_DATABASE, Standard } from "@/lib/standards-data";

export interface SearchOptions {
  query: string;
  category?: string;
  mandatoryOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchResultItem {
  id: string;
  code: string;
  title: string;
  year: number;
  category: string;
  division: string;
  isMandatory: boolean;
  scheme: string;
  summary: string;
  relevanceScore: number;
  matchedKeywords: string[];
}

export class SearchService {
  static search(opts: SearchOptions): {
    results: SearchResultItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  } {
    const { query, category, mandatoryOnly, page = 1, limit = 20 } = opts;
    const cleanQuery = query.toLowerCase().trim();
    const queryTokens = cleanQuery.split(/\s+/).filter((t) => t.length > 1);

    const scoredItems: Array<{ standard: Standard; score: number; matched: string[] }> = [];

    for (const std of STANDARDS_DATABASE) {
      // 1. Hard filters
      if (category && category !== "All") {
        if (!std.category.toLowerCase().includes(category.toLowerCase())) continue;
      }

      if (mandatoryOnly && !(std.isMandatory || std.mandatory)) {
        continue;
      }

      // 2. Multi-factor Scoring
      let score = 0;
      const matched: string[] = [];

      const codeLower = std.code.toLowerCase();
      const titleLower = std.title.toLowerCase();
      const summaryLower = std.summary.toLowerCase();

      // Exact code match (highest weight)
      if (codeLower === cleanQuery || codeLower.includes(cleanQuery)) {
        score += 100;
        matched.push("code_exact");
      }

      // Exact title match
      if (titleLower.includes(cleanQuery)) {
        score += 50;
        matched.push("title_phrase");
      }

      // Token matching across title, summary, keywords, and business types
      for (const token of queryTokens) {
        if (codeLower.includes(token)) {
          score += 25;
          matched.push(`code:${token}`);
        }
        if (titleLower.includes(token)) {
          score += 15;
          matched.push(`title:${token}`);
        }
        if (summaryLower.includes(token)) {
          score += 8;
          matched.push(`summary:${token}`);
        }
        if (std.keywords.some((k) => k.toLowerCase().includes(token))) {
          score += 10;
          matched.push(`keyword:${token}`);
        }
        if (std.businessTypes.some((b) => b.toLowerCase().includes(token))) {
          score += 12;
          matched.push(`business:${token}`);
        }
      }

      // Clause contents matching
      for (const clause of std.clauses) {
        if (clause.content.toLowerCase().includes(cleanQuery)) {
          score += 20;
          matched.push(`clause:${clause.number}`);
          break;
        }
      }

      // Mandatory boost for industrial searchers
      if (std.isMandatory || std.mandatory) {
        score += 5;
      }

      if (score > 0) {
        scoredItems.push({ standard: std, score, matched: Array.from(new Set(matched)) });
      }
    }

    // Sort by relevance score descending
    scoredItems.sort((a, b) => b.score - a.score);

    const total = scoredItems.length;
    const offset = (page - 1) * limit;
    const paginated = scoredItems.slice(offset, offset + limit);

    const results: SearchResultItem[] = paginated.map(({ standard: s, score, matched }) => ({
      id: s.id,
      code: s.code,
      title: s.title,
      year: s.year,
      category: s.category,
      division: s.division || s.department,
      isMandatory: s.isMandatory || s.mandatory,
      scheme: s.scheme,
      summary: s.summary,
      relevanceScore: Math.round(score),
      matchedKeywords: matched,
    }));

    return {
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
