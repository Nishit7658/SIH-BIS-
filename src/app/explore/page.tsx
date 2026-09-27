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
    <div className="min-h-screen bg-[#FBFBFC] py-8 px-4 sm:px-8 lg:px-12 transition-all">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ─────────────────────────────────────────────────────────────
            TOP BANNER: "Indian Standards Catalog"
            Lavender gradient banner (#C4B6CE → #D1B8E3)
            ───────────────────────────────────────────────────────────── */}
        <div
          className="rounded-3xl p-8 sm:p-12 shadow-sm border border-purple-200/40"
          style={{ background: "linear-gradient(135deg, #C4B6CE 0%, #D1B8E3 100%)" }}
        >
          <h1 className="text-3xl sm:text-5xl font-bold text-[#300060] tracking-tight font-sans">
            Indian Standards Catalog
          </h1>
          <p className="text-neutral-700 text-sm sm:text-base mt-3 max-w-3xl leading-relaxed">
            Search, filter and inspect Bureau of Indian Standards specifications, gazette orders, amendment histories, and mandatory testing clauses
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            FILTER BAR: Rounded Search + Category Pills
            ───────────────────────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#F4F4F4] p-6 sm:p-8 space-y-5 shadow-xs border border-neutral-200/60">
          {/* Rounded Gray Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by IS code, product name, or keyword…"
              className="w-full pl-12 pr-4 py-3.5 bg-white text-neutral-900 placeholder:text-neutral-500 rounded-full font-normal text-sm border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#5D00B7]/40 transition-all shadow-xs"
            />
          </div>

          {/* Bottom Row: Count + Category Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="text-xs font-semibold text-neutral-700 shrink-0">
              Showing <span className="text-[#300060] font-bold">{filteredStandards.length}</span> standard(s)
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#300060] text-white font-semibold shadow-sm"
                        : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300"
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
            3-COLUMN STANDARDS CARD GRID: #F4F4F4 rounded cards
            ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredStandards.map((std) => {
            const isSaved = savedStandards.includes(std.id);

            return (
              <div
                key={std.id}
                className="group rounded-3xl bg-[#F4F4F4] p-6 hover:bg-neutral-200/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between border border-neutral-200/70"
              >
                <div>
                  {/* Top Badge: IS Code Purple Pill Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-[#300060] text-white font-semibold text-xs px-3 py-1 rounded-full shadow-xs">
                      {std.code}
                    </span>

                    <button
                      onClick={() => toggleSaveStandard(std.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isSaved ? "text-[#5D00B7] bg-purple-100" : "text-neutral-400 hover:text-[#5D00B7]"
                      }`}
                      title={isSaved ? "Remove Bookmark" : "Save Standard"}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Standard Title */}
                  <Link href={`/standard/${std.id}`}>
                    <h3 className="text-neutral-900 font-bold text-base line-clamp-2 leading-snug group-hover:text-[#5D00B7] transition-colors">
                      {std.title}
                    </h3>
                  </Link>

                  {/* Standard Scope / Clauses Excerpt (Gray Body Text) */}
                  <p className="text-neutral-600 text-xs leading-relaxed line-clamp-4 mt-2.5">
                    {std.scope}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#5D00B7] font-semibold">
                    {std.certificationScheme}
                  </span>

                  <Link
                    href={`/standard/${std.id}`}
                    className="font-bold text-[#300060] hover:text-[#5D00B7] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Clauses</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F16104]" />
                  </Link>
                </div>
              </div>
            );
          })}

          {filteredStandards.length === 0 && (
            <div className="col-span-full py-16 text-center text-neutral-600 bg-[#F4F4F4] rounded-3xl p-8 border border-neutral-200">
              <p className="text-base font-semibold text-neutral-800">No standards found matching your criteria.</p>
              <p className="text-xs text-neutral-600 mt-1">Try searching with a different keyword or select the &quot;All&quot; category.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-5 py-2 bg-[#300060] text-white rounded-full text-xs font-semibold hover:bg-[#5D00B7] transition-colors"
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
