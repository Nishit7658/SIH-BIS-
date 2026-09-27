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
    <div className="min-h-screen bg-[#FBFBFC] py-8 px-4 sm:px-8 lg:px-12 transition-all">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Soft decorative background blob */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#5D00B7]/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Audit Header */}
        <div className="bg-[#F4F4F4] border border-neutral-200/70 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold bg-[#300060] text-white px-3 py-1 rounded-full shadow-xs">
                  PRE-AUDIT ASSESSMENT
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#300060] font-sans tracking-tight">
                  BIS Pre-Audit Compliance & QCO Readiness Matrix
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 leading-relaxed">
                Verify compliance against mandatory Indian Standards clauses before scheduling a BIS technical factory audit.
              </p>
            </div>

            <div className="flex items-center gap-2.5 no-print shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-full text-xs font-bold text-neutral-800 flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-neutral-600" />
                <span>Print Dossier</span>
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-[#300060] hover:bg-[#5D00B7] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5 text-amber-300" />
                <span>{reportSaved ? "Saved!" : "Save Report"}</span>
              </button>
            </div>
          </div>

          {/* Product Selector */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-[#300060]">Select Product Standard:</span>
            <button
              onClick={() => setSelectedProduct("plugs")}
              className={`px-4 py-2 rounded-full font-bold transition-all shadow-xs ${
                selectedProduct === "plugs"
                  ? "bg-[#300060] text-white"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              IS 1293:2019 (Plugs & Sockets)
            </button>
            <button
              onClick={() => setSelectedProduct("bottles")}
              className={`px-4 py-2 rounded-full font-bold transition-all shadow-xs ${
                selectedProduct === "bottles"
                  ? "bg-[#300060] text-white"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              IS 17526:2021 (Stainless Steel Vacuum Bottles)
            </button>
          </div>
        </div>

        {/* 2. Score Banner */}
        <div className="bg-[#F4F4F4] border border-neutral-200/70 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
              Audit Readiness Score
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className={`text-4xl font-black font-sans ${isFullyCompliant ? "text-emerald-700" : "text-[#F16104]"}`}>
                {complianceScore}%
              </span>
              <span className="text-xs sm:text-sm text-neutral-600 font-medium">
                ({passedCount} of {totalCount} mandatory clauses satisfied)
              </span>
            </div>
          </div>

          <div>
            {isFullyCompliant ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 rounded-full text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>PASS: Eligible for Form V Application Submission</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/80 text-amber-900 border border-amber-300/80 rounded-full text-xs font-bold shadow-xs">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>DEFICIENT: Address failing test parameters before BIS audit</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Clause-by-Clause Inspection Matrix */}
        <div className="border border-neutral-200/70 rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F4F4F4] text-neutral-700 text-xs uppercase tracking-wider font-semibold border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 w-36">Clause Ref</th>
                  <th className="px-6 py-4">Test Requirement & Audit Question</th>
                  <th className="px-6 py-4 w-36">Status</th>
                  <th className="px-6 py-4 w-44 text-right no-print">Verification Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {checks.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#300060] whitespace-nowrap">
                      <span className="bg-purple-100/70 text-[#300060] px-2.5 py-1 rounded-full text-xs">
                        {c.clause}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <strong className="text-neutral-900 block font-semibold text-sm">
                        {c.title}
                      </strong>
                      <p className="text-neutral-600 text-xs sm:text-sm mt-1 leading-relaxed">{c.question}</p>
                      {c.comment && (
                        <p className="text-xs text-red-700 font-medium mt-1.5 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{c.comment}</span>
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {c.status === "pass" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>COMPLIANT</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
                          <XCircle className="w-3.5 h-3.5 text-red-700" />
                          <span>NON-COMPLIANT</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap no-print">
                      <div className="inline-flex rounded-full border border-neutral-300 overflow-hidden text-xs shadow-xs p-0.5 bg-neutral-100">
                        <button
                          onClick={() => handleToggle(c.id, "yes")}
                          className={`px-3 py-1 rounded-full font-bold transition-all ${
                            c.status === "pass" ? "bg-[#300060] text-white shadow-xs" : "text-neutral-600 hover:text-neutral-900"
                          }`}
                        >
                          Pass
                        </button>
                        <button
                          onClick={() => handleToggle(c.id, "no")}
                          className={`px-3 py-1 rounded-full font-bold transition-all ${
                            c.status === "fail" ? "bg-red-700 text-white shadow-xs" : "text-neutral-600 hover:text-neutral-900"
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
