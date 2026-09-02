"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { STANDARDS_DATABASE, Standard } from "@/lib/standards-data";
import { recommendStandardsForBusiness, BusinessRecommendationResult } from "@/lib/recommender";
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
  Layers,
  Factory,
  Package,
  Zap,
  Building2,
  Check
} from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const { savedStandards, toggleSaveStandard } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [onlyMandatory, setOnlyMandatory] = useState(false);

  // Business Recommender state
  const [businessQuery, setBusinessQuery] = useState("");
  const [recommendation, setRecommendation] = useState<BusinessRecommendationResult | null>(null);

  const categories = ["All", "Packaging & Paper", "Electrical", "Electronics & IT", "Civil & Construction", "Chemical & Plastics", "Consumer Goods"];

  const filteredStandards = useMemo(() => {
    return STANDARDS_DATABASE.filter((std) => {
      const matchCategory = selectedCategory === "All" || std.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchMandatory = !onlyMandatory || std.isMandatory;
      const matchText =
        !search.trim() ||
        std.code.toLowerCase().includes(search.toLowerCase()) ||
        std.title.toLowerCase().includes(search.toLowerCase()) ||
        std.businessTypes.some((b) => b.toLowerCase().includes(search.toLowerCase())) ||
        std.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())) ||
        std.summary.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchMandatory && matchText;
    });
  }, [search, selectedCategory, onlyMandatory]);

  const handleGetRecommendation = (queryToUse?: string) => {
    const q = queryToUse || businessQuery;
    if (!q.trim()) return;
    const result = recommendStandardsForBusiness(q.trim());
    setRecommendation(result);
  };

  const businessPresets = [
    { label: "Corrugated Box Packaging", query: "I manufacture corrugated boxes and cartons" },
    { label: "Food Packaging Plastics", query: "I manufacture plastic pouches and containers for food" },
    { label: "Electrical Plugs & Switches", query: "I make electrical plugs, sockets and modular switches" },
    { label: "PVC & HDPE Water Pipes", query: "I manufacture HDPE and UPVC pipes for water supply" },
    { label: "LED Lighting & Drivers", query: "I assemble LED bulbs and power supply drivers" },
    { label: "TMT Steel & Cement", query: "I produce TMT steel rebars and construction cement" },
    { label: "Toys & Baby Products", query: "I manufacture plastic toys and baby products" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-bis-navy via-bis-navy-light to-bis-navy text-white p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <span className="px-3 py-1 rounded-full bg-bis-saffron/20 text-bis-saffron-light text-xs font-bold uppercase tracking-wider border border-bis-saffron/30 inline-block">
            Verified Indian Standards Repository ({STANDARDS_DATABASE.length} Active Codes)
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight">
            Indian Standards Catalog & QCOs
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Discover mandatory specifications, testing clauses, and quality control orders (QCOs) for Indian manufacturing, packaging, electrical, and construction industries.
          </p>
        </div>
      </div>

      {/* Business Standards Recommender Section */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white to-blue-500/10 border-2 border-bis-saffron/30 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-bis-saffron text-white flex items-center justify-center font-bold shadow-sm">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-bis-navy font-display">
              Business Standards Recommender: Which Standards Do You Require?
            </h2>
            <p className="text-xs text-bis-text-secondary">
              Tell us what product or packaging you manufacture, and get the exact statutory Indian Standards, QCO mandates, and required laboratory tests.
            </p>
          </div>
        </div>

        {/* Input bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={businessQuery}
              onChange={(e) => setBusinessQuery(e.target.value)}
              placeholder="e.g. I manufacture corrugated boxes for food packaging, or I make PVC water pipes..."
              className="w-full px-4 py-3 bg-white border border-bis-border rounded-xl text-sm font-semibold text-bis-navy focus:outline-none focus:ring-2 focus:ring-bis-saffron/40 shadow-xs"
            />
          </div>
          <button
            onClick={() => handleGetRecommendation()}
            className="w-full sm:w-auto px-6 py-3 bg-bis-navy hover:bg-bis-navy-light text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-bis-saffron" />
            <span>Find Required Standards</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-semibold">Quick Presets:</span>
          {businessPresets.map((bp) => (
            <button
              key={bp.label}
              onClick={() => {
                setBusinessQuery(bp.query);
                handleGetRecommendation(bp.query);
              }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-bis-canvas border border-bis-border text-bis-navy text-[11px] font-medium transition-all shadow-xs"
            >
              {bp.label}
            </button>
          ))}
        </div>

        {/* Recommendation Result Box */}
        {recommendation && (
          <div className="mt-4 p-6 bg-white rounded-2xl border border-bis-saffron/40 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bis-border pb-4">
              <div>
                <span className="text-xs font-bold text-bis-saffron uppercase tracking-wider">
                  Recommended Industry Domain
                </span>
                <h3 className="text-xl font-bold text-bis-navy font-display mt-0.5">
                  {recommendation.matchedDomain}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Statutory Scheme</span>
                <p className="font-bold text-sm text-bis-blue">{recommendation.scheme}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
              <strong>Statutory Mandate:</strong> {recommendation.mandatoryQcoNotice}
            </div>

            {/* Primary & Supporting Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Standards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-bis-navy uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Primary Mandatory Standards (Required for Certification)
                </h4>
                <div className="space-y-2">
                  {recommendation.primaryStandards.map((std) => (
                    <div key={std.id} className="p-3.5 rounded-xl bg-bis-canvas border border-bis-border space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-bis-blue bg-bis-blue-soft px-2 py-0.5 rounded">
                          {std.code}
                        </span>
                        <Link
                          href={`/standard/${std.id}`}
                          className="text-xs font-bold text-bis-blue hover:underline flex items-center gap-1"
                        >
                          View Clauses →
                        </Link>
                      </div>
                      <p className="font-bold text-xs text-bis-navy">{std.title}</p>
                      <p className="text-[11px] text-bis-text-secondary line-clamp-2">{std.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting Standards & Key Tests */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-bis-navy uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-bis-blue" />
                    Supporting Raw Material & Test Standards
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.supportingStandards.map((std) => (
                      <Link
                        key={std.id}
                        href={`/standard/${std.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-bis-blue-soft border border-bis-border text-xs text-bis-navy font-semibold transition-colors flex items-center gap-1"
                      >
                        <span className="font-mono text-bis-blue">{std.code}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-bis-border">
                  <h4 className="text-xs font-bold text-bis-navy uppercase tracking-wider">
                    Mandatory Laboratory Tests for Approval
                  </h4>
                  <div className="space-y-1.5 text-xs text-bis-text-secondary">
                    {recommendation.keyMandatoryTests.slice(0, 3).map((test, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>{test.testTitle}</strong> ({test.standardCode}): {test.requirement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Link
                href={`/compliance`}
                className="px-4 py-2 bg-bis-navy text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Launch Compliance Checklist Wizard →
              </Link>
            </div>
          </div>
        )}
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
              placeholder="Search across 200+ standards by IS code, title, product name, or business type..."
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
        <span>Showing <strong>{filteredStandards.length}</strong> active standard(s)</span>
        <span>Catalog Status: 100% Valid & Active</span>
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
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between mt-2">
                <span className="text-xs text-bis-text-muted font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {std.clauses.length} Clauses
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
