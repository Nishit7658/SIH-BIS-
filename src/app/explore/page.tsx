"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { STANDARDS_DATABASE, Standard } from "@/lib/standards-data";
import { useApp } from "@/context/AppContext";
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  FileText,
  GitBranch,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers
} from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const { savedStandards, toggleSaveStandard } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [onlyMandatory, setOnlyMandatory] = useState(false);

  const categories = ["All", "Electrical", "Electronics & IT", "Civil & Construction", "Chemical & Plastics", "Consumer Goods"];

  const filteredStandards = useMemo(() => {
    return STANDARDS_DATABASE.filter((std) => {
      const matchCategory = selectedCategory === "All" || std.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchMandatory = !onlyMandatory || std.isMandatory;
      const matchText =
        !search.trim() ||
        std.code.toLowerCase().includes(search.toLowerCase()) ||
        std.title.toLowerCase().includes(search.toLowerCase()) ||
        std.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())) ||
        std.summary.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchMandatory && matchText;
    });
  }, [search, selectedCategory, onlyMandatory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-bis-navy to-bis-navy-light text-white p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="px-3 py-1 rounded-full bg-bis-saffron/20 text-bis-saffron-light text-xs font-bold uppercase tracking-wider border border-bis-saffron/30 inline-block">
            BIS Technical Repository
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight">
            Indian Standards Catalog & QCOs
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Search, filter, and inspect official Bureau of Indian Standards specifications, gazette orders, amendment histories, and mandatory testing clauses.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-bis-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by IS code (e.g. IS 1293), product name, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-bis-canvas border border-bis-border rounded-xl text-sm text-bis-text-primary focus:outline-none focus:ring-2 focus:ring-bis-blue/30"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-bis-navy cursor-pointer select-none bg-bis-canvas px-4 py-2.5 rounded-xl border border-bis-border whitespace-nowrap">
            <input
              type="checkbox"
              checked={onlyMandatory}
              onChange={(e) => setOnlyMandatory(e.target.checked)}
              className="rounded text-bis-saffron focus:ring-bis-saffron"
            />
            <span>Mandatory QCOs Only</span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-bis-navy text-white shadow-xs"
                  : "bg-bis-canvas text-bis-text-secondary hover:bg-slate-200 border border-bis-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-bis-text-secondary px-1">
        <span>Showing <strong>{filteredStandards.length}</strong> standard(s)</span>
        <span>Catalog Version: 2026.1</span>
      </div>

      {/* Standards List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStandards.map((std) => {
          const isSaved = savedStandards.includes(std.id);
          return (
            <div
              key={std.id}
              className="bg-white rounded-2xl border border-bis-border hover:border-bis-blue p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-lg bg-bis-blue-soft text-bis-blue font-mono font-bold text-xs">
                    {std.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {std.isMandatory && (
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
                        Mandatory
                      </span>
                    )}
                    <button
                      onClick={() => toggleSaveStandard(std.id)}
                      className="p-1 rounded text-slate-400 hover:text-bis-saffron transition-colors"
                      title={isSaved ? "Remove from bookmarks" : "Bookmark standard"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-bis-saffron fill-bis-saffron" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-bis-navy text-base line-clamp-2 mb-2 leading-snug">
                  {std.title}
                </h3>

                <p className="text-xs text-bis-text-secondary line-clamp-3 leading-relaxed mb-4">
                  {std.summary}
                </p>

                <div className="space-y-1.5 py-3 border-t border-b border-bis-border/60 text-[11px] text-bis-text-secondary">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Scheme:</span>
                    <span className="font-semibold text-bis-navy">{std.scheme}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-700">{std.department}</span>
                  </div>
                  {std.gazetteDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">QCO Gazette Date:</span>
                      <span className="font-medium text-slate-700">{std.gazetteDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between mt-2">
                <span className="text-xs text-bis-text-muted font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {std.clauses.length} Clauses • {std.amendments.length} Amendments
                </span>
                <Link
                  href={`/standard/${std.id}`}
                  className="px-3.5 py-1.5 bg-bis-navy hover:bg-bis-navy-light text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5 text-bis-saffron" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-bis-navy font-bold">Loading Standards Catalog...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
