"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getStandardById } from "@/lib/standards-data";
import { generateStandardSchemaJsonLd } from "@/lib/schema-generator";
import { useApp } from "@/context/AppContext";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Printer,
  ExternalLink,
  Building2,
  Layers,
  FlaskConical,
  Scale
} from "lucide-react";

export default function StandardDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const standard = getStandardById(id);
  const { savedStandards, toggleSaveStandard } = useApp();

  const [activeTab, setActiveTab] = useState<"clauses" | "blueprint" | "amendments" | "scope">("clauses");
  const [clauseSearch, setClauseSearch] = useState("");

  if (!standard) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-gov-navy font-serif">Standard Specification Not Found</h1>
        <p className="text-xs text-gov-slate">
          No Indian Standard matching designation "{id}" was found in the digital repository.
        </p>
        <Link href="/explore" className="inline-block px-4 py-2 bg-gov-navy text-white rounded text-xs font-bold">
          ← Back to Standards Directory
        </Link>
      </div>
    );
  }

  const jsonLd = generateStandardSchemaJsonLd(standard);
  const isSaved = savedStandards.includes(standard.id);

  const filteredClauses = standard.clauses.filter(c => 
    clauseSearch.trim() === "" ||
    c.number.toLowerCase().includes(clauseSearch.toLowerCase()) ||
    c.title.toLowerCase().includes(clauseSearch.toLowerCase()) ||
    c.content.toLowerCase().includes(clauseSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-600 no-print">
        <Link href="/explore" className="hover:text-blue-700 font-semibold flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>Back to Technical Standards Registry</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Specification</span>
          </button>
          <button
            onClick={() => toggleSaveStandard(standard.id)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-blue-700" /> : <Bookmark className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isSaved ? "Saved" : "Save Standard"}</span>
          </button>
        </div>
      </div>

      {/* 2. Official Standard Header Document Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 border-b border-slate-200 pb-5">
          <div className="space-y-2 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold bg-[#0A192F] text-white px-3.5 py-1 rounded-md shadow-xs">
                {standard.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Reaffirmed {standard.year} • Division Council: {standard.division}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans tracking-tight leading-snug">
              {standard.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {standard.scope}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-xs space-y-2 shrink-0 min-w-[240px] shadow-xs">
            <div>
              <strong className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block font-mono">Conformity Scheme:</strong>
              <span className="font-bold text-[#0A192F]">{standard.certificationScheme}</span>
            </div>
            <div>
              <strong className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block font-mono">Statutory Mandate:</strong>
              {standard.mandatory ? (
                <span className="font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full inline-block mt-0.5 text-[11px]">
                  Mandatory QCO Enforced
                </span>
              ) : (
                <span className="text-slate-500 font-medium">Voluntary Standard</span>
              )}
            </div>
            {standard.qcoOrder && (
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <strong>Gazette:</strong> {standard.qcoOrder}
              </div>
            )}
          </div>
        </div>

        {/* 3. Document Tab Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 no-print">
          <button
            onClick={() => setActiveTab("clauses")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "clauses"
                ? "bg-[#0A192F] text-white shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            Technical Clauses & Tables ({standard.clauses.length})
          </button>

          {standard.blueprint && (
            <button
              onClick={() => setActiveTab("blueprint")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "blueprint"
                  ? "bg-[#0A192F] text-white shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Factory & Business Setup Guide</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("scope")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "scope"
                ? "bg-[#0A192F] text-white shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            Scope & Normative References
          </button>

          <a
            href="https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"
            target="_blank"
            rel="noreferrer"
            className="sm:ml-auto px-4 py-2 text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>Official e-BIS Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* TAB 1: FULL CLAUSES & DATA TABLES */}
      {activeTab === "clauses" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs no-print">
            <span className="text-xs font-bold text-[#0A192F]">
              Showing {filteredClauses.length} technical clauses with test requirements
            </span>
            <div className="relative">
              <input
                type="text"
                value={clauseSearch}
                onChange={(e) => setClauseSearch(e.target.value)}
                placeholder="Search clause by title, number, or keyword…"
                className="px-4 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white w-full sm:w-72 shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredClauses.map((clause) => (
              <div
                key={clause.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs hover:border-blue-400 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-xs bg-slate-100 text-[#0A192F] border border-slate-200 px-2.5 py-1 rounded-md inline-block">
                      Clause {clause.number}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-sans mt-1.5">
                      {clause.title}
                    </h3>
                  </div>
                  {(clause.testRequirement || clause.testMethod) && (
                    <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-md border border-blue-200 self-start sm:self-center">
                      Method: {clause.testRequirement || clause.testMethod}
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {clause.content}
                </div>

                {/* Specification Table Rendering */}
                {clause.tableData && (
                  <div className="pt-3 border-t border-slate-100 overflow-x-auto">
                    <strong className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono">
                      Technical Parameter Table:
                    </strong>
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                          <tr>
                            {clause.tableData.headers.map((h, i) => (
                              <th key={i} className="px-4 py-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {clause.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className={`px-4 py-2.5 ${cIdx === 0 ? "font-bold text-[#0A192F]" : "text-slate-700"}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FACTORY & BUSINESS SETUP BLUEPRINT */}
      {activeTab === "blueprint" && standard.blueprint && (
        <div className="bg-white border border-gov-border rounded p-6 space-y-6 shadow-subtle">
          <div className="border-b border-gov-border pb-3">
            <h2 className="text-base font-bold text-gov-navy font-serif">
              Mandatory Factory & Quality Control Setup Blueprint (BIS STI)
            </h2>
            <p className="text-xs text-gov-slate mt-0.5">
              Statutory manufacturing requirements, production machinery, in-house laboratory instruments, and licensing roadmap.
            </p>
          </div>

          {/* Section 1: Raw Materials */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider bg-gov-paper p-2 rounded border border-gov-border">
              1. Raw Material Sourcing & Inward Testing Specifications
            </h3>
            <table className="w-full text-left table-dense border border-gov-border">
              <thead>
                <tr>
                  <th>Material Component</th>
                  <th>Reference Standard & Grade</th>
                  <th>Mandatory Inward Acceptance Test</th>
                </tr>
              </thead>
              <tbody>
                {standard.blueprint.rawMaterials.map((rm, i) => (
                  <tr key={i}>
                    <td className="font-bold text-gov-navy">{rm.material}</td>
                    <td>{rm.specification}</td>
                    <td className="text-gov-slate">{rm.inwardTest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Machinery Flow */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider bg-gov-paper p-2 rounded border border-gov-border">
              2. Production Machinery & Manufacturing Stages Flow
            </h3>
            <table className="w-full text-left table-dense border border-gov-border">
              <thead>
                <tr>
                  <th className="w-44">Production Stage</th>
                  <th className="w-64">Required Machine</th>
                  <th>Manufacturing Purpose & Specifications</th>
                </tr>
              </thead>
              <tbody>
                {standard.blueprint.manufacturingMachinery.map((m, i) => (
                  <tr key={i}>
                    <td className="font-bold text-gov-navy">{m.stage}</td>
                    <td className="font-semibold text-gov-text">{m.machine}</td>
                    <td className="text-gov-slate">{m.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: In-House QC Lab Instruments */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider bg-gov-paper p-2 rounded border border-gov-border">
              3. Mandatory In-House QC Testing Laboratory Instruments (BIS STI)
            </h3>
            <table className="w-full text-left table-dense border border-gov-border">
              <thead>
                <tr>
                  <th>Instrument / Equipment Name</th>
                  <th>Target Test Clause</th>
                  <th>Mandatory Calibration Requirement</th>
                </tr>
              </thead>
              <tbody>
                {standard.blueprint.inHouseLaboratoryEquipment.map((lab, i) => (
                  <tr key={i}>
                    <td className="font-bold text-gov-navy">{lab.equipmentName}</td>
                    <td className="font-mono text-gov-saffron font-bold">{lab.clauseTested}</td>
                    <td className="text-gov-slate">{lab.calibrationRequirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Marking Rules */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider bg-gov-paper p-2 rounded border border-gov-border">
              4. Mandatory Marking, Laser Engraving & Labelling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {standard.blueprint.markingAndLabeling.map((mk, i) => (
                <div key={i} className="p-3 border border-gov-border rounded bg-gov-paper text-xs space-y-1">
                  <strong className="text-gov-navy block">{mk.item}</strong>
                  <p className="text-gov-slate">{mk.requirement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: 70-Day Roadmap */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider bg-gov-paper p-2 rounded border border-gov-border">
              5. Step-by-Step 70-Day BIS Certification Roadmap (Manakonline / Form V)
            </h3>
            <div className="space-y-2">
              {standard.blueprint.bisLicensingRoadmap.map((st) => (
                <div key={st.step} className="p-3 border border-gov-border rounded text-xs flex items-start gap-3">
                  <div className="px-2 py-1 bg-gov-navy text-white font-mono font-bold rounded text-xs shrink-0">
                    Step {st.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gov-navy">{st.title}</h4>
                      <span className="text-[10px] text-gov-slate font-mono">({st.estimatedDays})</span>
                    </div>
                    <p className="text-gov-slate text-xs mt-0.5">{st.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCOPE & NORMATIVE REFERENCES */}
      {activeTab === "scope" && (
        <div className="bg-white border border-gov-border rounded p-6 space-y-4 shadow-subtle text-xs">
          <h2 className="text-base font-bold text-gov-navy font-serif border-b border-gov-border pb-2">
            Scope & Regulatory Normative References
          </h2>
          <div className="prose-bis leading-relaxed">
            <p><strong>Official Designation:</strong> {standard.code} ({standard.title})</p>
            <p><strong>Scope:</strong> {standard.scope}</p>
            <p><strong>Division Council:</strong> {standard.division}</p>
            <p><strong>Certification Scheme:</strong> {standard.certificationScheme}</p>
            <p><strong>Associated Quality Control Order (QCO):</strong> {standard.qcoOrder || "Voluntary Standard Mark"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
