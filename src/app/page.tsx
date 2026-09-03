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
  HelpCircle,
  Filter,
  Download,
  Printer
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [qcoOnly, setQcoOnly] = useState(false);

  // Sector categories
  const sectors = [
    { id: "ALL", label: "All Sectors" },
    { id: "MANDATORY", label: "Mandatory QCO Only" },
    { id: "Packaging & Paper", label: "Packaging & Paper (CHD 15 / TED 24)" },
    { id: "Consumer Goods", label: "Consumer & Mechanical (MED 32)" },
    { id: "Electrical & Electronics", label: "Electrical & IT (ETD / LITD)" },
    { id: "Civil & Construction", label: "Civil & Steel (CED / MTD)" },
    { id: "Chemicals & Plastics", label: "Chemicals & Piping (PCD)" }
  ];

  // Filtered standards for the live technical table
  const filteredStandards = useMemo(() => {
    return STANDARDS_DATABASE.filter(std => {
      const matchesSearch = 
        searchQuery.trim() === "" ||
        std.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
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

  const manufacturingBlueprints = [
    {
      id: "is-17526-2021",
      code: "IS 17526:2021",
      title: "Stainless Steel Vacuum Flasks & Insulated Containers",
      qco: "Cookware, Utensils & Insulated Flasks QCO (DPIIT)",
      scheme: "Scheme I (ISI Mark)",
      materials: "Grade 304 (Cr 17.5-19.5%, Ni 8.0-10.5%) per IS 6911",
      labTests: "Thermal retention at 95°C (>=60°C at 6h), 80°C seal leak test, 1.0m concrete drop test",
      machinery: "Deep drawing hydraulic press, CNC neck threading, vacuum furnace (<10^-4 mbar), laser marking"
    },
    {
      id: "is-2771-1-2020",
      code: "IS 2771 (Part 1):2020",
      title: "Corrugated Fibreboard Boxes for General Packaging",
      qco: "Packaging Materials Quality Control Order",
      scheme: "Scheme I (ISI Mark)",
      materials: "Kraft linerboard (IS 1397), starch corrugating adhesive",
      labTests: "Bursting strength (700-1800 kPa), Edge Crush Test (ECT >= 3.5 kN/m), Cobb 60 water absorption",
      machinery: "Single facer / double backer corrugator line, rotary slotter, flexo printer, auto stitcher"
    },
    {
      id: "is-1293-2019",
      code: "IS 1293:2019",
      title: "Plugs and Socket-Outlets (up to 250V / 16A)",
      qco: "Electrical Accessories Quality Control Order",
      scheme: "Scheme I (ISI Mark)",
      materials: "Brass pins (Cu 58-60%), flame-retardant polycarbonate/bakelite resin",
      labTests: "850°C Glow wire ignition test, temperature rise <= 45K, 10,000 cycle endurance",
      machinery: "Automatic pin turning lathe, compression/injection moulding press, pneumatic assembly riveter"
    },
    {
      id: "is-4984-2016",
      code: "IS 4984:2016",
      title: "High Density Polyethylene (HDPE) Pipes for Water Supply",
      qco: "Piping & Water Conveyance Quality Control Order",
      scheme: "Scheme I (ISI Mark)",
      materials: "Virgin PE 63 / PE 80 / PE 100 HDPE polymer resin",
      labTests: "100-hour hydrostatic internal pressure test at 80°C, carbon black dispersion, reversion test",
      machinery: "Single screw vacuum calibrating pipe extruder, planetary saw cutter, coiler unit"
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Official Regulatory Search Console */}
      <section className="bg-gov-navy text-white border-b border-gov-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">
                <span>National Standards Repository</span>
                <span>•</span>
                <span>All Active Codes Enforced Under BIS Act 2016</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black font-serif tracking-tight text-white">
                Technical Regulatory & Conformity Assessment Intelligence
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Clause-level compliance verification, testing parameters, mandatory QCO directives, and factory setup blueprints.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/chat"
                className="px-4 py-2 bg-gov-saffron hover:bg-amber-600 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
              >
                <span>Consult AI Expert</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/verify"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition-colors"
              >
                Verify CM/L License
              </Link>
            </div>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-4xl">
            <div className="flex rounded border border-slate-700 overflow-hidden bg-white shadow-sm focus-within:border-gov-saffron">
              <div className="px-3.5 flex items-center bg-slate-100 border-r border-slate-300 text-gov-slate">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search standard by IS Number, product name, or keyword (e.g., IS 17526, vacuum flasks, kraft paper, plug pin dimensions)..."
                className="w-full px-3.5 py-2.5 text-gov-text text-xs sm:text-sm focus:outline-none placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gov-slate hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Fast Technical Filters:</span>
              <button
                type="button"
                onClick={() => setSearchQuery("IS 17526")}
                className="hover:text-white underline"
              >
                IS 17526 (Flasks)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery("IS 2771")}
                className="hover:text-white underline"
              >
                IS 2771 (Corrugated Boxes)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery("IS 1293")}
                className="hover:text-white underline"
              >
                IS 1293 (Plugs)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery("IS 4984")}
                className="hover:text-white underline"
              >
                IS 4984 (HDPE Pipes)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery("IS 16046")}
                className="hover:text-white underline"
              >
                IS 16046 (Batteries)
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Live Technical Standards Registry (High-Density Tabular View) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-gov-border pb-2">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gov-navy" />
              <h2 className="text-base sm:text-lg font-bold text-gov-navy font-serif">
                Active Indian Standards Technical Directory
              </h2>
            </div>
            <p className="text-xs text-gov-slate">
              Showing {filteredStandards.length} verified standards. Filter by division council or regulatory mandate.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-gov-text font-semibold cursor-pointer select-none bg-white px-2.5 py-1.5 rounded border border-gov-border">
              <input
                type="checkbox"
                checked={qcoOnly}
                onChange={(e) => setQcoOnly(e.target.checked)}
                className="rounded text-gov-saffron focus:ring-0"
              />
              <span>Mandatory QCO Only</span>
            </label>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-white border border-gov-border rounded font-semibold text-gov-navy focus:outline-none"
            >
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* High-Density Data Table */}
        <div className="border border-gov-border rounded overflow-hidden bg-white shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th className="w-36">IS Number</th>
                  <th className="w-32">Division</th>
                  <th>Standard Title & Scope Summary</th>
                  <th className="w-36">Scheme</th>
                  <th className="w-44">Regulatory Status</th>
                  <th className="w-24 text-right">Inspection</th>
                </tr>
              </thead>
              <tbody>
                {filteredStandards.slice(0, 15).map((std) => (
                  <tr key={std.id} className="transition-colors">
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
                        className="font-bold text-gov-navy hover:text-blue-700 hover:underline block"
                      >
                        {std.title}
                      </Link>
                      <p className="text-[11px] text-gov-slate line-clamp-1 mt-0.5">
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

          <div className="px-4 py-2.5 bg-gov-paper border-t border-gov-border flex items-center justify-between text-xs text-gov-slate">
            <span>Showing top 15 of {filteredStandards.length} active standards.</span>
            <Link href="/explore" className="font-bold text-gov-navy hover:underline flex items-center gap-1">
              <span>Open Full Catalog with Laboratory Directory</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Manufacturing & Factory Setup Blueprints (Engineering Modules) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="border-b border-gov-border pb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gov-navy" />
              <h2 className="text-base sm:text-lg font-bold text-gov-navy font-serif">
                Factory Setup & In-House QC Lab Blueprints (BIS STI)
              </h2>
            </div>
            <p className="text-xs text-gov-slate">
              Complete technical documentation for setting up licensed manufacturing plants compliant with the statutory Scheme of Testing & Inspection.
            </p>
          </div>

          <Link href="/chat?q=Give%20me%20the%20factory%20setup%20blueprint%20for%20stainless%20steel%20bottles" className="text-xs font-bold text-gov-navy hover:underline hidden sm:block">
            Consult Blueprint Generator →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {manufacturingBlueprints.map((bp) => (
            <div
              key={bp.id}
              className="bg-white border border-gov-border rounded p-5 space-y-3 shadow-subtle hover:border-gov-slate transition-colors"
            >
              <div className="flex items-start justify-between gap-2 border-b border-gov-border pb-2.5">
                <div>
                  <span className="font-mono font-bold text-xs text-gov-saffron">
                    {bp.code}
                  </span>
                  <h3 className="font-bold text-sm text-gov-navy font-serif mt-0.5">
                    {bp.title}
                  </h3>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-gov-paper border border-gov-border rounded text-gov-slate whitespace-nowrap">
                  {bp.scheme}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-gov-slate text-[11px] block uppercase tracking-wide">
                    Raw Material Specification:
                  </strong>
                  <p className="text-gov-text">{bp.materials}</p>
                </div>

                <div>
                  <strong className="text-gov-slate text-[11px] block uppercase tracking-wide">
                    Mandatory In-House STI Testing Setup:
                  </strong>
                  <p className="text-gov-text">{bp.labTests}</p>
                </div>

                <div>
                  <strong className="text-gov-slate text-[11px] block uppercase tracking-wide">
                    Production Machinery Line:
                  </strong>
                  <p className="text-gov-text">{bp.machinery}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gov-border flex items-center justify-between">
                <span className="text-[11px] text-amber-800 font-semibold">
                  {bp.qco}
                </span>
                <Link
                  href={`/standard/${bp.id}`}
                  className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1"
                >
                  <span>View Full Blueprint</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Conformity Assessment Schemes Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="border-b border-gov-border pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gov-navy" />
            <h2 className="text-base sm:text-lg font-bold text-gov-navy font-serif">
              Conformity Assessment Schemes (BIS Regulations)
            </h2>
          </div>
          <p className="text-xs text-gov-slate">
            Comparison of official licensing routes under the Bureau of Indian Standards (Conformity Assessment) Regulations, 2018.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {BIS_SCHEMES_DATABASE.map((sch) => (
            <div
              key={sch.id}
              className="bg-white border border-gov-border rounded p-3.5 space-y-2 flex flex-col justify-between shadow-subtle"
            >
              <div className="space-y-1">
                <span className="font-mono font-bold text-[10px] text-gov-slate">
                  {sch.schemeCode || sch.id.toUpperCase()}
                </span>
                <h3 className="font-bold text-xs text-gov-navy leading-tight">
                  {sch.name}
                </h3>
                <p className="text-[11px] text-gov-slate line-clamp-3">
                  {sch.regulatoryNature}
                </p>
              </div>

              <div className="pt-2 border-t border-gov-border text-[10px] space-y-1 text-gov-slate">
                <p><strong>Mark:</strong> {sch.markIssued}</p>
                <p><strong>Timeline:</strong> {sch.estimatedTimelineDays}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Central Testing Laboratories (LRS Directory) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="border-b border-gov-border pb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-gov-navy" />
              <h2 className="text-base sm:text-lg font-bold text-gov-navy font-serif">
                BIS Recognized Testing Laboratories (LRS Test Houses)
              </h2>
            </div>
            <p className="text-xs text-gov-slate">
              Empaneled government and third-party NABL test facilities recognized for independent statutory sample testing.
            </p>
          </div>

          <Link href="/explore" className="text-xs font-bold text-gov-navy hover:underline">
            View All Test Labs →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BIS_LABORATORIES_DATABASE.slice(0, 4).map((lab) => (
            <div
              key={lab.id}
              className="bg-white border border-gov-border rounded p-3.5 space-y-2 shadow-subtle"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gov-navy bg-gov-paper px-1.5 py-0.5 rounded border border-gov-border">
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
      </section>
    </div>
  );
}
