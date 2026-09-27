"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { STANDARDS_DATABASE, Standard } from "@/lib/standards-data";
import { Search, ArrowRight, ShieldCheck, Bookmark, BookmarkCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";

function ExploreCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const { savedStandards, toggleSaveStandard } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const categories = [
    "All",
    "Electrical",
    "IT",
    "Civil & Construction",
    "Chemicals & Plastics",
    "Consumer Goods",
  ];

  const filteredStandards = useMemo(() => {
    return STANDARDS_DATABASE.filter((std) => {
      // Category match
      let matchCat = true;
      if (selectedCategory === "Electrical") {
        matchCat =
          std.category.toLowerCase().includes("electric") ||
          std.division.toLowerCase().includes("etd") ||
          std.code.includes("1293") ||
          std.code.includes("302");
      } else if (selectedCategory === "IT") {
        matchCat =
          std.category.toLowerCase().includes("it") ||
          std.division.toLowerCase().includes("litd") ||
          std.code.includes("13252") ||
          std.certificationScheme.includes("CRS");
      } else if (selectedCategory === "Civil & Construction") {
        matchCat =
          std.category.toLowerCase().includes("civil") ||
          std.category.toLowerCase().includes("construction") ||
          std.division.toLowerCase().includes("ced") ||
          std.code.includes("456") ||
          std.code.includes("4984");
      } else if (selectedCategory === "Chemicals & Plastics") {
        matchCat =
          std.category.toLowerCase().includes("chem") ||
          std.category.toLowerCase().includes("plastic") ||
          std.division.toLowerCase().includes("pcd") ||
          std.code.includes("14534") ||
          std.code.includes("10146");
      } else if (selectedCategory === "Consumer Goods") {
        matchCat =
          std.category.toLowerCase().includes("consumer") ||
          std.category.toLowerCase().includes("packaging") ||
          std.division.toLowerCase().includes("med") ||
          std.code.includes("17526") ||
          std.code.includes("2771");
      }

      const matchSearch =
        search.trim() === "" ||
        std.code.toLowerCase().includes(search.toLowerCase()) ||
        std.title.toLowerCase().includes(search.toLowerCase()) ||
        std.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())) ||
        std.scope.toLowerCase().includes(search.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-8 lg:px-12 transition-all">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ─────────────────────────────────────────────────────────────
            TOP BANNER: Official Standards Registry Header
            Deep Statutory Navy with National Gold & Blue accents
            ───────────────────────────────────────────────────────────── */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#0A192F] via-[#0F223D] to-[#0A192F] text-white p-8 sm:p-10 border border-slate-700/80 shadow-md overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 rounded-full border border-blue-500/10 pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-400/30 text-amber-300 font-mono text-[11px] font-semibold tracking-wider uppercase">
              <span>MANAK REPOSITORY</span>
              <span>•</span>
              <span>BUREAU OF INDIAN STANDARDS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">
              National Indian Standards Catalog
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Search, filter, and inspect Bureau of Indian Standards (BIS) specifications, Gazette Quality Control Orders (QCO), Scheme of Testing & Inspection (STI), and mandatory testing clauses.
            </p>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            FILTER BAR: Search + Division/Category Filter Pills
            ───────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4 shadow-sm border border-slate-200">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by IS code (e.g. IS 1293), product name, test clause, or keyword…"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl font-normal text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 focus:bg-white transition-all shadow-xs"
            />
          </div>

          {/* Bottom Row: Count + Category Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="text-xs font-semibold text-slate-600 shrink-0">
              Indexed Standards: <span className="text-[#0A192F] font-bold">{filteredStandards.length}</span> specifications
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0A192F] text-white shadow-xs border border-[#0A192F]"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3-COLUMN STANDARDS CARD GRID: Clean GovTech Cards
            ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredStandards.map((std) => {
            const isSaved = savedStandards.includes(std.id);

            return (
              <div
                key={std.id}
                className="group rounded-2xl bg-white p-6 hover:shadow-md hover:border-blue-400/80 transition-all duration-200 flex flex-col justify-between border border-slate-200"
              >
                <div>
                  {/* Top Badge: IS Code Tag + Bookmark */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block bg-[#0A192F] text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md shadow-xs">
                        {std.code}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">
                        {std.division}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaveStandard(std.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved ? "text-blue-700 bg-blue-50" : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                      title={isSaved ? "Remove Bookmark" : "Save Standard"}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Standard Title */}
                  <Link href={`/standard/${std.id}`}>
                    <h3 className="text-slate-900 font-bold text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                      {std.title}
                    </h3>
                  </Link>

                  {/* Standard Scope / Clauses Excerpt */}
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mt-2.5">
                    {std.scope}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {std.certificationScheme}
                  </span>

                  <Link
                    href={`/standard/${std.id}`}
                    className="font-bold text-[#0A192F] hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Clauses</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  </Link>
                </div>
              </div>
            );
          })}

          {filteredStandards.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-600 bg-white rounded-2xl p-8 border border-slate-200">
              <p className="text-base font-semibold text-slate-800">No standards found matching your criteria.</p>
              <p className="text-xs text-slate-500 mt-1">Try searching with a different keyword or select the &quot;All&quot; category.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-5 py-2 bg-[#0A192F] text-white rounded-xl text-xs font-semibold hover:bg-blue-900 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f5fa] p-12 text-center text-neutral-600 text-sm font-sans">
          Loading Indian Standards Catalog...
        </div>
      }
    >
      <ExploreCatalogContent />
    </Suspense>
  );
}
