"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  MousePointerClick,
  Headphones,
  ArrowRight
} from "lucide-react";

export default function AdminMetricsPage() {
  const productKpis = [
    { label: "Total Queries Processed", value: "148,290", change: "+14.2% MoM", icon: Zap },
    { label: "Grounding Resolution Rate", value: "96.4%", change: "Zero Hallucinations", icon: CheckCircle2 },
    { label: "Official Citation Click-Through", value: "64.2%", change: "High Source Trust", icon: MousePointerClick },
    { label: "Cache Hit Efficiency", value: "58.1%", change: "Sub-20ms Response", icon: TrendingUp },
  ];

  const impactMetrics = [
    { metric: "BIS Regional Call-Center Query Deflection", value: "42.8%", description: "Direct reduction in routine repetitive standard inquiries to regional offices." },
    { metric: "Manufacturer Engineering Hours Saved", value: "18,400+ hrs", description: "Aggregated time saved searching through gazette notifications and amendments." },
    { metric: "License & ISI Mark Verifications Conducted", value: "24,180", description: "380 expired or suspended license alerts flagged to industrial buyers." }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-gov-border rounded p-6 space-y-3 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold bg-gov-navy text-white px-2 py-0.5 rounded-sm">
            NATIONAL TELEMETRY
          </span>
          <h1 className="text-xl font-bold text-gov-navy font-serif mt-1">
            System Performance & Regulatory Impact Telemetry
          </h1>
          <p className="text-xs text-gov-slate mt-0.5">
            Measurements of clause citation grounding, query latency, call-center deflection, and licensee verification checks.
          </p>
        </div>

        <Link
          href="/admin/ops"
          className="px-3 py-1.5 bg-gov-paper hover:bg-slate-200 border border-gov-border rounded text-xs font-bold text-gov-navy flex items-center gap-1.5 self-start"
        >
          <span>← Content Ops & Triage</span>
        </Link>
      </div>

      {/* 2. Primary Product Performance Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {productKpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white border border-gov-border rounded p-4 space-y-2 shadow-subtle"
          >
            <span className="text-[11px] font-bold text-gov-slate uppercase tracking-wide block">
              {kpi.label}
            </span>
            <span className="text-2xl font-black font-mono text-gov-navy block">
              {kpi.value}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
              {kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* 3. National Regulatory Impact Table */}
      <div className="border border-gov-border rounded overflow-hidden bg-white shadow-subtle space-y-2 p-5">
        <h2 className="text-sm font-bold text-gov-navy font-serif border-b border-gov-border pb-2">
          Regulatory Compliance & National Impact Metrics
        </h2>
        <table className="w-full text-left table-dense">
          <thead>
            <tr>
              <th>Impact Metric Indicator</th>
              <th className="w-32">Measured Value</th>
              <th>Methodology & National Assessment</th>
            </tr>
          </thead>
          <tbody>
            {impactMetrics.map((m, i) => (
              <tr key={i}>
                <td className="font-bold text-gov-navy">{m.metric}</td>
                <td className="font-mono font-bold text-emerald-700 text-sm">{m.value}</td>
                <td className="text-xs text-gov-slate">{m.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
