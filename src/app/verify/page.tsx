"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LicenseRecord } from "@/lib/verify-data";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Building2,
  Calendar,
  Award,
  ExternalLink,
  Printer,
  FileText
} from "lucide-react";

export default function VerifyPage() {
  const [cmlInput, setCmlInput] = useState("CM/L-8400012345");
  const [record, setRecord] = useState<LicenseRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFoundMsg, setNotFoundMsg] = useState<string | null>(null);

  const handleVerify = async (cmlToQuery?: string) => {
    const target = cmlToQuery || cmlInput;
    if (!target.trim()) return;

    setLoading(true);
    setNotFoundMsg(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/verify?cml=${encodeURIComponent(target.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setRecord(data.record);
      } else {
        const data = await res.json();
        setRecord(null);
        setNotFoundMsg(data.message || "License record not found in registry.");
      }
    } catch (e) {
      setRecord(null);
      setNotFoundMsg("Error communicating with verification registry.");
    } finally {
      setLoading(false);
    }
  };

  const sampleLicenses = [
    { cml: "CM/L-8400012345", label: "Anchor Electricals (IS 1293) — ACTIVE" },
    { cml: "CM/L-9123456789", label: "Havells India (IS 694) — ACTIVE" },
    { cml: "CM/L-3344556677", label: "Ganesh Heaters (IS 302) — EXPIRED" },
    { cml: "CM/L-5566778899", label: "Speedy Plugs — SUSPENDED" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-8 lg:px-12 transition-all">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 1. Header Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0A192F] via-[#0F223D] to-[#0A192F] text-white p-6 sm:p-8 space-y-3 shadow-md border border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] font-semibold bg-blue-900/80 text-amber-300 border border-blue-400/30 px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
              STATUTORY VERIFICATION REGISTRY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
            BIS License & Standard Mark (ISI) Authenticity Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Direct inquiry into the Bureau of Indian Standards Certificate of Manufacturing License (CM/L) and Compulsory Registration Scheme (CRS) database to verify validity, scope, and registered manufacturing premises.
          </p>
        </div>

        {/* 2. Verification Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Enter 10-Digit CM/L License Number or CRS Registration:
            </label>

            <div className="flex flex-col sm:flex-row rounded-xl border border-slate-300 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-600 focus-within:bg-white max-w-2xl shadow-xs transition-all p-1">
              <div className="px-4 py-2 flex items-center text-slate-500 font-mono text-xs font-bold uppercase tracking-wider">
                REGISTRY
              </div>
              <input
                type="text"
                value={cmlInput}
                onChange={(e) => setCmlInput(e.target.value)}
                placeholder="e.g. CM/L-8400012345 or R-41000000"
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                disabled={loading || !cmlInput.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all shrink-0 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Search className="w-3.5 h-3.5 text-amber-300" />
                <span>{loading ? "Checking…" : "Verify License"}</span>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-semibold text-[#0A192F]">Sample Verification Codes:</span>
            {sampleLicenses.map((s) => (
              <button
                key={s.cml}
                type="button"
                onClick={() => {
                  setCmlInput(s.cml);
                  handleVerify(s.cml);
                }}
                className="text-[11px] font-mono px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all shadow-xs"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Verification Result Card */}
        {searched && (
          <div className="space-y-4">
            {record ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-[#0A192F] bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                        {record.cmlNumber}
                      </span>
                      <span
                        className={`px-3 py-0.5 text-xs font-bold rounded-full ${
                          record.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                            : record.status === "EXPIRED"
                            ? "bg-amber-50 text-amber-900 border border-amber-300"
                            : "bg-red-50 text-red-900 border border-red-300"
                        }`}
                      >
                        STATUS: {record.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-sans mt-2">
                      {record.applicantName}
                    </h3>
                    {record.brand && (
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">Brand: {record.brand}</span>
                    )}
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-1.5 shadow-xs transition-all self-start"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print Certificate</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <strong className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Conforming Indian Standard:</strong>
                      <span className="font-mono font-bold text-[#0A192F] text-sm">{record.standardCode}</span>
                    </div>
                    <div>
                      <strong className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Product Scope:</strong>
                      <span className="text-slate-800 leading-relaxed block mt-0.5">{record.productName}</span>
                    </div>
                    <div>
                      <strong className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Applicable Conformity Scheme:</strong>
                      <span className="font-semibold text-slate-900">{record.scheme}</span>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <strong className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Registered Factory Premises:</strong>
                      <span className="text-slate-800 leading-relaxed block mt-0.5">{record.factoryAddress}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                      <div>
                        <strong className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Date Granted:</strong>
                        <span className="font-mono font-semibold text-slate-800">{record.issueDate}</span>
                      </div>
                      <div>
                        <strong className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Valid Upto:</strong>
                        <span className="font-mono font-semibold text-slate-800">{record.validUpto}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span>Official Verification record grounded via Bureau of Indian Standards e-Registry.</span>
                  <a
                    href="https://www.services.bis.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 hover:underline font-bold flex items-center gap-1 shrink-0"
                  >
                    <span>Verify on Official BIS Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-3 text-xs">
                <XCircle className="w-8 h-8 text-red-600 mx-auto" />
                <h3 className="font-bold text-red-900 text-sm">License Number Not Found</h3>
                <p className="text-red-700 max-w-md mx-auto">
                  {notFoundMsg || "No active, expired, or suspended CM/L license record matches the entered identifier."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
