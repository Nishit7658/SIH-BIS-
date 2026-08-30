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
  ExternalLink
} from "lucide-react";

export default function SavedPage() {
  const {
    savedStandards,
    toggleSaveStandard,
    savedReports,
    deleteReport,
    clearAllUserData,
    dataRetentionDays,
    setDataRetentionDays,
    t
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-bis-border p-6 sm:p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bis-blue-soft text-bis-blue text-xs font-bold uppercase tracking-wider">
          <Bookmark className="w-3.5 h-3.5" />
          User Workspace & Privacy Hub
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-bis-navy font-display">
          Saved Standards & Compliance Reports
        </h1>
        <p className="text-bis-text-secondary text-sm leading-relaxed max-w-3xl">
          Access your pinned Indian Standards, downloaded compliance gap analyses, and manage your DPDP Act data retention preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-bis-border text-sm font-bold gap-6">
        <button
          onClick={() => setActiveTab("standards")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "standards"
              ? "border-bis-saffron text-bis-navy"
              : "border-transparent text-bis-text-secondary hover:text-bis-navy"
          }`}
        >
          <Bookmark className="w-4 h-4" /> Bookmarked Standards ({bookmarkedList.length})
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "reports"
              ? "border-bis-saffron text-bis-navy"
              : "border-transparent text-bis-text-secondary hover:text-bis-navy"
          }`}
        >
          <FileText className="w-4 h-4" /> Saved Compliance Reports ({savedReports.length})
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "privacy"
              ? "border-bis-saffron text-bis-navy"
              : "border-transparent text-bis-text-secondary hover:text-bis-navy"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> DPDP Privacy & Data Erasure
        </button>
      </div>

      {/* Tab: Standards */}
      {activeTab === "standards" && (
        <div className="space-y-4">
          {bookmarkedList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-bis-border p-12 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="font-bold text-bis-navy text-base">No Standards Bookmarked Yet</h3>
              <p className="text-xs text-bis-text-secondary">
                Bookmark Indian Standards from the catalog for quick access during factory audits.
              </p>
              <Link
                href="/explore"
                className="inline-block px-4 py-2 bg-bis-navy text-white text-xs font-bold rounded-xl"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedList.map((std) => (
                <div
                  key={std.id}
                  className="bg-white rounded-2xl border border-bis-border p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono font-bold text-xs text-bis-blue bg-bis-blue-soft px-2.5 py-1 rounded">
                        {std.code}
                      </span>
                      <button
                        onClick={() => toggleSaveStandard(std.id)}
                        className="text-xs text-red-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                    <h3 className="font-bold text-bis-navy text-sm line-clamp-2 mb-2">{std.title}</h3>
                    <p className="text-xs text-bis-text-secondary line-clamp-2">{std.summary}</p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-bis-border flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{std.clauses.length} Clauses</span>
                    <Link
                      href={`/standard/${std.id}`}
                      className="text-xs font-bold text-bis-blue hover:underline flex items-center gap-1"
                    >
                      Inspect <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          {savedReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-bis-border p-12 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="font-bold text-bis-navy text-base">No Compliance Reports Saved</h3>
              <p className="text-xs text-bis-text-secondary">
                Generate and save a pre-audit checklist from the Compliance Wizard.
              </p>
              <Link
                href="/compliance"
                className="inline-block px-4 py-2 bg-bis-navy text-white text-xs font-bold rounded-xl"
              >
                Open Compliance Wizard
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {savedReports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white p-5 rounded-2xl border border-bis-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-bis-navy">{rep.productName}</span>
                      <span className="font-mono text-xs text-bis-blue bg-bis-blue-soft px-2 py-0.5 rounded font-bold">
                        {rep.standardCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rep.status === "Compliant"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {rep.status} ({rep.score}%)
                      </span>
                    </div>
                    <p className="text-xs text-bis-text-secondary">{rep.details}</p>
                    <span className="text-[10px] text-slate-400">Generated on {rep.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteReport(rep.id)}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: DPDP Privacy Settings */}
      {activeTab === "privacy" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-bis-border space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-bis-navy">DPDP Act (2023) Privacy Center</h2>
              <p className="text-xs text-bis-text-secondary">Exercise your statutory rights of access, export, and complete erasure.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-bis-canvas border border-bis-border space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-bis-navy">Session Data Retention Time (TTL)</p>
                <p className="text-bis-text-secondary">Choose how long local queries and drafts stay stored in your browser.</p>
              </div>
              <select
                value={dataRetentionDays}
                onChange={(e) => setDataRetentionDays(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-bis-border bg-white font-bold text-bis-navy"
              >
                <option value={0}>Zero Retention (Purge on exit)</option>
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-bis-border flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 bg-bis-canvas hover:bg-slate-200 border border-bis-border text-bis-navy text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-bis-blue" />
              Export My Data (JSON)
            </button>

            <button
              onClick={() => {
                if (confirm("Are you sure you want to permanently erase all local bookmarks and compliance reports?")) {
                  clearAllUserData();
                  alert("All local user data successfully purged.");
                }
              }}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Purge All Data (Right to be Forgotten)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
