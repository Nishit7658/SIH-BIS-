"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Save,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale
} from "lucide-react";

interface CheckItem {
  id: string;
  clause: string;
  title: string;
  question: string;
  standard: string;
  mandatory: boolean;
  status: "pass" | "fail" | "pending";
  comment?: string;
}

export default function CompliancePage() {
  const { t, saveReport } = useApp();
  const [selectedProduct, setSelectedProduct] = useState("plugs");
  const [productName, setProductName] = useState("ProGrip 16A 3-Pin Smart Socket");
  const [reportSaved, setReportSaved] = useState(false);

  // Form parameters
  const [answers, setAnswers] = useState<Record<string, string>>({
    rating: "16A",
    earthing: "yes",
    glowWire: "yes",
    tempRise: "yes",
    gaugeCheck: "yes",
    shutter: "yes"
  });

  const productTemplates: Record<string, { standard: string; title: string; checks: CheckItem[] }> = {
    plugs: {
      standard: "IS 1293:2019",
      title: "Plugs and Socket-Outlets (up to 250V / 16A)",
      checks: [
        {
          id: "earthing",
          clause: "Clause 6.1",
          title: "Earthing Contact Requirement",
          question: "Does the 16A rated accessory incorporate a solid resilient earthing contact pin?",
          standard: "IS 1293:2019",
          mandatory: true,
          status: answers["earthing"] === "yes" ? "pass" : "fail",
          comment: answers["earthing"] === "no" ? "Non-compliant: 16A accessories must have an earthing contact." : undefined
        },
        {
          id: "glowWire",
          clause: "Clause 28.1",
          title: "Glow Wire Resistance (850°C)",
          question: "Do insulating materials retaining live parts withstand 850°C Glow Wire Test without sustained ignition?",
          standard: "IS 1293:2019",
          mandatory: true,
          status: answers["glowWire"] === "yes" ? "pass" : "fail",
          comment: answers["glowWire"] === "no" ? "Fire Hazard: Resin must pass 850°C glow-wire per IS 11000." : undefined
        },
        {
          id: "tempRise",
          clause: "Clause 19.1",
          title: "Temperature Rise Limit (<= 45 K)",
          question: "Does terminal temperature rise stay below 45°C during 1-hour 1.25x continuous current loading?",
          standard: "IS 1293:2019",
          mandatory: true,
          status: answers["tempRise"] === "yes" ? "pass" : "fail"
        },
        {
          id: "gaugeCheck",
          clause: "Clause 9.1",
          title: "Dimensional Go/No-Go Gauge",
          question: "Do plug pins and sockets satisfy standard sheet gauge clearances under 50 N insertion?",
          standard: "IS 1293:2019",
          mandatory: true,
          status: answers["gaugeCheck"] === "yes" ? "pass" : "fail"
        },
        {
          id: "shutter",
          clause: "Amendment 1",
          title: "Automatic Safety Shutters",
          question: "Are shutters installed to shield live contacts on combined 6/16A sockets when withdrawn?",
          standard: "IS 1293:2019",
          mandatory: true,
          status: answers["shutter"] === "yes" ? "pass" : "fail"
        }
      ]
    },
    appliances: {
      standard: "IS 302-1:2008",
      title: "Household Electrical Appliances (Geysers, Irons, Mixers)",
      checks: [
        {
          id: "leakage",
          clause: "Clause 13.2",
          title: "Operating Leakage Current",
          question: "Is leakage current below 0.75 mA for Class I portable appliances at 1.06x rated voltage?",
          standard: "IS 302-1:2008",
          mandatory: true,
          status: answers["leakage"] === "yes" ? "pass" : "fail"
        },
        {
          id: "cordStrain",
          clause: "Clause 22.11",
          title: "Cord Anchorage Strain Relief",
          question: "Does supply cord anchorage withstand 25 pulls of 60 N without conductor displacement?",
          standard: "IS 302-1:2008",
          mandatory: true,
          status: answers["cordStrain"] === "yes" ? "pass" : "fail"
        }
      ]
    }
  };

  const currentTemplate = productTemplates[selectedProduct] || productTemplates.plugs;
  const currentChecks = currentTemplate.checks;

  const passedCount = currentChecks.filter((c) => c.status === "pass").length;
  const totalCount = currentChecks.length;
  const complianceScore = Math.round((passedCount / totalCount) * 100);

  const overallStatus =
    complianceScore === 100 ? "Compliant" : complianceScore >= 70 ? "Action Required" : "Non-Compliant";

  const handleSaveToHistory = () => {
    saveReport({
      id: `REP-${Date.now()}`,
      productName,
      category: currentTemplate.title,
      standardCode: currentTemplate.standard,
      score: complianceScore,
      status: overallStatus,
      createdAt: new Date().toLocaleDateString(),
      details: `${passedCount} of ${totalCount} mandatory test clauses passed.`,
    });
    setReportSaved(true);
    setTimeout(() => setReportSaved(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-bis-border p-6 sm:p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bis-blue-soft text-bis-blue text-xs font-bold uppercase tracking-wider">
          <CheckSquare className="w-3.5 h-3.5" />
          Pre-Audit Gap Analysis Wizard
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-bis-navy font-display">
          Product Conformity & Clause Checklist
        </h1>
        <p className="text-bis-text-secondary text-sm leading-relaxed max-w-3xl">
          Evaluate your prototype or product specification against mandatory Bureau of Indian Standards (BIS) test clauses. Generate instant gap-analysis reports for certification readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-bis-border shadow-xs space-y-4">
            <h2 className="font-bold text-bis-navy text-base">1. Product Profile</h2>

            <div>
              <label className="block text-xs font-semibold text-bis-text-secondary mb-1">
                Target Standard Scheme
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 bg-bis-canvas border border-bis-border rounded-xl text-xs font-bold text-bis-navy focus:outline-none focus:ring-2 focus:ring-bis-blue/30"
              >
                <option value="plugs">IS 1293:2019 (Plugs & Sockets)</option>
                <option value="appliances">IS 302-1:2008 (Household Appliances)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-bis-text-secondary mb-1">
                Product Name / Model Reference
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 bg-bis-canvas border border-bis-border rounded-xl text-xs text-bis-navy font-medium focus:outline-none focus:ring-2 focus:ring-bis-blue/30"
              />
            </div>
          </div>

          {/* Test Parameters Radio Groups */}
          <div className="bg-white p-6 rounded-2xl border border-bis-border shadow-xs space-y-5">
            <h2 className="font-bold text-bis-navy text-base">2. Laboratory Test Verification</h2>

            {currentChecks.map((chk) => (
              <div key={chk.id} className="space-y-2 border-b border-bis-border/50 pb-3 last:border-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-bis-navy">{chk.title}</span>
                  <span className="font-mono text-[10px] text-bis-blue bg-bis-blue-soft px-1.5 py-0.5 rounded">
                    {chk.clause}
                  </span>
                </div>
                <p className="text-[11px] text-bis-text-secondary">{chk.question}</p>
                <div className="flex items-center gap-4 text-xs font-semibold pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-emerald-700">
                    <input
                      type="radio"
                      name={chk.id}
                      checked={answers[chk.id] === "yes" || answers[chk.id] === undefined}
                      onChange={() => setAnswers({ ...answers, [chk.id]: "yes" })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Verified Compliant</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-red-700">
                    <input
                      type="radio"
                      name={chk.id}
                      checked={answers[chk.id] === "no"}
                      onChange={() => setAnswers({ ...answers, [chk.id]: "no" })}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>Non-Compliant</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Gap Analysis Report */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-bis-border shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bis-border pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-bis-blue">{currentTemplate.standard}</span>
                <h2 className="text-xl font-bold text-bis-navy font-display mt-0.5">{productName}</h2>
                <p className="text-xs text-bis-text-secondary">Conformity Readiness Assessment</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">Readiness Score</span>
                  <p className="text-3xl font-black font-display text-bis-navy">{complianceScore}%</p>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                    complianceScore === 100
                      ? "bg-emerald-600"
                      : complianceScore >= 70
                      ? "bg-amber-500"
                      : "bg-red-600"
                  }`}
                >
                  {complianceScore === 100 ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <AlertTriangle className="w-8 h-8" />
                  )}
                </div>
              </div>
            </div>

            {/* Checklist Results List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-bis-navy uppercase tracking-wider">
                Clause Gap-Analysis Breakdown
              </h3>

              {currentChecks.map((chk) => (
                <div
                  key={chk.id}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs leading-relaxed ${
                    chk.status === "pass"
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                      : "bg-red-50/60 border-red-200 text-red-900"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      {chk.status === "pass" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span>
                        {chk.clause}: {chk.title}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90 pl-6">{chk.question}</p>
                    {chk.comment && (
                      <p className="text-[11px] font-bold text-red-700 pl-6 pt-1">
                        ⚠️ Remediation: {chk.comment}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase shrink-0 ${
                      chk.status === "pass"
                        ? "bg-emerald-200/60 text-emerald-800"
                        : "bg-red-200/60 text-red-800"
                    }`}
                  >
                    {chk.status === "pass" ? "Passed" : "Action Required"}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-bis-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToHistory}
                  className="px-4 py-2.5 bg-bis-navy hover:bg-bis-navy-light text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4 text-bis-saffron" />
                  {reportSaved ? "Report Saved to Hub!" : "Save Report"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-bis-canvas hover:bg-slate-200 border border-bis-border text-bis-navy text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print / Export PDF
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                Statutory Scheme: <strong>Scheme I (ISI Mark Certification)</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
