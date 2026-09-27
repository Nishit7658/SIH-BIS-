"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { STANDARDS_DATABASE } from "@/lib/standards-data";
import {
  Bookmark,
  FileText,
  Trash2,
  Download,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Scale
} from "lucide-react";

export default function SavedPage() {
  const {
    savedStandards,
    toggleSaveStandard,
    savedReports,
    deleteReport,
    clearAllUserData,
    dataRetentionDays,
    setDataRetentionDays
  } = useApp();

  const [activeTab, setActiveTab] = useState<"standards" | "reports" | "privacy">("standards");

  const bookmarkedList = STANDARDS_DATABASE.filter((s) => savedStandards.includes(s.id));

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      standardsBookmarked: bookmarkedList.map((s) => ({ code: s.code, title: s.title })),
      complianceReports: savedReports,
      privacySettings: { retentionDays: dataRetentionDays },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bis-expert-user-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] py-8 px-4 sm:px-8 lg:px-12 transition-all">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Soft decorative background blob */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#5D00B7]/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header */}
        <div className="bg-[#F4F4F4] border border-neutral-200/70 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
            <div>
              <span className="font-mono text-xs font-bold bg-[#300060] text-white px-3 py-1 rounded-full shadow-xs">
                USER WORKSPACE & DPDP HUB
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#300060] font-sans tracking-tight mt-2">
                Bookmarked Standards & Compliance Reports
              </h1>
            </div>

            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-full text-xs font-bold text-neutral-800 flex items-center gap-1.5 shadow-xs transition-all self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-neutral-600" />
              <span>Export Workspace (JSON)</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Manage saved standards, pre-audit inspection reports, and configure personal data retention compliant with India&apos;s Digital Personal Data Protection (DPDP) Act, 2023.
          </p>

          {/* Tab switch */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200/80 text-xs font-bold">
            <button
              onClick={() => setActiveTab("standards")}
              className={`px-4 py-2 rounded-full transition-all shadow-xs ${
                activeTab === "standards"
                  ? "bg-[#300060] text-white"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              Saved Standards ({bookmarkedList.length})
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2 rounded-full transition-all shadow-xs ${
                activeTab === "reports"
                  ? "bg-[#300060] text-white"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              Compliance Reports ({savedReports.length})
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-4 py-2 rounded-full transition-all shadow-xs ${
                activeTab === "privacy"
                  ? "bg-[#300060] text-white"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              DPDP Privacy Controls
            </button>
          </div>
        </div>

        {/* TAB 1: SAVED STANDARDS */}
        {activeTab === "standards" && (
          <div className="border border-neutral-200/70 rounded-3xl overflow-hidden bg-white shadow-xs">
          {bookmarkedList.length > 0 ? (
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th className="w-36">IS Number</th>
                  <th>Standard Title & Technical Scope</th>
                  <th className="w-36">Scheme</th>
                  <th className="w-20 text-center">Remove</th>
                  <th className="w-24 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookmarkedList.map((std) => (
                  <tr key={std.id}>
                    <td className="font-mono font-bold text-gov-navy">{std.code}</td>
                    <td>
                      <strong className="text-gov-navy block">{std.title}</strong>
                      <p className="text-[11px] text-gov-slate line-clamp-1">{std.scope}</p>
                    </td>
                    <td className="text-xs font-semibold text-gov-slate">{std.certificationScheme}</td>
                    <td className="text-center">
                      <button
                        onClick={() => toggleSaveStandard(std.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <Link
                        href={`/standard/${std.id}`}
                        className="text-xs font-bold text-blue-700 hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-xs text-gov-slate space-y-2">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No standards bookmarked yet.</p>
              <Link href="/explore" className="text-blue-700 hover:underline font-bold inline-block">
                Browse Standards Catalog →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPLIANCE AUDIT REPORTS */}
      {activeTab === "reports" && (
        <div className="border border-gov-border rounded overflow-hidden bg-white shadow-subtle">
          {savedReports.length > 0 ? (
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>Product / Report Title</th>
                  <th className="w-36">Standard</th>
                  <th className="w-28">Audit Score</th>
                  <th className="w-32">Date Saved</th>
                  <th className="w-20 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {savedReports.map((rep) => (
                  <tr key={rep.id}>
                    <td className="font-bold text-gov-navy">{rep.title}</td>
                    <td className="font-mono text-xs">{rep.standard}</td>
                    <td>
                      <span className="font-mono font-bold text-xs text-emerald-700">
                        {rep.score}% ({rep.passedChecks}/{rep.totalChecks})
                      </span>
                    </td>
                    <td className="text-xs text-gov-slate font-mono">{rep.date}</td>
                    <td className="text-center">
                      <button
                        onClick={() => deleteReport(rep.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-xs text-gov-slate space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No audit reports generated yet.</p>
              <Link href="/compliance" className="text-blue-700 hover:underline font-bold inline-block">
                Run Pre-Audit Checklist →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DPDP PRIVACY & RETENTION CONTROLS */}
      {activeTab === "privacy" && (
        <div className="bg-white border border-gov-border rounded p-6 space-y-4 shadow-subtle text-xs">
          <div className="flex items-center gap-2 border-b border-gov-border pb-3">
            <Lock className="w-4 h-4 text-gov-navy" />
            <h3 className="font-bold text-sm text-gov-navy font-serif">
              Digital Personal Data Protection (DPDP Act, 2023) Management
            </h3>
          </div>

          <p className="text-gov-slate leading-relaxed">
            In compliance with Section 8 of India's DPDP Act, 2023, you maintain complete data principal control over your local search logs, bookmarks, and audit reports.
          </p>

          <div className="p-4 bg-gov-paper border border-gov-border rounded space-y-3">
            <div>
              <label className="font-bold text-gov-navy block mb-1">
                Data Retention Period:
              </label>
              <select
                value={dataRetentionDays}
                onChange={(e) => setDataRetentionDays(Number(e.target.value))}
                className="px-3 py-1.5 bg-white border border-gov-border rounded font-semibold text-gov-navy text-xs"
              >
                <option value={0}>0 Days (Session only / Zero retention)</option>
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
                <option value={90}>90 Days</option>
              </select>
              <p className="text-[11px] text-gov-slate mt-1">
                Records older than this limit are purged automatically upon session start.
              </p>
            </div>

            <div className="pt-3 border-t border-gov-border flex items-center justify-between">
              <div>
                <strong className="text-red-700 block">Purge All Workspace Data:</strong>
                <span className="text-[11px] text-gov-slate">Permanently removes all bookmarks, history, and audit reports.</span>
              </div>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete all saved data? This action is irreversible.")) {
                    clearAllUserData();
                  }
                }}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold"
              >
                Erase All Data
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
