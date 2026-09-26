"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STANDARDS_DATABASE, Standard } from "@/lib/standards-data";
import { BIS_LABORATORIES_DATABASE } from "@/lib/laboratories-data";
import { BIS_SCHEMES_DATABASE } from "@/lib/schemes-data";
import {
  Search,
  BookOpen,
  FileText,
  ShieldCheck,
  Building2,
  Layers,
  ArrowRight,
  ExternalLink,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  Award,
  Scale,
  Sparkles
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [qcoOnly, setQcoOnly] = useState(false);

  // Sector categories for technical directory
  const sectors = [
    { id: "ALL", label: "All Technical Sectors" },
    { id: "MANDATORY", label: "Mandatory QCO Directives Only" },
    { id: "Packaging & Paper", label: "Packaging & Paper (CHD 15 / TED 24)" },
    { id: "Consumer Goods", label: "Consumer & Mechanical (MED 32)" },
    { id: "Electrical & Electronics", label: "Electrical & IT (ETD / LITD)" },
    { id: "Civil & Construction", label: "Civil & Steel (CED / MTD)" },
    { id: "Chemicals & Plastics", label: "Chemicals & Petrochemicals (PCD)" }
  ];

  // Filtered standards for the live technical table
  const filteredStandards = useMemo(() => {
    return STANDARDS_DATABASE.filter((std) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        std.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
        std.division.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        selectedSector === "ALL" ||
        (selectedSector === "MANDATORY" && std.mandatory) ||
        std.category.toLowerCase().includes(selectedSector.toLowerCase()) ||
        std.division.toLowerCase().includes(selectedSector.toLowerCase());

      const matchesQco = !qcoOnly || std.mandatory;

      return matchesSearch && matchesSector && matchesQco;
    });
  }, [searchQuery, selectedSector, qcoOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  // 6 Manufacturing & STI Blueprints for 2-column staggered grid (matching Figma Section 2)
  const col1Blueprints = [
    {
      id: "is-17526-2021",
      code: "IS 17526:2021",
      title: "Stainless Steel Vacuum Flasks & Insulated Containers",
      qco: "DPIIT Cookware & Insulated Flasks QCO",
      scheme: "Scheme I (ISI Mark)",
      materials: "Grade 304 (Cr 17.5-19.5%, Ni 8.0-10.5%) per IS 6911",
      labTests: "Thermal retention at 95°C (>=60°C at 6h), 80°C seal leak test, 1.0m drop test",
      machinery: "Deep drawing press, vacuum furnace (<10^-4 mbar), laser CM/L marking"
    },
    {
      id: "is-1293-2019",
      code: "IS 1293:2019",
      title: "Plugs and Socket-Outlets (up to 250V / 16A)",
      qco: "Electrical Accessories Quality Control Order",
      scheme: "Scheme I (ISI Mark)",
      materials: "Extruded brass pins (Cu 58-60%), flame-retardant polycarbonate",
      labTests: "850°C Glow wire ignition test, temperature rise <= 45K, 10k cycle endurance",
      machinery: "Automatic pin turning lathe, injection moulding press, pneumatic riveter"
    },
    {
      id: "is-14534-1998",
      code: "IS 14534:1998",
      title: "Guidelines for Recovery and Recycling of Plastics",
      qco: "Plastic Waste Management Statutory Directives",
      scheme: "Scheme I (Technical Standard)",
      materials: "Virgin and post-consumer polyethylene, polypropylene, PET resins",
      labTests: "Melt flow rate (MFR) per IS 2530, heavy metal trace limits, density verification",
      machinery: "Two-stage shredder, sink-float density separator, twin-screw degassing extruder"
    }
  ];

  const col2Blueprints = [
    {
      id: "is-2771-1-2020",
      code: "IS 2771 (Part 1):2020",
      title: "Corrugated Fibreboard Boxes for General Packaging",
      qco: "Packaging Materials Quality Control Order",
      scheme: "Scheme I (ISI Mark)",
      materials: "Kraft linerboard (IS 1397), starch corrugating adhesive",
      labTests: "Bursting strength (700-1800 kPa), Edge Crush Test (ECT >= 3.5 kN/m), Cobb 60",
      machinery: "Single facer / double backer corrugator line, rotary slotter, flexo printer"
    },
    {
      id: "is-4984-2016",
      code: "IS 4984:2016",
      title: "High Density Polyethylene (HDPE) Pipes for Water Supply",
      qco: "Piping & Water Conveyance Quality Control Order",
      scheme: "Scheme I (ISI Mark)",
      materials: "Virgin PE 63 / PE 80 / PE 100 HDPE polymer resin",
      labTests: "100-hour hydrostatic internal pressure test at 80°C, carbon black dispersion",
      machinery: "Single screw vacuum calibrating pipe extruder, planetary saw cutter, coiler"
    },
    {
      id: "is-10146-1982",
      code: "IS 10146:1982",
      title: "Polyethylene for Safe Contact with Foodstuffs & Pharmaceuticals",
      qco: "Food Contact Polymers Safety Order",
      scheme: "Scheme I (ISI Mark)",
      materials: "High-purity LDPE / LLDPE without toxic plasticizers or heavy metals",
      labTests: "Overall migration test into food simulants (<= 10 mg/dm² per IS 9845)",
      machinery: "Blown film extrusion line, air ring chiller, gravimetric granule doser"
    }
  ];

  return (
    <div className="space-y-0 text-gov-text">
      {/* ─────────────────────────────────────────────────────────────
          1. FIGMA HERO SECTION: Centered Headline, Emblem & Search Console
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gov-border py-14 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Subtle Government Geometric Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Institutional Statutory Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-[11px] font-bold text-gov-navy uppercase tracking-wider shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-gov-saffron inline-block animate-pulse" />
            <span>Government of India • Bureau of Indian Standards (BIS Act, 2016)</span>
          </div>

          {/* Centered Main Title (matching Figma "FONT" center block) */}
          <div className="space-y-2 max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-gov-navy leading-tight">
              Technical Regulatory &amp; Conformity Assessment Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-gov-slate max-w-2xl mx-auto leading-relaxed font-medium">
              Statutory guidance system for 250+ enforced Indian Standards (IS), mandatory Quality Control Orders (QCOs), testing parameters, and Scheme of Testing &amp; Inspection (STI) blueprints.
            </p>
          </div>

          {/* Centered Large Search Input Bar (matching Figma centered search box) */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="flex rounded-md border-2 border-gov-navy overflow-hidden bg-white shadow-md focus-within:border-gov-saffron transition-colors">
              <div className="px-3.5 flex items-center bg-slate-50 border-r border-slate-200 text-gov-slate">
                <Search className="w-5 h-5 text-gov-navy" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search standard by IS Number, title, or regulation (e.g. IS 17526, IS 1293, QCO directive)..."
                className="w-full px-4 py-3 text-xs sm:text-sm text-gov-navy placeholder:text-slate-400 font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gov-navy hover:bg-slate-900 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4 text-gov-saffron" />
              </button>
            </div>

            {/* Fast Statutory Citation Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-gov-slate">
              <span className="font-semibold text-gov-navy">Frequent Citations:</span>
              <button
                type="button"
                onClick={() => setSearchQuery("IS 17526")}
                className="hover:text-gov-navy hover:underline font-medium"
              >
                IS 17526 (Vacuum Flasks)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery("IS 1293")}
                className="hover:text-gov-navy hover:underline font-medium"
              >
                IS 1293 (Plugs &amp; Sockets)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery("IS 2771")}
                className="hover:text-gov-navy hover:underline font-medium"
              >
                IS 2771 (Corrugated Boxes)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery("IS 4984")}
                className="hover:text-gov-navy hover:underline font-medium"
              >
                IS 4984 (HDPE Pipes)
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. FIGMA SECTION 2: Split Showcase (Left Spotlight + Right 2-Col Staggered Grid)
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-slate-50/60 border-b border-gov-border py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Feature Spotlight Banner (matching Figma left "FONT" card) */}
            <div className="lg:col-span-5 bg-gov-navy text-white rounded-lg p-6 sm:p-8 shadow-md border border-slate-800 space-y-6 lg:sticky lg:top-28">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-400 border border-slate-700">
                  <Scale className="w-3 h-3 text-amber-400" />
                  Statutory STI Specifications
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-white leading-snug">
                  Factory Setup &amp; In-House QC Lab Blueprints
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Complete technical frameworks for establishing licensed manufacturing units compliant with the statutory Scheme of Testing &amp; Inspection (STI) under Section 13 of the BIS Act, 2016.
                </p>
              </div>

              {/* Institutional Checklist Pillars */}
              <div className="space-y-3 border-t border-slate-800 pt-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gov-saffron" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[12px]">Raw Material Verification</h4>
                    <p className="text-slate-400 text-[11px]">
                      Mandatory chemical composition analysis and mill test report (MTR) reconciliation before production.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gov-saffron" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[12px]">In-House Calibrated Lab Setup</h4>
                    <p className="text-slate-400 text-[11px]">
                      Dedicated quality testing apparatus with NABL-traceable periodic calibration records.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gov-saffron" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[12px]">Standard Mark &amp; Laser Engraving</h4>
                    <p className="text-slate-400 text-[11px]">
                      Permanent ISI Mark marking, CM/L license number, batch/lot identification, and date coding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Call-to-action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/chat?q=Generate%20statutory%20factory%20setup%20blueprint%20for%20manufacturing"
                  className="px-4 py-2.5 bg-gov-saffron hover:bg-amber-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Consult Blueprint AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/verify"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 flex items-center justify-center transition-colors"
                >
                  Verify CM/L License
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: 2-Column Staggered Blueprint Cards (matching Figma 2-col staggered cards) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Column 1 (3 Cards) */}
              <div className="space-y-4">
                {col1Blueprints.map((bp) => (
                  <div
                    key={bp.id}
                    className="bg-white border border-gov-border rounded-lg p-5 space-y-3 shadow-subtle hover:border-gov-slate transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-gov-border pb-2.5">
                      <div>
                        <span className="font-mono font-bold text-xs text-gov-saffron">
                          {bp.code}
                        </span>
                        <h3 className="font-bold text-sm text-gov-navy font-serif mt-0.5 leading-snug">
                          {bp.title}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-gov-paper border border-gov-border rounded text-gov-slate whitespace-nowrap shrink-0">
                        {bp.scheme}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gov-slate block">
                          Raw Material Standard:
                        </span>
                        <p className="text-gov-text text-[11px] font-medium">{bp.materials}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gov-slate block">
                          Mandatory STI Testing:
                        </span>
                        <p className="text-gov-text text-[11px] font-medium">{bp.labTests}</p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-gov-border flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-amber-800 line-clamp-1">
                        {bp.qco}
                      </span>
                      <Link
                        href={`/standard/${bp.id}`}
                        className="font-bold text-gov-navy hover:text-blue-700 hover:underline flex items-center gap-1 shrink-0 text-xs"
                      >
                        <span>Clauses</span>
                        <ArrowRight className="w-3 h-3 text-gov-saffron" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column 2 (3 Cards with top offset / stagger matching Figma) */}
              <div className="space-y-4 sm:mt-6">
                {col2Blueprints.map((bp) => (
                  <div
                    key={bp.id}
                    className="bg-white border border-gov-border rounded-lg p-5 space-y-3 shadow-subtle hover:border-gov-slate transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-gov-border pb-2.5">
                      <div>
                        <span className="font-mono font-bold text-xs text-gov-saffron">
                          {bp.code}
                        </span>
                        <h3 className="font-bold text-sm text-gov-navy font-serif mt-0.5 leading-snug">
                          {bp.title}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-gov-paper border border-gov-border rounded text-gov-slate whitespace-nowrap shrink-0">
                        {bp.scheme}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gov-slate block">
                          Raw Material Standard:
                        </span>
                        <p className="text-gov-text text-[11px] font-medium">{bp.materials}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gov-slate block">
                          Mandatory STI Testing:
                        </span>
                        <p className="text-gov-text text-[11px] font-medium">{bp.labTests}</p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-gov-border flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-amber-800 line-clamp-1">
                        {bp.qco}
                      </span>
                      <Link
                        href={`/standard/${bp.id}`}
                        className="font-bold text-gov-navy hover:text-blue-700 hover:underline flex items-center gap-1 shrink-0 text-xs"
                      >
                        <span>Clauses</span>
                        <ArrowRight className="w-3 h-3 text-gov-saffron" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FIGMA SECTION 3: Wide Technical Standards Registry Table
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gov-border py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-gov-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gov-navy" />
                <h2 className="text-lg sm:text-xl font-bold text-gov-navy font-serif">
                  Active Indian Standards Technical Directory
                </h2>
              </div>
              <p className="text-xs text-gov-slate mt-0.5">
                Showing {filteredStandards.length} verified standards across civil, electrical, chemical, and mechanical engineering councils.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-gov-text font-semibold cursor-pointer select-none bg-gov-paper px-2.5 py-1.5 rounded border border-gov-border">
                <input
                  type="checkbox"
                  checked={qcoOnly}
                  onChange={(e) => setQcoOnly(e.target.checked)}
                  className="rounded text-gov-saffron focus:ring-0"
                />
                <span>Mandatory QCO Directives Only</span>
              </label>

              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-gov-paper border border-gov-border rounded font-semibold text-gov-navy focus:outline-none"
              >
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* High-Density Government Tabular View */}
          <div className="border border-gov-border rounded-lg overflow-hidden bg-white shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left table-dense">
                <thead>
                  <tr>
                    <th className="w-36">IS Number &amp; Year</th>
                    <th className="w-36">Division Council</th>
                    <th>Standard Title &amp; Statutory Scope</th>
                    <th className="w-36">Scheme Route</th>
                    <th className="w-44">Regulatory Status</th>
                    <th className="w-24 text-right">Inspection</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStandards.slice(0, 15).map((std) => (
                    <tr key={std.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="font-mono font-bold text-gov-navy whitespace-nowrap">
                        {std.code}
                        <span className="block text-[10px] text-gov-slate font-sans font-normal">
                          Year: {std.year}
                        </span>
                      </td>
                      <td className="text-gov-slate text-[11px] whitespace-nowrap">
                        {std.division}
                      </td>
                      <td>
                        <Link
                          href={`/standard/${std.id}`}
                          className="font-bold text-gov-navy hover:text-blue-700 hover:underline block leading-snug"
                        >
                          {std.title}
                        </Link>
                        <p className="text-[11px] text-gov-slate line-clamp-1 mt-0.5 font-normal">
                          {std.scope}
                        </p>
                      </td>
                      <td className="text-[11px] font-semibold text-gov-slate whitespace-nowrap">
                        {std.certificationScheme}
                      </td>
                      <td>
                        {std.mandatory ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-sm">
                            <AlertCircle className="w-3 h-3 text-gov-saffron shrink-0" />
                            <span>Mandatory QCO</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium">
                            Voluntary ISI
                          </span>
                        )}
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <Link
                          href={`/standard/${std.id}`}
                          className="text-xs font-bold text-gov-navy hover:text-blue-700 underline"
                        >
                          Clauses →
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filteredStandards.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gov-slate text-xs">
                        No standards match your filter criteria. Try adjusting the search query or sector filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 bg-gov-paper border-t border-gov-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gov-slate">
              <span>Showing top 15 of {filteredStandards.length} active standards.</span>
              <Link href="/explore" className="font-bold text-gov-navy hover:underline flex items-center gap-1">
                <span>Open Full Standards Catalog with NABL Testing Lab Network</span>
                <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FIGMA SECTION 4: Centered Title + 3 Equal Conformity Pillars
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-slate-50/60 border-b border-gov-border py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Centered Heading (matching Figma "FONT" centered title) */}
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-gov-saffron uppercase tracking-widest block">
              Conformity Assessment Regulations, 2018
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-gov-navy tracking-tight">
              Statutory Conformity &amp; Certification Pillars
            </h2>
            <p className="text-xs sm:text-sm text-gov-slate leading-relaxed">
              Official certification routes enforced by the Bureau of Indian Standards for domestic manufacturing and international import clearance.
            </p>
          </div>

          {/* 3 Prominent Columns (matching Figma 3 equal cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Pillar 1: Scheme I (ISI Mark) */}
            <div className="bg-white border border-gov-border rounded-lg p-6 space-y-4 shadow-subtle hover:border-gov-navy transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-gov-navy text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="font-mono font-bold text-[10px] text-gov-saffron uppercase">
                    Scheme I (BIS Act 2016)
                  </span>
                  <h3 className="text-base font-bold text-gov-navy font-serif mt-0.5">
                    Product Certification (ISI Standard Mark)
                  </h3>
                </div>
                <p className="text-xs text-gov-slate leading-relaxed">
                  Third-party conformity assessment for products manufactured under mandatory Quality Control Orders (QCOs) ensuring safety and performance compliance.
                </p>
                <div className="bg-gov-paper border border-gov-border rounded p-3 text-[11px] space-y-1.5">
                  <p><strong>Mark:</strong> Standard Mark with CM/L License Number</p>
                  <p><strong>Inspection:</strong> Factory audit + In-house STI lab verification</p>
                  <p><strong>Sampling:</strong> Independent testing at NABL / BIS laboratories</p>
                </div>
              </div>
              <Link
                href="/explore?scheme=Scheme%20I"
                className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1 pt-2 border-t border-gov-border"
              >
                <span>View Scheme I Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
              </Link>
            </div>

            {/* Pillar 2: Scheme II (CRS) */}
            <div className="bg-white border border-gov-border rounded-lg p-6 space-y-4 shadow-subtle hover:border-gov-navy transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-gov-navy text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="font-mono font-bold text-[10px] text-gov-saffron uppercase">
                    Scheme II (MeitY Mandate)
                  </span>
                  <h3 className="text-base font-bold text-gov-navy font-serif mt-0.5">
                    Compulsory Registration Scheme (CRS)
                  </h3>
                </div>
                <p className="text-xs text-gov-slate leading-relaxed">
                  Self-declaration of conformity framework designated for electronics, IT goods, telecom equipment, and solar inverters.
                </p>
                <div className="bg-gov-paper border border-gov-border rounded p-3 text-[11px] space-y-1.5">
                  <p><strong>Mark:</strong> Standard Registration Mark (IS Number / R-Number)</p>
                  <p><strong>Inspection:</strong> Lab test report registration without prior factory audit</p>
                  <p><strong>Validity:</strong> 2-year renewal cycle based on accredited surveillance</p>
                </div>
              </div>
              <Link
                href="/verify"
                className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1 pt-2 border-t border-gov-border"
              >
                <span>Verify CRS Registration</span>
                <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
              </Link>
            </div>

            {/* Pillar 3: Scheme IV & Hallmark */}
            <div className="bg-white border border-gov-border rounded-lg p-6 space-y-4 shadow-subtle hover:border-gov-navy transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-gov-navy text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="font-mono font-bold text-[10px] text-gov-saffron uppercase">
                    Scheme IV &amp; Hallmarking
                  </span>
                  <h3 className="text-base font-bold text-gov-navy font-serif mt-0.5">
                    Hallmarking (HUID) &amp; Eco Mark
                  </h3>
                </div>
                <p className="text-xs text-gov-slate leading-relaxed">
                  Statutory purity certification for precious gold/silver articles and environmental lifecycle conformity under the national Eco-Mark scheme.
                </p>
                <div className="bg-gov-paper border border-gov-border rounded p-3 text-[11px] space-y-1.5">
                  <p><strong>Mark:</strong> BIS Hallmark with 6-digit alphanumeric HUID</p>
                  <p><strong>Testing:</strong> X-ray Fluorescence (XRF) &amp; Fire Assay at AHC</p>
                  <p><strong>Traceability:</strong> Real-time consumer verification on BIS CARE portal</p>
                </div>
              </div>
              <Link
                href="/explore?scheme=Hallmark"
                className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1 pt-2 border-t border-gov-border"
              >
                <span>Explore Hallmarking Standards</span>
                <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. TESTING LABORATORIES & EMPANELED NETWORK
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-gov-navy" />
                <h2 className="text-base sm:text-lg font-bold text-gov-navy font-serif">
                  BIS Recognized Testing Laboratories (LRS Test Houses)
                </h2>
              </div>
              <p className="text-xs text-gov-slate mt-0.5">
                Empaneled government and accredited NABL test facilities authorized for independent statutory conformity testing.
              </p>
            </div>

            <Link href="/explore" className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1">
              <span>View Laboratory Network</span>
              <ArrowRight className="w-3 h-3 text-gov-saffron" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BIS_LABORATORIES_DATABASE.slice(0, 4).map((lab) => (
              <div
                key={lab.id}
                className="bg-gov-paper border border-gov-border rounded-lg p-3.5 space-y-2 shadow-subtle hover:border-gov-slate transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gov-navy bg-white px-2 py-0.5 rounded border border-gov-border">
                    {lab.region || lab.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {lab.nablAccreditationNo}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-gov-navy leading-tight">
                  {lab.name}
                </h4>
                <p className="text-[11px] text-gov-slate">
                  {lab.city}, {lab.state}
                </p>
                <div className="pt-2 border-t border-gov-border text-[10px] text-gov-slate">
                  <strong>Scope:</strong> {(lab.capabilities || lab.productCategories).slice(0, 2).join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
