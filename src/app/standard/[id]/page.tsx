"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getStandardById, STANDARDS_DATABASE, Standard, Clause } from "@/lib/standards-data";
import { generateStandardSchemaJsonLd } from "@/lib/schema-generator";
import { useApp } from "@/context/AppContext";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  GitBranch,
  ShieldCheck,
  MessageSquare,
  Search,
  Table,
  Layers,
  ChevronDown,
  ChevronUp,
  Scale,
  Sparkles
} from "lucide-react";

export default function StandardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const standard = getStandardById(id);
  const { savedStandards, toggleSaveStandard } = useApp();

  const [clauseSearch, setClauseSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"clauses" | "amendments" | "scope">("clauses");
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({});

  if (!standard) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-bis-navy">Standard Not Found</h1>
        <p className="text-sm text-bis-text-secondary">
          No Indian Standard matching ID "{id}" was found in the database.
        </p>
        <Link href="/explore" className="inline-block px-4 py-2 bg-bis-navy text-white rounded-xl text-xs font-bold">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  const jsonLd = generateStandardSchemaJsonLd(standard);
  const isSaved = savedStandards.includes(standard.id);

  const toggleClause = (clauseId: string) => {
    setExpandedClauses(prev => ({
      ...prev,
      [clauseId]: !prev[clauseId]
    }));
  };

  const filteredClauses = standard.clauses.filter(
    (c) =>
      c.number.toLowerCase().includes(clauseSearch.toLowerCase()) ||
      c.title.toLowerCase().includes(clauseSearch.toLowerCase()) ||
      c.content.toLowerCase().includes(clauseSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/explore"
          className="text-xs font-bold text-bis-blue hover:text-bis-navy flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Standards Catalog
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveStandard(standard.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-bis-border text-xs font-bold text-bis-navy hover:bg-bis-canvas"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-bis-saffron fill-bis-saffron" />
                <span>Bookmarked</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Bookmark</span>
              </>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bis-navy hover:bg-bis-navy-light text-white text-xs font-bold shadow-xs transition-all"
            title="Download / Print full standard dossier as PDF"
          >
            <FileText className="w-4 h-4 text-bis-saffron" />
            <span>Download / Print Dossier</span>
          </button>
          <Link
            href={`/chat?q=${encodeURIComponent(`Explain key clauses of ${standard.code}`)}`}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-bis-saffron hover:bg-bis-saffron-dark text-white text-xs font-bold shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI About This Standard</span>
          </Link>
        </div>
      </div>

      {/* Standard Header Hero */}
      <div className="bg-white rounded-3xl border border-bis-border p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-bis-blue-soft text-bis-blue font-mono font-bold text-sm">
                {standard.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                Year: {standard.year}
              </span>
              {standard.isMandatory && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200">
                  Mandatory QCO
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-bis-navy font-display pt-2">
              {standard.title}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-bis-border text-xs">
          <div className="p-3 bg-bis-canvas rounded-xl border border-bis-border">
            <span className="text-slate-500 font-medium">Conformity Scheme:</span>
            <p className="font-bold text-bis-navy mt-0.5">{standard.scheme}</p>
          </div>
          <div className="p-3 bg-bis-canvas rounded-xl border border-bis-border">
            <span className="text-slate-500 font-medium">Sectional Committee:</span>
            <p className="font-bold text-bis-navy mt-0.5">{standard.department}</p>
          </div>
          <div className="p-3 bg-bis-canvas rounded-xl border border-bis-border">
            <span className="text-slate-500 font-medium">Quality Control Order:</span>
            <p className="font-bold text-bis-navy mt-0.5">{standard.qcoReference || "Voluntary Standard"}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-bis-border text-sm font-bold gap-6">
        <button
          onClick={() => setActiveTab("clauses")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "clauses"
              ? "border-bis-saffron text-bis-navy"
              : "border-transparent text-bis-text-secondary hover:text-bis-navy"
          }`}
        >
          <Layers className="w-4 h-4" /> Clauses & Tables ({standard.clauses.length})
        </button>
        <button
          onClick={() => setActiveTab("amendments")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "amendments"
              ? "border-bis-saffron text-bis-navy"
              : "border-transparent text-bis-text-secondary hover:text-bis-navy"
          }`}
        >
          <GitBranch className="w-4 h-4" /> Amendments & Diffs ({standard.amendments.length})
        </button>
        <button
          onClick={() => setActiveTab("scope")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "scope"
              ? "border-bis-saffron text-bis-navy"
              : "border-transparent text-bis-text-secondary hover:text-bis-navy"
          }`}
        >
          <FileText className="w-4 h-4" /> Scope & Summary
        </button>
      </div>

      {/* Tab: Clauses */}
      {activeTab === "clauses" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={clauseSearch}
              onChange={(e) => setClauseSearch(e.target.value)}
              placeholder="Search within this standard's clauses and test specifications..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-bis-border rounded-xl text-sm text-bis-text-primary focus:outline-none focus:ring-2 focus:ring-bis-blue/30"
            />
          </div>

          <div className="space-y-4">
            {filteredClauses.map((clause) => {
              const isExpanded = expandedClauses[clause.id] ?? true;
              return (
                <div
                  key={clause.id}
                  className="bg-white rounded-2xl border border-bis-border overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => toggleClause(clause.id)}
                    className="w-full p-4 text-left flex items-center justify-between bg-bis-canvas/50 hover:bg-bis-canvas transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-bis-blue text-xs bg-white px-2.5 py-1 rounded border border-bis-border">
                        {clause.number}
                      </span>
                      <span className="font-bold text-sm text-bis-navy">{clause.title}</span>
                      {clause.mandatory && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          Mandatory Check
                        </span>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-5 border-t border-bis-border space-y-4 text-sm text-bis-text-primary leading-relaxed">
                      <p>{clause.content}</p>

                      {clause.testRequirement && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                          <p className="font-bold flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5 text-amber-600" />
                            Standardized Test Method & Requirement
                          </p>
                          <p className="leading-relaxed">{clause.testRequirement}</p>
                        </div>
                      )}

                      {clause.tableData && (
                        <div className="mt-4 border border-bis-border rounded-xl overflow-x-auto">
                          <table className="min-w-full divide-y divide-bis-border text-xs">
                            <thead className="bg-bis-canvas text-bis-navy font-bold">
                              <tr>
                                {clause.tableData.headers.map((h, i) => (
                                  <th key={i} className="px-4 py-2.5 text-left">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-bis-border bg-white text-bis-text-secondary">
                              {clause.tableData.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-50">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-4 py-2.5 font-medium">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Amendments */}
      {activeTab === "amendments" && (
        <div className="space-y-4">
          {standard.amendments.length === 0 ? (
            <div className="p-8 text-center text-sm text-bis-text-secondary bg-white rounded-2xl border border-bis-border">
              No amendments issued for this standard to date.
            </div>
          ) : (
            standard.amendments.map((amend) => (
              <div key={amend.number} className="bg-white p-6 rounded-2xl border border-bis-border shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
                    Amendment No. {amend.number}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Gazetted: {amend.date}</span>
                </div>
                <h4 className="font-bold text-bis-navy text-sm">
                  Affected: {amend.clauseAffected} — {amend.description}
                </h4>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                  <p className="font-bold mb-1">Amended Requirement (Active):</p>
                  <p className="leading-relaxed">{amend.newText}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Scope */}
      {activeTab === "scope" && (
        <div className="bg-white p-6 rounded-2xl border border-bis-border space-y-4 text-sm leading-relaxed">
          <div>
            <h3 className="font-bold text-base text-bis-navy mb-1">Official Scope</h3>
            <p className="text-bis-text-secondary">{standard.scope}</p>
          </div>
          <div>
            <h3 className="font-bold text-base text-bis-navy mb-1">Summary</h3>
            <p className="text-bis-text-secondary">{standard.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
