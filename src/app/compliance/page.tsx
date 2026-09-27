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
  Printer,
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
  const { saveReport } = useApp();
  const [selectedProduct, setSelectedProduct] = useState("plugs");
  const [productName, setProductName] = useState("Industrial 16A 3-Pin Reversible Plug Socket");
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
          clause: "Clause 19",
          title: "Temperature Rise Under 16A Load",
          question: "Does terminal temperature rise remain <= 45K during continuous rated current load?",
          standard: "IS 1293:2019",
          mandatory: true,
          status: answers["tempRise"] === "yes" ? "pass" : "fail",
          comment: answers["tempRise"] === "no" ? "Overheating hazard: Terminal temperature rise exceeds 45K limit." : undefined
        },
        {
          id: "gaugeCheck",
          clause: "Clause 9.1",
          title: "Dimensional Gauge Verification",
          question: "Do pin diameters and pin pitch pass the GO / NO-GO gauges specified in Section 9?",
          standard: "IS 1293:2019",
          mandatory: true,
          status: answers["gaugeCheck"] === "yes" ? "pass" : "fail",
          comment: answers["gaugeCheck"] === "no" ? "Dimensional mismatch: Will not fit certified socket outlets safely." : undefined
        },
        {
          id: "shutter",
          clause: "Clause 10.4",
          title: "Safety Shutter Engagement",
          question: "Are live socket contacts protected by automatic safety shutters preventing probe insertion?",
          standard: "IS 1293:2019",
          mandatory: true,
          status: answers["shutter"] === "yes" ? "pass" : "fail",
          comment: answers["shutter"] === "no" ? "Shock risk: Child-resistant shutters mandatory under QCO." : undefined
        }
      ]
    },
    bottles: {
      standard: "IS 17526:2021",
      title: "Stainless Steel Vacuum Flasks & Insulated Containers",
      checks: [
        {
          id: "steelGrade",
          clause: "Clause 5.1",
          title: "Food Contact Steel Purity (Grade 304 / 316)",
          question: "Is the inner container manufactured from Grade 304 SS with Cr >= 17.5% and Ni >= 8.0%?",
          standard: "IS 17526:2021",
          mandatory: true,
          status: answers["steelGrade"] !== "no" ? "pass" : "fail",
          comment: answers["steelGrade"] === "no" ? "Non-compliant: Inner contact container must be austenitic SS 304 or 316." : undefined
        },
        {
          id: "thermalTest",
          clause: "Clause 7.2",
          title: "Thermal Retention (95°C Water >= 60°C at 6h)",
          question: "Does the vacuum container maintain water temperature >= 60°C after 6 hours?",
          standard: "IS 17526:2021",
          mandatory: true,
          status: answers["thermalTest"] !== "no" ? "pass" : "fail",
          comment: answers["thermalTest"] === "no" ? "Insulation failure: Interstitial vacuum compromised (<10^-4 mbar)." : undefined
        },
        {
          id: "inversionLeak",
          clause: "Clause 8.1",
          title: "80°C Inversion Hydrostatic Leak Test",
          question: "Does inverted bottle show zero droplets or moisture seepage over 10 minutes at 80°C?",
          standard: "IS 17526:2021",
          mandatory: true,
          status: answers["inversionLeak"] !== "no" ? "pass" : "fail",
          comment: answers["inversionLeak"] === "no" ? "Closure seal failure: Gasket does not meet hydrostatic seal rules." : undefined
        },
        {
          id: "dropImpact",
          clause: "Clause 9.3",
          title: "1.0-Metre Drop Impact onto Concrete",
          question: "Does full container survive 1.0 m free drop onto rigid concrete floor without cracking or vacuum loss?",
          standard: "IS 17526:2021",
          mandatory: true,
          status: answers["dropImpact"] !== "no" ? "pass" : "fail",
          comment: answers["dropImpact"] === "no" ? "Structural failure: Wall thickness or bottom weld joint deficient." : undefined
        }
      ]
    }
  };

  const activeTemplate = productTemplates[selectedProduct] || productTemplates.plugs;
  const checks = activeTemplate.checks;
  const passedCount = checks.filter(c => c.status === "pass").length;
  const totalCount = checks.length;
  const complianceScore = Math.round((passedCount / totalCount) * 100);
  const isFullyCompliant = complianceScore === 100;

  const handleToggle = (id: string, value: "yes" | "no") => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    saveReport({
      id: `rep-${Date.now()}`,
      productName: productName,
      title: productName,
      category: activeTemplate.title,
      standardCode: activeTemplate.standard,
      standard: activeTemplate.standard,
      score: complianceScore,
      status: isFullyCompliant ? "Compliant" : "Action Required",
      createdAt: new Date().toLocaleDateString(),
      date: new Date().toLocaleDateString(),
      details: `${passedCount} of ${totalCount} checks passed`,
      passedChecks: passedCount,
      totalChecks: totalCount
    });
    setReportSaved(true);
    setTimeout(() => setReportSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-8 lg:px-12 transition-all">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 1. Audit Header */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0A192F] via-[#0F223D] to-[#0A192F] text-white p-6 sm:p-8 space-y-6 shadow-md border border-slate-700/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/70 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] font-semibold bg-blue-900/80 text-amber-300 border border-blue-400/30 px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                  PRE-AUDIT ASSESSMENT ENGINE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight mt-2">
                BIS Pre-Audit Compliance & QCO Readiness Matrix
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl">
                Verify testing conformity against mandatory Indian Standards clauses before scheduling a BIS technical factory audit under the Scheme of Testing and Inspection (STI).
              </p>
            </div>

            <div className="flex items-center gap-2.5 no-print shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Print Dossier</span>
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5 text-amber-300" />
                <span>{reportSaved ? "Dossier Saved!" : "Save Audit Report"}</span>
              </button>
            </div>
          </div>

          {/* Product Selector */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-300">Select Standard Specification:</span>
            <button
              onClick={() => setSelectedProduct("plugs")}
              className={`px-4 py-2 rounded-xl font-bold transition-all shadow-xs ${
                selectedProduct === "plugs"
                  ? "bg-blue-600 text-white border border-blue-400/40"
                  : "bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
              }`}
            >
              IS 1293:2019 (Plugs & Socket-Outlets)
            </button>
            <button
              onClick={() => setSelectedProduct("bottles")}
              className={`px-4 py-2 rounded-xl font-bold transition-all shadow-xs ${
                selectedProduct === "bottles"
                  ? "bg-blue-600 text-white border border-blue-400/40"
                  : "bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
              }`}
            >
              IS 17526:2021 (Stainless Steel Vacuum Flasks)
            </button>
          </div>
        </div>

        {/* 2. Score Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
              Audit Readiness Score
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className={`text-4xl font-black font-sans ${isFullyCompliant ? "text-emerald-700" : "text-amber-600"}`}>
                {complianceScore}%
              </span>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">
                ({passedCount} of {totalCount} mandatory test clauses satisfied)
              </span>
            </div>
          </div>

          <div>
            {isFullyCompliant ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>AUDIT READY: Eligible for Manakonline Form V Application</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold shadow-xs">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>DEFICIENT: Resolve non-compliant parameters prior to factory inspection</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Clause-by-Clause Inspection Matrix */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-36">Clause Ref</th>
                  <th className="px-6 py-4">Test Requirement & Audit Question</th>
                  <th className="px-6 py-4 w-36">Status</th>
                  <th className="px-6 py-4 w-44 text-right no-print">Verification Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {checks.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold whitespace-nowrap">
                      <span className="bg-slate-100 text-[#0A192F] border border-slate-200 px-2.5 py-1 rounded-md text-xs">
                        {c.clause}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <strong className="text-slate-900 block font-semibold text-sm">
                        {c.title}
                      </strong>
                      <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">{c.question}</p>
                      {c.comment && (
                        <p className="text-xs text-red-700 font-medium mt-1.5 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{c.comment}</span>
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {c.status === "pass" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>COMPLIANT</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-800 border border-red-200">
                          <XCircle className="w-3.5 h-3.5 text-red-700" />
                          <span>NON-COMPLIANT</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap no-print">
                      <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-xs shadow-xs p-0.5 bg-slate-100">
                        <button
                          onClick={() => handleToggle(c.id, "yes")}
                          className={`px-3 py-1 rounded-md font-bold transition-all ${
                            c.status === "pass" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Pass
                        </button>
                        <button
                          onClick={() => handleToggle(c.id, "no")}
                          className={`px-3 py-1 rounded-md font-bold transition-all ${
                            c.status === "fail" ? "bg-red-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Fail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
