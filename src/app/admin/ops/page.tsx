"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  FileCheck,
  RefreshCw,
  GitPullRequest,
  Search,
  ArrowRight
} from "lucide-react";

interface Ticket {
  id: string;
  query: string;
  userContext: string;
  priority: string;
  status: string;
  createdAt: string;
  assignedOfficer: string;
}

export default function AdminOpsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<"abstain" | "escalations" | "amendments" | "security">("escalations");
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ops");
      const data = await res.json();
      setTickets(data.activeTickets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const abstainQueue = [
    {
      id: "ABS-101",
      query: "What is the permissible lead percentage in brass pins under IS 1293 revised drafts?",
      frequency: 24,
      reason: "DRAFT_AMENDMENT_NOT_INGESTED",
      suggestedAction: "Ingest Draft Amendment 3 for ETD 14"
    },
    {
      id: "ABS-102",
      query: "Can solar invertors be tested under IS 16221 in private accredited labs?",
      frequency: 18,
      reason: "LAB_RECOGNITION_POLICY_UNGROUNDED",
      suggestedAction: "Link BIS Recognized Lab directory schema"
    },
    {
      id: "ABS-103",
      query: "Penalty for riding two-wheeler without ISI marked helmet",
      frequency: 31,
      reason: "OUT_OF_DOMAIN_TRAFFIC_ACT",
      suggestedAction: "Keep strictly abstained (MVA jurisdiction)"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-bis-border p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bis-blue-soft text-bis-blue text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            Content Operations & Security Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-bis-navy font-display">
            BIS Operations & Abstain-Queue Triage
          </h1>
          <p className="text-bis-text-secondary text-xs">
            Review live escalated SME queries, ungrounded query triage, and red-team defenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/metrics"
            className="px-4 py-2 bg-bis-canvas hover:bg-slate-200 border border-bis-border text-bis-navy text-xs font-bold rounded-xl transition-all"
          >
            View Product & Impact KPIs →
          </Link>
          <button
            onClick={fetchTickets}
            className="px-4 py-2 bg-bis-navy hover:bg-bis-navy-light text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-bis-border text-sm font-bold gap-6">
        <button
          onClick={() => setActiveTab("escalations")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "escalations"
              ? "border-bis-saffron text-bis-navy"
              : "border-transparent text-bis-text-secondary hover:text-bis-navy"
          }`}
        >
          <UserCheck className="w-4 h-4" /> Live SME Escalations ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab("abstain")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "abstain"
              ? "border-bis-saffron text-bis-navy"
              : "border-transparent text-bis-text-secondary hover:text-bis-navy"
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Abstain-Queue Triage ({abstainQueue.length})
        </button>
        <button
          onClick={() => setActiveTab("amendments")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "amendments"
              ? "border-bis-saffron text-bis-navy"
              : "border-transparent text-bis-text-secondary hover:text-bis-navy"
          }`}
        >
          <GitPullRequest className="w-4 h-4" /> Gazette Amendment Poller
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "security"
              ? "border-bis-saffron text-bis-navy"
              : "border-transparent text-bis-text-secondary hover:text-bis-navy"
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Red-Team Defense Logs
        </button>
      </div>

      {/* Tab: Escalations */}
      {activeTab === "escalations" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-bis-border overflow-hidden shadow-xs">
            <div className="p-4 bg-bis-canvas border-b border-bis-border text-xs font-bold text-bis-navy flex items-center justify-between">
              <span>Active Escalated Inquiries from Digital Expert Users</span>
              <span className="text-slate-500 font-medium">Auto-dispatched to Committee Desks</span>
            </div>
            <div className="divide-y divide-bis-border">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-bis-blue-soft text-bis-blue font-mono font-bold text-xs">
                        {ticket.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {ticket.status}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                        {ticket.priority} PRIORITY
                      </span>
                    </div>
                    <h3 className="font-bold text-bis-navy text-sm">{ticket.query}</h3>
                    <p className="text-xs text-bis-text-secondary">{ticket.userContext}</p>
                    <p className="text-[11px] text-slate-400">Assigned: {ticket.assignedOfficer}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-xl bg-bis-navy text-white text-xs font-bold hover:bg-bis-navy-light">
                      Review & Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Abstain Triage */}
      {activeTab === "abstain" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-bis-border overflow-hidden shadow-xs">
            <div className="p-4 bg-bis-canvas border-b border-bis-border text-xs font-bold text-bis-navy">
              Ungrounded / Abstained Queries Queue (Prioritize Standards Ingestion)
            </div>
            <div className="divide-y divide-bis-border">
              {abstainQueue.map((item) => (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-600">{item.id}</span>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {item.reason}
                      </span>
                      <span className="text-[11px] text-slate-400">Asked {item.frequency} times</span>
                    </div>
                    <h3 className="font-bold text-bis-navy text-sm">"{item.query}"</h3>
                    <p className="text-xs text-emerald-800 font-semibold">💡 Recommended: {item.suggestedAction}</p>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-xl bg-bis-blue-soft text-bis-blue hover:bg-bis-blue hover:text-white transition-colors text-xs font-bold shrink-0">
                    Process Action
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Amendments Poller */}
      {activeTab === "amendments" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-bis-border space-y-4">
          <h2 className="text-base font-bold text-bis-navy">Automated Gazette Ingestion & Polling Engine</h2>
          <p className="text-xs text-bis-text-secondary leading-relaxed">
            Monitors official e-gazettes from DPIIT, Ministry of Consumer Affairs, MeitY, and BIS Sectional Committees. Detects new amendment notifications, revisions, and draft QCOs for human SME approval before publishing.
          </p>
          <div className="p-4 rounded-xl bg-bis-canvas border border-bis-border text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-bis-navy">Last Ingestion Run</span>
              <span className="font-mono text-slate-600">2026-08-30 04:00 UTC (100% Synced)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-bis-navy">Next Scheduled Poll</span>
              <span className="font-mono text-slate-600">2026-08-30 16:00 UTC</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === "security" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-bis-border space-y-4">
          <h2 className="text-base font-bold text-bis-navy">Adversarial & Injection Interception Logs</h2>
          <p className="text-xs text-bis-text-secondary leading-relaxed">
            All prompt-injection attempts, jailbreak vectors, and fake license generation attempts are intercepted at Phase 0 guardrails and recorded with zero user PII.
          </p>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 font-semibold">
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Guardrail Interception Rate: 100.0% across all evaluated attack suites.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
