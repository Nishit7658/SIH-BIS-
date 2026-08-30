"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, ExternalLink, Scale, FileText, CheckCircle2, Heart } from "lucide-react";

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="bg-bis-navy text-slate-300 pt-12 pb-8 border-t border-bis-navy-light text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-bis-navy-light/60">
          {/* Col 1: Identity & Disclaimer */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-bis-saffron text-sm border border-white/10">
                IS
              </div>
              <span className="font-display font-bold text-white text-base">
                BIS Smart Digital Expert
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-lg">
              An intelligent, pre-compliance and standards research platform designed to simplify Indian Standards (IS), Quality Control Orders (QCOs), and conformity schemes for manufacturers, testing labs, and consumers.
            </p>
            <div className="p-3 rounded-xl bg-bis-navy-dark/80 border border-bis-navy-light text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <Scale className="w-4 h-4 text-bis-saffron shrink-0 mt-0.5" />
              <span>
                <strong>Statutory Notice:</strong> This platform is an AI guidance companion. The Bureau of Indian Standards (BIS) is the statutory national standards body under the BIS Act, 2016. Always verify final legal specifications at <em>manakonline.in</em>.
              </span>
            </div>
          </div>

          {/* Col 2: Official Portals */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">Official Statutory Portals</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="hover:text-bis-saffron flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3" /> BIS Official Portal (bis.gov.in)
                </a>
              </li>
              <li>
                <a href="https://www.manakonline.in" target="_blank" rel="noreferrer" className="hover:text-bis-saffron flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Manakonline e-BIS Portal
                </a>
              </li>
              <li>
                <a href="https://dpiit.gov.in" target="_blank" rel="noreferrer" className="hover:text-bis-saffron flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3" /> DPIIT Quality Control Orders
                </a>
              </li>
              <li>
                <a href="https://www.meity.gov.in" target="_blank" rel="noreferrer" className="hover:text-bis-saffron flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3" /> MeitY CRS Registration Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: DPDP & Data Governance */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">Governance & DPDP</h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> DPDP Act 2023 Compliant
              </div>
              <p className="text-[11px] leading-relaxed">
                Zero long-term retention of user product drawings. Telemetry is anonymized strictly for knowledge base improvement.
              </p>
              <div className="pt-1">
                <Link href="/saved" className="text-bis-saffron hover:underline font-semibold text-xs">
                  Manage Local Data & Preferences →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-3">
          <p>© 2026 BIS Smart Digital Expert. Built for Smart India Hackathon (SIH).</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Standards Database: Sync Active
            </span>
            <span>Version 1.2.0 (Reconciled Design System)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
