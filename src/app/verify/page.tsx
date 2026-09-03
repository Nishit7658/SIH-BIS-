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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-gov-border rounded p-6 space-y-3 shadow-subtle">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold bg-gov-navy text-white px-2 py-0.5 rounded-sm">
            STATUTORY REGISTRY
          </span>
          <h1 className="text-xl font-bold text-gov-navy font-serif">
            BIS License & Standard Mark (ISI) Authenticity Verification
          </h1>
        </div>
        <p className="text-xs text-gov-slate leading-relaxed max-w-3xl">
          Direct inquiry into the Bureau of Indian Standards Certificate of Manufacturing License (CM/L) and Compulsory Registration Scheme (CRS) database to verify validity, scope, and manufacturing premises.
        </p>
      </div>

      {/* 2. Verification Form */}
      <div className="bg-white border border-gov-border rounded p-6 space-y-4 shadow-subtle">
        <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-3">
          <label className="block text-xs font-bold text-gov-navy uppercase tracking-wide">
            Enter 10-Digit CM/L License Number or CRS Registration:
          </label>

          <div className="flex rounded border border-gov-border overflow-hidden focus-within:border-gov-navy max-w-2xl">
            <div className="px-3.5 flex items-center bg-gov-paper text-gov-slate border-r border-gov-border font-mono text-xs">
              REGISTRY
            </div>
            <input
              type="text"
              value={cmlInput}
              onChange={(e) => setCmlInput(e.target.value)}
              placeholder="e.g. CM/L-8400012345 or R-41000000"
              className="w-full px-3 py-2 text-xs sm:text-sm font-mono text-gov-navy focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !cmlInput.trim()}
              className="px-5 py-2 bg-gov-navy hover:bg-gov-navy-light text-white font-bold text-xs transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>{loading ? "Checking..." : "Verify License"}</span>
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gov-border text-xs text-gov-slate">
          <span className="font-semibold text-gov-navy">Sample Verification Codes:</span>
          {sampleLicenses.map((s) => (
            <button
              key={s.cml}
              type="button"
              onClick={() => {
                setCmlInput(s.cml);
                handleVerify(s.cml);
              }}
              className="text-[11px] font-mono px-2 py-1 rounded bg-gov-paper hover:bg-slate-200 border border-gov-border text-gov-navy"
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
            <div className="bg-white border border-gov-border rounded p-6 space-y-4 shadow-subtle">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gov-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-gov-navy">
                      {record.cmlNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded ${
                        record.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : record.status === "EXPIRED"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      STATUS: {record.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gov-navy font-serif mt-1">
                    {record.applicantName}
                  </h3>
                  {record.brand && (
                    <span className="text-xs text-gov-slate">Brand: {record.brand}</span>
                  )}
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-gov-paper hover:bg-slate-200 border border-gov-border rounded text-xs font-bold text-gov-navy flex items-center gap-1.5 self-start"
                >
                  <Printer className="w-3.5 h-3.5 text-gov-slate" />
                  <span>Print Verification Certificate</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 p-3.5 bg-gov-paper border border-gov-border rounded">
                  <div>
                    <strong className="text-gov-slate text-[10px] uppercase block">Conforming Indian Standard:</strong>
                    <span className="font-mono font-bold text-gov-navy">{record.standardCode}</span>
                  </div>
                  <div>
                    <strong className="text-gov-slate text-[10px] uppercase block">Product Scope:</strong>
                    <span className="text-gov-navy">{record.productName}</span>
                  </div>
                  <div>
                    <strong className="text-gov-slate text-[10px] uppercase block">Applicable Conformity Scheme:</strong>
                    <span className="font-semibold text-gov-navy">{record.scheme}</span>
                  </div>
                </div>

                <div className="space-y-2 p-3.5 bg-gov-paper border border-gov-border rounded">
                  <div>
                    <strong className="text-gov-slate text-[10px] uppercase block">Registered Factory Premises:</strong>
                    <span className="text-gov-navy">{record.factoryAddress}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gov-border">
                    <div>
                      <strong className="text-gov-slate text-[10px] uppercase block">Date Granted:</strong>
                      <span className="font-mono font-semibold">{record.issueDate}</span>
                    </div>
                    <div>
                      <strong className="text-gov-slate text-[10px] uppercase block">Valid Upto:</strong>
                      <span className="font-mono font-semibold">{record.validUpto}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-gov-border rounded text-[11px] text-gov-slate flex items-center justify-between">
                <span>Verification recorded under Bureau of Indian Standards e-Registry.</span>
                <a
                  href="https://www.services.bis.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Verify on Official BIS Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-6 text-center space-y-2 text-xs">
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
  );
}
