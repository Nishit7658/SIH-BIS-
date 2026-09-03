"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, Lock, Check, X } from "lucide-react";

export function DpdpConsentModal() {
  const { dpdpConsentAccepted, acceptDpdpConsent, t, dataRetentionDays, setDataRetentionDays } = useApp();
  const [showPreferences, setShowPreferences] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!dpdpConsentAccepted) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [dpdpConsentAccepted]);

  const handleDismiss = () => {
    setIsVisible(false);
    acceptDpdpConsent();
  };

  if (!isVisible || dpdpConsentAccepted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-4"
      onClick={handleDismiss}
    >
      <div
        className="bg-white rounded border border-gov-border max-w-lg w-full p-5 text-gov-text relative z-10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded text-slate-400 hover:text-gov-navy"
          title="Close"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2.5 pr-6">
          <div className="w-8 h-8 rounded bg-gov-paper border border-gov-border text-gov-navy flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-4 h-4 text-gov-saffron" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gov-navy font-serif">
              Digital Personal Data Protection (DPDP Act, 2023) Notice
            </h3>
            <p className="text-[11px] text-gov-slate">Statutory Data Privacy & Confidentiality Guarantee</p>
          </div>
        </div>

        <p className="text-xs text-gov-slate mb-3 leading-relaxed">
          The <strong>BIS Smart Digital Expert</strong> processes queries strictly to retrieve technical standard citations and compliance guidelines. We maintain zero commercial tracking, zero ad tracking, and zero long-term retention of business specifications without your explicit consent.
        </p>

        {showPreferences && (
          <div className="bg-gov-paper p-3 rounded border border-gov-border mb-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gov-navy">Local Cache Retention:</p>
                <p className="text-[11px] text-gov-slate">Select duration for storing offline query history.</p>
              </div>
              <select
                value={dataRetentionDays}
                onChange={(e) => setDataRetentionDays(Number(e.target.value))}
                className="border border-gov-border rounded px-2 py-1 bg-white font-semibold text-gov-navy text-xs"
              >
                <option value={0}>Zero Retention (Purge on exit)</option>
                <option value={7}>7 Days</option>
                <option value={30}>30 Days (Default)</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gov-border">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-xs text-gov-slate hover:text-gov-navy underline"
          >
            {showPreferences ? "Hide Settings" : "Configure Retention"}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-1.5 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-amber-400" />
            <span>Acknowledge & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function StatutoryDisclaimerBar() {
  return null; // Integrated into the official top header of Navbar.tsx
}
