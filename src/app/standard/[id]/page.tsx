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
      <div className="flex items-center justify-between text-xs text-gov-slate no-print">
        <Link href="/explore" className="hover:text-gov-navy font-semibold flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Technical Standards Registry</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-2.5 py-1 bg-white hover:bg-gov-paper border border-gov-border rounded text-gov-navy font-semibold flex items-center gap-1 transition-colors"
          >
            <Printer className="w-3 h-3 text-gov-slate" />
            <span>Print Specification</span>
          </button>
          <button
            onClick={() => toggleSaveStandard(standard.id)}
            className="px-2.5 py-1 bg-white hover:bg-gov-paper border border-gov-border rounded text-gov-navy font-semibold flex items-center gap-1 transition-colors"
          >
            {isSaved ? <BookmarkCheck className="w-3 h-3 text-amber-600" /> : <Bookmark className="w-3 h-3 text-gov-slate" />}
            <span>{isSaved ? "Saved" : "Save Standard"}</span>
          </button>
        </div>
      </div>

      {/* 2. Official Standard Header Document Banner */}
      <div className="bg-white border border-gov-border rounded p-6 space-y-4 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gov-border pb-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold bg-gov-navy text-white px-2.5 py-0.5 rounded-sm">
                {standard.code}
              </span>
              <span className="text-xs text-gov-slate font-medium">
                Reaffirmed {standard.year} • Division Council: {standard.division}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-gov-navy font-serif leading-snug">
              {standard.title}
            </h1>

            <p className="text-xs text-gov-slate leading-relaxed pt-1">
              {standard.scope}
            </p>
          </div>

          <div className="bg-gov-paper border border-gov-border p-3.5 rounded text-xs space-y-1.5 shrink-0 min-w-[220px]">
            <div>
              <strong className="text-gov-slate text-[10px] uppercase block">Conformity Scheme:</strong>
              <span className="font-bold text-gov-navy">{standard.certificationScheme}</span>
            </div>
            <div>
              <strong className="text-gov-slate text-[10px] uppercase block">Statutory Mandate:</strong>
              {standard.mandatory ? (
                <span className="font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.2 rounded-sm inline-block mt-0.5">
                  Mandatory QCO Enforced
                </span>
              ) : (
                <span className="text-slate-500 font-medium">Voluntary Standard</span>
              )}
            </div>
            {standard.qcoOrder && (
              <div className="pt-1 border-t border-gov-border text-[11px] text-gov-slate">
                <strong>Gazette:</strong> {standard.qcoOrder}
              </div>
            )}
          </div>
        </div>

        {/* 3. Document Tab Navigation Bar */}
        <div className="flex items-center gap-1 border-b border-gov-border no-print overflow-x-auto">
          <button
            onClick={() => setActiveTab("clauses")}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "clauses"
                ? "border-gov-navy text-gov-navy"
                : "border-transparent text-gov-slate hover:text-gov-navy"
            }`}
          >
            Technical Clauses & Tables ({standard.clauses.length})
          </button>

          {standard.blueprint && (
            <button
              onClick={() => setActiveTab("blueprint")}
              className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "blueprint"
                  ? "border-gov-navy text-gov-navy"
                  : "border-transparent text-gov-slate hover:text-gov-navy"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-gov-saffron" />
              <span>Factory & Business Setup Guide</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("scope")}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "scope"
                ? "border-gov-navy text-gov-navy"
                : "border-transparent text-gov-slate hover:text-gov-navy"
            }`}
          >
            Scope & Normative References
          </button>

          <a
            href="https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"
            target="_blank"
            rel="noreferrer"
            className="ml-auto px-3 py-1.5 text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>Official e-BIS Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* TAB 1: FULL CLAUSES & DATA TABLES */}
      {activeTab === "clauses" && (
        <div className="space-y-4">
          <div className="bg-white border border-gov-border rounded p-3.5 flex items-center justify-between gap-3 shadow-subtle no-print">
            <span className="text-xs font-bold text-gov-navy">
              Showing {filteredClauses.length} technical clauses with test requirements
            </span>
            <input
              type="text"
              value={clauseSearch}
              onChange={(e) => setClauseSearch(e.target.value)}
              placeholder="Search clause by title, number, or keyword..."
              className="px-3 py-1.5 text-xs border border-gov-border rounded bg-gov-paper focus:bg-white focus:outline-none focus:border-gov-navy w-64"
            />
          </div>

          <div className="space-y-3">
            {filteredClauses.map((clause) => (
              <div
                key={clause.id}
                className="bg-white border border-gov-border rounded p-5 space-y-3 shadow-subtle"
              >
                <div className="flex items-start justify-between gap-2 border-b border-gov-border pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-xs text-gov-saffron">
                      {clause.number}
                    </span>
                    <h3 className="text-sm font-bold text-gov-navy font-serif mt-0.5">
                      {clause.title}
                    </h3>
                  </div>
                  {(clause.testRequirement || clause.testMethod) && (
                    <span className="text-[10px] font-bold text-gov-slate bg-gov-paper px-2 py-0.5 rounded border border-gov-border">
                      Method: {clause.testRequirement || clause.testMethod}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gov-text leading-relaxed font-sans">
                  {clause.content}
                </div>

                {/* Specification Table Rendering */}
                {clause.tableData && (
                  <div className="pt-2 border-t border-gov-border overflow-x-auto">
                    <strong className="text-[10px] font-bold text-gov-slate uppercase tracking-wide block mb-1.5">
                      Technical Parameter Table:
                    </strong>
                    <table className="w-full text-left table-dense border border-gov-border">
                      <thead>
                        <tr>
                          {clause.tableData.headers.map((h, i) => (
                            <th key={i}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {clause.tableData.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={cIdx === 0 ? "font-bold text-gov-navy" : "text-gov-text"}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
