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
    <div className="min-h-screen bg-[#f7f5fa] py-8 px-4 sm:px-8 lg:px-12 transition-all">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ─────────────────────────────────────────────────────────────
            TOP BANNER: "Indian Standards Catalog"
            Matches frame_28.5s.png exactly
            ───────────────────────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#ded8eb] p-8 sm:p-12 shadow-sm">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#301257] tracking-tight font-sans">
            Indian Standards Catalog
          </h1>
          <p className="text-neutral-700 text-sm sm:text-base mt-3 max-w-3xl leading-relaxed">
            Search, filter and inspect Bureau of Indian Standards specifications, gazette orders, amendment histories, and mandatory testing clauses
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            FILTER BAR: Rounded Search + Category Pills
            Matches frame_28.5s.png exactly
            ───────────────────────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#ded8eb] p-6 sm:p-8 space-y-5 shadow-sm">
          {/* Rounded Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by IS code, product name, or keyword..."
              className="w-full pl-12 pr-4 py-3.5 bg-[#cbc5d6] text-neutral-900 placeholder:text-neutral-600 rounded-full font-normal text-sm focus:outline-none focus:ring-2 focus:ring-[#4a127d]/40 transition-all"
            />
          </div>

          {/* Bottom Row: Count + Category Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="text-xs font-semibold text-neutral-800 shrink-0">
              Showing <span className="text-[#301257] font-bold">{filteredStandards.length}</span> standard(s)
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
                        ? "bg-[#4a127d] text-white font-semibold shadow-sm scale-105"
                        : "bg-[#ded9e2] hover:bg-[#cbc5d6] text-[#301257]"
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
            3-COLUMN STANDARDS CARD GRID
            Matches frame_28.5s.png exactly
            ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredStandards.map((std) => {
            const isSaved = savedStandards.includes(std.id);

            return (
              <div
                key={std.id}
                className="group rounded-3xl bg-[#ded8eb] p-6 hover:bg-[#d8d1e6] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge: IS Code */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-[#cbc5d6] text-[#301257] font-semibold text-xs px-3 py-1 rounded-full">
                      {std.code}
                    </span>

                    <button
                      onClick={() => toggleSaveStandard(std.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isSaved ? "text-purple-900 bg-purple-200/80" : "text-neutral-500 hover:text-purple-900"
                      }`}
                      title={isSaved ? "Remove Bookmark" : "Save Standard"}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Standard Title */}
                  <Link href={`/standard/${std.id}`}>
                    <h3 className="text-neutral-900 font-bold text-base line-clamp-2 leading-snug group-hover:text-[#4a127d] transition-colors">
                      {std.title}
                    </h3>
                  </Link>

                  {/* Standard Scope / Clauses Excerpt */}
                  <p className="text-neutral-700 text-xs leading-relaxed line-clamp-4 mt-2.5">
                    {std.scope}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-purple-300/40 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-purple-900 font-semibold">
                    {std.certificationScheme}
                  </span>

                  <Link
                    href={`/standard/${std.id}`}
                    className="font-bold text-[#301257] hover:text-[#540ea3] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Clauses</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#e06319]" />
                  </Link>
                </div>
              </div>
            );
          })}

          {filteredStandards.length === 0 && (
            <div className="col-span-full py-16 text-center text-neutral-600 bg-[#ded8eb] rounded-3xl p-8">
              <p className="text-base font-semibold text-neutral-800">No standards found matching your criteria.</p>
              <p className="text-xs text-neutral-600 mt-1">Try searching with a different keyword or select the &quot;All&quot; category.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-5 py-2 bg-[#4a127d] text-white rounded-full text-xs font-semibold hover:bg-[#5810a5] transition-colors"
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
