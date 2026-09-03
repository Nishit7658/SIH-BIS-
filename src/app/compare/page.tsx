"use client";

import React, { useState } from "react";
import Link from "next/link";
import { STANDARDS_DATABASE, Standard } from "@/lib/standards-data";
import {
  GitCompare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Printer
} from "lucide-react";

export default function ComparePage() {
  const [stdAId, setStdAId] = useState("is-1293-2019");
  const [stdBId, setStdBId] = useState("is-302-1-2008");

  const stdA = STANDARDS_DATABASE.find((s) => s.id === stdAId) || STANDARDS_DATABASE[0];
  const stdB = STANDARDS_DATABASE.find((s) => s.id === stdBId) || STANDARDS_DATABASE[1];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-gov-border rounded p-6 space-y-3 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gov-border pb-3">
          <div>
            <span className="font-mono text-xs font-bold bg-gov-navy text-white px-2 py-0.5 rounded-sm">
              TECHNICAL COMPARATOR
            </span>
            <h1 className="text-xl font-bold text-gov-navy font-serif mt-1">
              Side-by-Side Standards Specification Comparison
            </h1>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-gov-paper hover:bg-slate-200 border border-gov-border rounded text-xs font-bold text-gov-navy flex items-center gap-1.5 self-start no-print"
          >
            <Printer className="w-3.5 h-3.5 text-gov-slate" />
            <span>Print Comparison</span>
          </button>
        </div>
        <p className="text-xs text-gov-slate leading-relaxed">
          Evaluate technical scope, mandatory testing clauses, conformity schemes, and regulatory Quality Control Orders across Indian Standards.
        </p>
      </div>

      {/* 2. Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded border border-gov-border space-y-2 shadow-subtle">
          <label className="block text-xs font-bold text-gov-navy uppercase tracking-wide">
            Select Baseline Standard (A):
          </label>
          <select
            value={stdAId}
            onChange={(e) => setStdAId(e.target.value)}
            className="w-full px-3 py-2 bg-gov-paper border border-gov-border rounded text-xs font-bold text-gov-navy focus:outline-none"
          >
            {STANDARDS_DATABASE.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} — {s.title.substring(0, 60)}...
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 bg-white rounded border border-gov-border space-y-2 shadow-subtle">
          <label className="block text-xs font-bold text-gov-navy uppercase tracking-wide">
            Select Comparison Standard (B):
          </label>
          <select
            value={stdBId}
            onChange={(e) => setStdBId(e.target.value)}
            className="w-full px-3 py-2 bg-gov-paper border border-gov-border rounded text-xs font-bold text-gov-navy focus:outline-none"
          >
            {STANDARDS_DATABASE.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} — {s.title.substring(0, 60)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Side-by-Side Comparison Table */}
      <div className="border border-gov-border rounded overflow-hidden bg-white shadow-subtle">
        <table className="w-full text-left table-dense">
          <thead>
            <tr>
              <th className="w-48 bg-gov-muted">Specification Parameter</th>
              <th className="w-1/2 font-mono text-gov-navy">{stdA.code}</th>
              <th className="w-1/2 font-mono text-gov-navy">{stdB.code}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold text-gov-slate">Full Title</td>
              <td className="font-semibold text-gov-navy">{stdA.title}</td>
              <td className="font-semibold text-gov-navy">{stdB.title}</td>
            </tr>
            <tr>
              <td className="font-bold text-gov-slate">Division Council</td>
              <td>{stdA.division}</td>
              <td>{stdB.division}</td>
            </tr>
            <tr>
              <td className="font-bold text-gov-slate">Reaffirmation Year</td>
              <td className="font-mono">{stdA.year}</td>
              <td className="font-mono">{stdB.year}</td>
            </tr>
            <tr>
              <td className="font-bold text-gov-slate">Conformity Scheme</td>
              <td className="font-semibold">{stdA.certificationScheme}</td>
              <td className="font-semibold">{stdB.certificationScheme}</td>
            </tr>
            <tr>
              <td className="font-bold text-gov-slate">Regulatory QCO Mandate</td>
              <td>
                {stdA.mandatory ? (
                  <span className="font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                    Mandatory ({stdA.qcoOrder || "Statutory QCO"})
                  </span>
                ) : (
                  <span className="text-slate-500 text-xs">Voluntary</span>
                )}
              </td>
              <td>
                {stdB.mandatory ? (
                  <span className="font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                    Mandatory ({stdB.qcoOrder || "Statutory QCO"})
                  </span>
                ) : (
                  <span className="text-slate-500 text-xs">Voluntary</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="font-bold text-gov-slate">Technical Scope</td>
              <td className="text-gov-text leading-relaxed">{stdA.scope}</td>
              <td className="text-gov-text leading-relaxed">{stdB.scope}</td>
            </tr>
            <tr>
              <td className="font-bold text-gov-slate">Clauses In Repos</td>
              <td>
                <div className="space-y-1">
                  {stdA.clauses.map(c => (
                    <div key={c.id} className="text-[11px]">
                      <strong className="font-mono text-gov-saffron">{c.number}</strong>: {c.title}
                    </div>
                  ))}
                </div>
              </td>
              <td>
                <div className="space-y-1">
                  {stdB.clauses.map(c => (
                    <div key={c.id} className="text-[11px]">
                      <strong className="font-mono text-gov-saffron">{c.number}</strong>: {c.title}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="font-bold text-gov-slate">Direct Inspection</td>
              <td>
                <Link
                  href={`/standard/${stdA.id}`}
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  <span>Open {stdA.code} Specification</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </td>
              <td>
                <Link
                  href={`/standard/${stdB.id}`}
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  <span>Open {stdB.code} Specification</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
