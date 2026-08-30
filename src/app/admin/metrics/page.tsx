"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Clock,
  CheckCircle2,
  FileCheck,
  MousePointerClick,
  Headphones,
  ArrowRight
} from "lucide-react";

export default function AdminMetricsPage() {
  const productKpis = [
    { label: "Total Queries Processed", value: "148,290", change: "+14.2% this month", icon: Zap, color: "text-blue-600 bg-blue-50" },
    { label: "Grounding Resolution Rate", value: "96.4%", change: "0 Hallucinated Claims", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Citation Click-Through Rate", value: "64.2%", change: "High user trust in source", icon: MousePointerClick, color: "text-purple-600 bg-purple-50" },
    { label: "Query Cache Hit Rate", value: "58.1%", change: "Sub-20ms instant response", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
  ];

  const impactKpis = [
    { label: "BIS Call-Center Query Deflection", value: "42.8%", desc: "Direct reduction in routine repetitive inquiries to regional offices", icon: Headphones },
    { label: "Manufacturer Hours Saved", value: "18,400+ hrs", desc: "Estimated engineering time saved searching through gazettes & amendments", icon: Clock },
    { label: "License & ISI Mark Verifications", value: "24,180", desc: "380 expired or suspended license alerts flagged to buyers", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-bis-border p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Activity className="w-3.5 h-3.5" />
            Product & Impact Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-bis-navy font-display">
            Success Metrics & National Impact
          </h1>
          <p className="text-bis-text-secondary text-xs">
            Live measurements of technical accuracy, user satisfaction, cost efficiency, and regulatory compliance assistance.
          </p>
        </div>

        <Link
          href="/admin/ops"
          className="px-4 py-2 bg-bis-canvas hover:bg-slate-200 border border-bis-border text-bis-navy text-xs font-bold rounded-xl transition-all"
        >
          ← Back to Content Ops & Triage
        </Link>
      </div>

      {/* Product KPIs Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-bis-navy font-display">Product Performance & Reliability KPIs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productKpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-bis-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-bis-text-secondary font-semibold">{kpi.label}</span>
                  <div className={`p-2 rounded-xl ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-bis-navy font-display">{kpi.value}</p>
                <p className="text-[11px] text-emerald-600 font-bold">{kpi.change}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* National Impact Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-bis-navy font-display">National Ecosystem Impact (Make In India)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactKpis.map((imp, idx) => {
            const Icon = imp.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-bis-border shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-bis-blue-soft text-bis-blue flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-bis-navy">{imp.label}</h3>
                <p className="text-3xl font-black font-display text-bis-saffron">{imp.value}</p>
                <p className="text-xs text-bis-text-secondary leading-relaxed">{imp.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost & Latency Model Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-bis-border space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-bis-navy">LLM Cost & Two-Tier Routing Efficiency</h3>
          <p className="text-xs text-bis-text-secondary">
            Multi-tiered query execution keeps average inference cost at &lt;₹0.04 per query while maintaining 100% clause fidelity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-bis-canvas rounded-xl border border-bis-border space-y-1">
            <span className="text-slate-500 font-medium">Exact & Semantic Cache (58.1%)</span>
            <p className="font-bold text-bis-navy text-sm">₹0.00 Cost / &lt;15ms Latency</p>
          </div>
          <div className="p-4 bg-bis-canvas rounded-xl border border-bis-border space-y-1">
            <span className="text-slate-500 font-medium">Fast Routing Tier (38.3%)</span>
            <p className="font-bold text-bis-navy text-sm">₹0.02 Cost / ~80ms Latency</p>
          </div>
          <div className="p-4 bg-bis-canvas rounded-xl border border-bis-border space-y-1">
            <span className="text-slate-500 font-medium">Deep Compliance Synthesis (3.6%)</span>
            <p className="font-bold text-bis-navy text-sm">₹0.12 Cost / ~350ms Latency</p>
          </div>
        </div>
      </div>
    </div>
  );
}
