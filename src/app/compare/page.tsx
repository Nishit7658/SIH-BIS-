"use client";

import React, { useState } from "react";
import Link from "next/link";
import { STANDARDS_DATABASE, Standard } from "@/lib/standards-data";
import {
  GitCompare,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles
} from "lucide-react";

export default function ComparePage() {
  const [stdAId, setStdAId] = useState("is-1293-2019");
  const [stdBId, setStdBId] = useState("is-302-1-2008");

  const stdA = STANDARDS_DATABASE.find((s) => s.id === stdAId) || STANDARDS_DATABASE[0];
  const stdB = STANDARDS_DATABASE.find((s) => s.id === stdBId) || STANDARDS_DATABASE[1];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-bis-border p-6 sm:p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-200">
          <GitCompare className="w-3.5 h-3.5" />
          Technical Standards Comparator
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-bis-navy font-display">
          Side-by-Side Standards Comparison
        </h1>
        <p className="text-bis-text-secondary text-sm leading-relaxed max-w-3xl">
          Evaluate technical requirements, certification schemes, quality control mandates, and test methods across different Bureau of Indian Standards specifications.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white rounded-2xl border border-bis-border shadow-xs space-y-2">
          <label className="block text-xs font-bold text-bis-navy">Select Standard 1</label>
          <select
            value={stdAId}
            onChange={(e) => setStdAId(e.target.value)}
            className="w-full px-3 py-2 bg-bis-canvas border border-bis-border rounded-xl text-xs font-bold text-bis-navy focus:outline-none focus:ring-2 focus:ring-bis-blue/30"
          >
            {STANDARDS_DATABASE.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} — {s.title.substring(0, 50)}...
              </option>
            ))}
          </select>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-bis-border shadow-xs space-y-2">
          <label className="block text-xs font-bold text-bis-navy">Select Standard 2</label>
          <select
            value={stdBId}
            onChange={(e) => setStdBId(e.target.value)}
            className="w-full px-3 py-2 bg-bis-canvas border border-bis-border rounded-xl text-xs font-bold text-bis-navy focus:outline-none focus:ring-2 focus:ring-bis-blue/30"
          >
            {STANDARDS_DATABASE.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} — {s.title.substring(0, 50)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white rounded-3xl border border-bis-border overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-bis-border">
          {/* Col 1 */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="px-3 py-1 rounded-lg bg-bis-blue-soft text-bis-blue font-mono font-bold text-xs">
                {stdA.code}
              </span>
              <h2 className="text-xl font-bold text-bis-navy font-display mt-2">{stdA.title}</h2>
              <p className="text-xs text-bis-text-secondary mt-1">{stdA.summary}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-bis-canvas rounded-xl border border-bis-border">
                <span className="text-slate-500 font-medium">Conformity Assessment Scheme</span>
                <p className="font-bold text-bis-navy mt-0.5">{stdA.scheme}</p>
              </div>

              <div className="p-3 bg-bis-canvas rounded-xl border border-bis-border">
                <span className="text-slate-500 font-medium">Quality Control Order (QCO)</span>
                <p className="font-bold text-bis-navy mt-0.5">{stdA.qcoReference || "Voluntary Standard"}</p>
              </div>

              <div className="p-3 bg-bis-canvas rounded-xl border border-bis-border">
                <span className="text-slate-500 font-medium">Total Clauses & Active Amendments</span>
                <p className="font-bold text-bis-navy mt-0.5">{stdA.clauses.length} Clauses • {stdA.amendments.length} Amendments</p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/standard/${stdA.id}`}
                  className="text-xs font-bold text-bis-blue hover:underline flex items-center gap-1"
                >
                  Inspect {stdA.code} Full Clauses →
                </Link>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="p-6 sm:p-8 space-y-6 bg-bis-canvas/30">
            <div>
              <span className="px-3 py-1 rounded-lg bg-bis-blue-soft text-bis-blue font-mono font-bold text-xs">
                {stdB.code}
              </span>
              <h2 className="text-xl font-bold text-bis-navy font-display mt-2">{stdB.title}</h2>
              <p className="text-xs text-bis-text-secondary mt-1">{stdB.summary}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-bis-border">
                <span className="text-slate-500 font-medium">Conformity Assessment Scheme</span>
                <p className="font-bold text-bis-navy mt-0.5">{stdB.scheme}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-bis-border">
                <span className="text-slate-500 font-medium">Quality Control Order (QCO)</span>
                <p className="font-bold text-bis-navy mt-0.5">{stdB.qcoReference || "Voluntary Standard"}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-bis-border">
                <span className="text-slate-500 font-medium">Total Clauses & Active Amendments</span>
                <p className="font-bold text-bis-navy mt-0.5">{stdB.clauses.length} Clauses • {stdB.amendments.length} Amendments</p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/standard/${stdB.id}`}
                  className="text-xs font-bold text-bis-blue hover:underline flex items-center gap-1"
                >
                  Inspect {stdB.code} Full Clauses →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
