"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Scale, ShieldAlert, Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gov-navy text-slate-300 border-t border-slate-800 text-xs">
      {/* 1. Official Directory & Gazette Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Statutory Authority */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold font-serif text-sm">
              <span className="w-5 h-5 bg-gov-saffron text-white rounded-sm flex items-center justify-center font-mono text-xs">IS</span>
              <span>Bureau of Indian Standards (BIS)</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              The National Standards Body of India, established under the Bureau of Indian Standards Act, 2016 for the harmonious development of standardisation, marking, and quality certification of goods.
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300 space-y-1">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" /> Statutory Gazette Notice:
              </p>
              <p className="text-slate-400 leading-normal">
                This platform is an AI-assisted technical research and pre-compliance guidance system. For formal conformity certification, licensing, or legal disputes, consult the official e-BIS gazette portal at <em>services.bis.gov.in</em> and <em>manakonline.in</em>.
              </p>
            </div>
          </div>

          {/* Col 2: Official Portals */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
              Statutory Web Portals
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-slate-500" /> BIS Official Portal (bis.gov.in)
                </a>
              </li>
              <li>
                <a href="https://www.manakonline.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-slate-500" /> Manakonline (e-BIS Form V)
                </a>
              </li>
              <li>
                <a href="https://dpiit.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-slate-500" /> DPIIT Quality Control Orders
                </a>
              </li>
              <li>
                <a href="https://www.meity.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-slate-500" /> MeitY Compulsory Registration
                </a>
              </li>
              <li>
                <a href="https://nabl-india.org" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-slate-500" /> NABL Accredited Testing Labs
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Central & Regional Test Houses */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
              Central Test Laboratories
            </h4>
            <div className="text-slate-400 space-y-1 text-[11px]">
              <p><strong>Central Laboratory:</strong> Sahibabad, Ghaziabad (UP)</p>
              <p><strong>Western Regional Lab:</strong> Andheri East, Mumbai</p>
              <p><strong>Southern Regional Lab:</strong> CIT Campus, Taramani, Chennai</p>
              <p><strong>Eastern Regional Lab:</strong> Salt Lake, Kolkata</p>
              <p><strong>Northern Regional Lab:</strong> Mohali, Punjab</p>
            </div>
          </div>
        </div>

        {/* 2. Sub-Footer Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Bureau of Indian Standards Intelligence Assistant. Powered by Grounded RAG & Technical Standards Repository.</p>
          <div className="flex items-center gap-4">
            <Link href="/saved" className="hover:text-slate-300">DPDP Data Retention</Link>
            <span>•</span>
            <Link href="/admin/ops" className="hover:text-slate-300">Content Operations</Link>
            <span>•</span>
            <Link href="/admin/metrics" className="hover:text-slate-300">Impact Telemetry</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
