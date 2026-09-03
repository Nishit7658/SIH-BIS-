"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { STANDARDS_DATABASE, Standard } from "@/lib/standards-data";
import { BIS_LABORATORIES_DATABASE, BisLaboratory } from "@/lib/laboratories-data";
import { BIS_SCHEMES_DATABASE, BisScheme } from "@/lib/schemes-data";
import { useApp } from "@/context/AppContext";
import {
  Search,
  BookOpen,
  FlaskConical,
  ShieldCheck,
  Filter,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  AlertCircle,
  Building2,
  MapPin,
  Mail,
  Phone,
  ArrowRight
} from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const { savedStandards, toggleSaveStandard } = useApp();

  const [activeTab, setActiveTab] = useState<"standards" | "laboratories" | "schemes">("standards");

  // Standards filter state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [onlyMandatory, setOnlyMandatory] = useState(false);

  // Labs filter state
  const [labSearch, setLabSearch] = useState("");

  const categories = [
    "All",
    "Packaging & Paper",
    "Consumer Goods",
    "Electrical & Electronics",
    "Civil & Construction",
    "Chemicals & Plastics"
  ];

  const filteredStandards = useMemo(() => {
    return STANDARDS_DATABASE.filter((std) => {
      const matchCategory =
        selectedCategory === "All" ||
        std.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        std.division.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchSearch =
        search.trim() === "" ||
        std.code.toLowerCase().includes(search.toLowerCase()) ||
        std.title.toLowerCase().includes(search.toLowerCase()) ||
        std.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));

      const matchMandatory = !onlyMandatory || std.mandatory;

      return matchCategory && matchSearch && matchMandatory;
    });
  }, [search, selectedCategory, onlyMandatory]);

  const filteredLabs = useMemo(() => {
    return BIS_LABORATORIES_DATABASE.filter((lab) => {
      if (!labSearch.trim()) return true;
      const q = labSearch.toLowerCase();
      return (
        lab.name.toLowerCase().includes(q) ||
        lab.city.toLowerCase().includes(q) ||
        (lab.region || lab.type).toLowerCase().includes(q) ||
        lab.nablAccreditationNo.toLowerCase().includes(q) ||
        (lab.capabilities || lab.productCategories).some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [labSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Header with Tab Switcher */}
      <div className="bg-white border border-gov-border rounded p-5 space-y-4 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gov-border pb-4">
          <div>
            <span className="font-mono text-xs font-bold text-gov-saffron uppercase tracking-wide">
              BIS STATUTORY TECHNICAL REGISTRY
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gov-navy font-serif mt-0.5">
              Standards, Testing Laboratories & Certification Schemes
            </h1>
            <p className="text-xs text-gov-slate mt-1">
              Official reference database of active Indian Standards, recognized LRS test houses, and conformity schemes.
            </p>
          </div>

          <div className="flex items-center border border-gov-border rounded overflow-hidden bg-gov-paper text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab("standards")}
              className={`px-3.5 py-2 transition-colors ${
                activeTab === "standards" ? "bg-gov-navy text-white" : "text-gov-slate hover:text-gov-navy"
              }`}
            >
              Standards ({STANDARDS_DATABASE.length})
            </button>
            <button
              onClick={() => setActiveTab("laboratories")}
              className={`px-3.5 py-2 border-l border-gov-border transition-colors ${
                activeTab === "laboratories" ? "bg-gov-navy text-white" : "text-gov-slate hover:text-gov-navy"
              }`}
            >
              Recognized Labs ({BIS_LABORATORIES_DATABASE.length})
            </button>
            <button
              onClick={() => setActiveTab("schemes")}
              className={`px-3.5 py-2 border-l border-gov-border transition-colors ${
                activeTab === "schemes" ? "bg-gov-navy text-white" : "text-gov-slate hover:text-gov-navy"
              }`}
            >
              Schemes ({BIS_SCHEMES_DATABASE.length})
            </button>
          </div>
        </div>

        {/* 2. Standards View Filter Bar */}
        {activeTab === "standards" && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by IS number, title, or keywords (e.g., IS 17526, corrugated box, PVC, plugs)..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gov-border rounded bg-white text-gov-text focus:outline-none focus:border-gov-navy font-medium"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs px-2.5 py-2 border border-gov-border rounded bg-white font-semibold text-gov-navy focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-1.5 text-xs text-gov-text font-semibold cursor-pointer select-none bg-gov-paper px-2.5 py-2 rounded border border-gov-border">
                  <input
                    type="checkbox"
                    checked={onlyMandatory}
                    onChange={(e) => setOnlyMandatory(e.target.checked)}
                    className="rounded text-gov-saffron focus:ring-0"
                  />
                  <span>Mandatory QCO Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 3. Laboratories View Filter Bar */}
        {activeTab === "laboratories" && (
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={labSearch}
              onChange={(e) => setLabSearch(e.target.value)}
              placeholder="Search labs by name, city, state, or testing capabilities (e.g. thermal, drop, XRF, plastic)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-gov-border rounded bg-white text-gov-text focus:outline-none focus:border-gov-navy font-medium"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: STANDARDS TECHNICAL DATA TABLE */}
      {activeTab === "standards" && (
        <div className="border border-gov-border rounded overflow-hidden bg-white shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th className="w-36">IS Number</th>
                  <th className="w-40">Division</th>
                  <th>Standard Title & Technical Scope</th>
                  <th className="w-32">Scheme</th>
                  <th className="w-40">Mandate Status</th>
                  <th className="w-20 text-center">Save</th>
                  <th className="w-24 text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredStandards.map((std) => {
                  const isSaved = savedStandards.includes(std.id);
                  return (
                    <tr key={std.id}>
                      <td className="font-mono font-bold text-gov-navy whitespace-nowrap">
                        {std.code}
                        <span className="block text-[10px] text-gov-slate font-sans font-normal">
                          Reaffirmed: {std.year}
                        </span>
                      </td>
                      <td className="text-gov-slate text-[11px]">
                        {std.division}
                      </td>
                      <td>
                        <Link
                          href={`/standard/${std.id}`}
                          className="font-bold text-gov-navy hover:text-blue-700 hover:underline block"
                        >
                          {std.title}
                        </Link>
                        <p className="text-[11px] text-gov-slate line-clamp-2 mt-0.5">
                          {std.scope}
                        </p>
                      </td>
                      <td className="text-[11px] font-semibold text-gov-slate whitespace-nowrap">
                        {std.certificationScheme}
                      </td>
                      <td>
                        {std.mandatory ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-sm">
                            <AlertCircle className="w-3 h-3 text-gov-saffron shrink-0" />
                            <span>Mandatory QCO</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">
                            Voluntary Standard
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => toggleSaveStandard(std.id)}
                          className={`p-1.5 rounded transition-colors ${
                            isSaved ? "text-amber-600 bg-amber-50" : "text-slate-400 hover:text-gov-navy"
                          }`}
                          title={isSaved ? "Remove Bookmark" : "Save Standard"}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <Link
                          href={`/standard/${std.id}`}
                          className="text-xs font-bold text-gov-navy hover:underline"
                        >
                          Clauses →
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {filteredStandards.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gov-slate text-xs">
                      No standards found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-2.5 bg-gov-paper border-t border-gov-border text-xs text-gov-slate flex items-center justify-between">
            <span>Showing {filteredStandards.length} verified standards.</span>
            <a
              href="https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1"
            >
              <span>Search Official e-BIS Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* VIEW 2: RECOGNIZED TESTING LABORATORIES (LRS) */}
      {activeTab === "laboratories" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white border border-gov-border rounded p-4 space-y-3 shadow-subtle"
              >
                <div className="flex items-start justify-between gap-2 border-b border-gov-border pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-gov-navy bg-gov-paper px-1.5 py-0.5 rounded border border-gov-border">
                      {lab.region || lab.type}
                    </span>
                    <h3 className="font-bold text-sm text-gov-navy font-serif mt-1">
                      {lab.name}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-gov-saffron whitespace-nowrap">
                    {lab.nablAccreditationNo}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gov-slate">
                  <p className="flex items-center gap-1.5 text-gov-text">
                    <MapPin className="w-3.5 h-3.5 text-gov-slate shrink-0" />
                    <span>{lab.address}, {lab.city}, {lab.state}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gov-slate shrink-0" />
                    <span>{lab.phone || lab.contactPhone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gov-slate shrink-0" />
                    <span>{lab.email || lab.contactEmail}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-gov-border">
                  <strong className="text-[10px] font-bold text-gov-slate uppercase tracking-wide block mb-1">
                    Accredited Testing Scope:
                  </strong>
                  <div className="flex flex-wrap gap-1">
                    {(lab.capabilities || lab.productCategories).map((cap, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-gov-paper text-gov-navy px-2 py-0.5 rounded border border-gov-border"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLabs.length === 0 && (
            <div className="bg-white border border-gov-border rounded p-8 text-center text-xs text-gov-slate">
              No testing laboratories match your query.
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: CERTIFICATION SCHEMES MATRIX */}
      {activeTab === "schemes" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BIS_SCHEMES_DATABASE.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white border border-gov-border rounded p-5 space-y-4 shadow-subtle"
              >
                <div className="flex items-start justify-between border-b border-gov-border pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-xs text-gov-saffron uppercase">
                      {scheme.schemeCode || scheme.id}
                    </span>
                    <h3 className="font-bold text-base text-gov-navy font-serif mt-0.5">
                      {scheme.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold bg-gov-navy text-white rounded">
                    {scheme.markIssued}
                  </span>
                </div>

                <p className="text-xs text-gov-slate leading-relaxed">
                  {scheme.fullName} — {scheme.regulatoryNature}. Governing: {scheme.governingRegulation}.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs bg-gov-paper p-3 rounded border border-gov-border">
                  <div>
                    <strong className="text-gov-slate text-[10px] uppercase block">Audit Timeline:</strong>
                    <span className="font-semibold text-gov-navy">{scheme.estimatedTimelineDays}</span>
                  </div>
                  <div>
                    <strong className="text-gov-slate text-[10px] uppercase block">Fee Structure:</strong>
                    <span className="font-semibold text-gov-navy">{scheme.feeStructureSummary}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <strong className="text-xs font-bold text-gov-navy block">
                    Licensing Roadmap:
                  </strong>
                  <ol className="space-y-1 text-xs text-gov-slate list-decimal pl-4">
                    {scheme.keySteps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gov-slate font-mono">Loading Technical Registry...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
