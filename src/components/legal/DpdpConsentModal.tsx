"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, Lock, Check, Eye, Trash2, X } from "lucide-react";

export function DpdpConsentModal() {
  const { dpdpConsentAccepted, acceptDpdpConsent, t, dataRetentionDays, setDataRetentionDays } = useApp();
  const [showPreferences, setShowPreferences] = useState(false);

  if (dpdpConsentAccepted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-bis-border max-w-xl w-full p-6 text-bis-text-primary">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-bis-blue-soft text-bis-blue flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-bis-navy">{t.dpdpConsentTitle}</h3>
            <p className="text-xs text-bis-text-secondary">India DPDP Act (2023) Compliance & Privacy Protection</p>
          </div>
        </div>

        <p className="text-sm text-bis-text-secondary mb-4 leading-relaxed">
          Welcome to the <strong>BIS Smart Digital Expert</strong>. We process your queries strictly to provide technical standard citations and pre-compliance insights.
          We respect your privacy: no commercial tracking, no selling of business specs, and zero long-term storage of proprietary drawings without explicit consent.
        </p>

        {showPreferences ? (
          <div className="bg-bis-canvas p-4 rounded-xl border border-bis-border mb-4 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-bis-navy">Session Data Retention</p>
                <p className="text-bis-text-secondary">Choose how long local queries and compliance drafts persist in your browser.</p>
              </div>
              <select
                value={dataRetentionDays}
                onChange={(e) => setDataRetentionDays(Number(e.target.value))}
                className="border border-bis-border rounded-lg px-2 py-1 bg-white font-medium text-bis-navy"
              >
                <option value={0}>Zero Retention (Purge on exit)</option>
                <option value={7}>7 Days</option>
                <option value={30}>30 Days (Default)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <Lock className="w-4 h-4" /> Anonymized & Isolated Sandboxed Processing
            </div>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-xs text-bis-blue font-semibold hover:underline flex items-center gap-1"
          >
            {showPreferences ? "Hide Preferences" : "Customize Data Preferences"}
          </button>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={acceptDpdpConsent}
              className="w-full sm:w-auto px-5 py-2.5 bg-bis-navy hover:bg-bis-navy-light text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-bis-saffron" />
              {t.dpdpAccept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatutoryDisclaimerBar() {
  const { t } = useApp();
  return (
    <div className="bg-bis-navy-dark text-slate-300 text-xs py-1.5 px-4 text-center border-b border-bis-navy flex items-center justify-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full bg-bis-saffron animate-pulse" />
      <span>{t.statutoryDisclaimer}</span>
    </div>
  );
}
