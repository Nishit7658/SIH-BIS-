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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-gov-border rounded p-6 space-y-3 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gov-border pb-3">
          <div>
            <span className="font-mono text-xs font-bold bg-gov-navy text-white px-2 py-0.5 rounded-sm">
              USER WORKSPACE & DPDP HUB
            </span>
            <h1 className="text-xl font-bold text-gov-navy font-serif mt-1">
              Bookmarked Standards & Compliance Reports
            </h1>
          </div>

          <button
            onClick={handleExportData}
            className="px-3 py-1.5 bg-gov-paper hover:bg-slate-200 border border-gov-border rounded text-xs font-bold text-gov-navy flex items-center gap-1.5 self-start"
          >
            <Download className="w-3.5 h-3.5 text-gov-slate" />
            <span>Export Workspace (JSON)</span>
          </button>
        </div>
        <p className="text-xs text-gov-slate leading-relaxed">
          Manage saved standards, pre-audit inspection reports, and configure personal data retention compliant with India's Digital Personal Data Protection (DPDP) Act, 2023.
        </p>

        {/* Tab switch */}
        <div className="flex items-center gap-2 pt-2 border-t border-gov-border text-xs font-bold">
          <button
            onClick={() => setActiveTab("standards")}
            className={`px-3 py-1.5 rounded border transition-colors ${
              activeTab === "standards"
                ? "bg-gov-navy text-white border-gov-navy"
                : "bg-gov-paper text-gov-slate border-gov-border hover:text-gov-navy"
            }`}
          >
            Saved Standards ({bookmarkedList.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-3 py-1.5 rounded border transition-colors ${
              activeTab === "reports"
                ? "bg-gov-navy text-white border-gov-navy"
                : "bg-gov-paper text-gov-slate border-gov-border hover:text-gov-navy"
            }`}
          >
            Compliance Reports ({savedReports.length})
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-3 py-1.5 rounded border transition-colors ${
              activeTab === "privacy"
                ? "bg-gov-navy text-white border-gov-navy"
                : "bg-gov-paper text-gov-slate border-gov-border hover:text-gov-navy"
            }`}
          >
            DPDP Privacy Controls
          </button>
        </div>
      </div>

      {/* TAB 1: SAVED STANDARDS */}
      {activeTab === "standards" && (
        <div className="border border-gov-border rounded overflow-hidden bg-white shadow-subtle">
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
  );
}
