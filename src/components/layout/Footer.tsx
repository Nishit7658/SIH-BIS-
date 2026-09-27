"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hidden on dedicated AI Chat Workbench to match video prototype
  if (pathname === "/chat") {
    return null;
  }

  return (
    <footer className="bg-[#07111E] text-white border-t border-slate-800/80 pt-16 pb-12 px-6 sm:px-12 lg:px-20 transition-all">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top 4-Column Grid: Address, Email, Number, Copilot CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
          {/* Col 1: Address */}
          <div>
            <h3 className="text-white font-semibold text-base tracking-wide mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Headquarters</span>
            </h3>
            <div className="text-slate-400 text-sm leading-relaxed space-y-1">
              <p className="font-semibold text-slate-200">Bureau of Indian Standards</p>
              <p>Manak Bhavan, 9 Bahadur Shah Zafar Marg</p>
              <p>New Delhi, Delhi 110002</p>
              <p className="text-slate-400">Central Testing Facility, Sahibabad</p>
            </div>
          </div>

          {/* Col 2: Email */}
          <div>
            <h3 className="text-white font-semibold text-base tracking-wide mb-4">Official Channels</h3>
            <div className="text-slate-400 text-sm leading-relaxed space-y-1.5">
              <p><a href="mailto:info@bis.gov.in" className="hover:text-blue-400 transition-colors">info@bis.gov.in</a></p>
              <p><a href="mailto:complaints@bis.gov.in" className="hover:text-blue-400 transition-colors">complaints@bis.gov.in</a></p>
              <p><a href="mailto:support@bisync.gov.in" className="hover:text-blue-400 transition-colors">support@bisync.gov.in</a></p>
              <p><a href="mailto:gazette@services.bis.gov.in" className="hover:text-blue-400 transition-colors">gazette@services.bis.gov.in</a></p>
            </div>
          </div>

          {/* Col 3: Number */}
          <div>
            <h3 className="text-white font-semibold text-base tracking-wide mb-4">Statutory Helpline</h3>
            <div className="text-slate-400 text-sm leading-relaxed space-y-1.5">
              <p><a href="tel:+911123230131" className="hover:text-blue-400 transition-colors">+91 11 2323 0131</a></p>
              <p><a href="tel:+911123233375" className="hover:text-blue-400 transition-colors">+91 11 2323 3375</a></p>
              <p className="text-amber-400 font-semibold">Toll Free: 1800 11 4000</p>
              <p className="text-xs text-slate-500">Mon - Fri: 09:00 - 17:30 IST</p>
            </div>
          </div>

          {/* Col 4: Copilot CTA Button */}
          <div className="flex sm:justify-end">
            <Link
              href="/chat"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2.5 text-sm shadow-lg shadow-blue-900/30 transition-all hover:scale-105 active:scale-95 border border-blue-400/20"
            >
              <span>Consult BIS Copilot</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Directory Links Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pt-10 border-t border-slate-800/80 text-sm">
          <div>
            <h4 className="text-slate-300 font-semibold mb-3">Standards & Research</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/explore" className="hover:text-white transition-colors">IS Standards Catalog</Link></li>
              <li><Link href="/explore?category=Electrical" className="hover:text-white transition-colors">Electrical Safety Specs</Link></li>
              <li><Link href="/explore?category=Chemicals" className="hover:text-white transition-colors">Chemical & Polymeric Norms</Link></li>
              <li><Link href="/explore?category=Consumer" className="hover:text-white transition-colors">Consumer Product Standards</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-300 font-semibold mb-3">Statutory Portals</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="https://www.manakonline.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Manakonline (e-BIS)</a></li>
              <li><a href="https://dpiit.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">DPIIT Quality Control Orders</a></li>
              <li><a href="https://www.meity.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">MeitY CRS Electronics Portal</a></li>
              <li><a href="https://nabl-india.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">NABL Accredited Test Houses</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-300 font-semibold mb-3">Testing & Conformity</h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="text-slate-400">Central Lab: Sahibabad (UP)</span></li>
              <li><span className="text-slate-400">Western Lab: Andheri, Mumbai</span></li>
              <li><span className="text-slate-400">Southern Lab: Taramani, Chennai</span></li>
              <li><span className="text-slate-400">Eastern Lab: Salt Lake, Kolkata</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-300 font-semibold mb-3">Platform & Legal</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/compliance" className="hover:text-white transition-colors">BIS Compliance Suite</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">BiSync AI Copilot</Link></li>
              <li><span className="text-slate-500 text-xs leading-relaxed block mt-1">DPDP Act (2023) compliant local telemetry & verifiable audit logs.</span></li>
            </ul>
          </div>
        </div>

        {/* Big Tracked Brand Footer Title */}
        <div className="pt-16 pb-6 border-t border-slate-800/80">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              BUREAU OF INDIAN STANDARDS • STATUTORY AI INITIATIVE
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-[0.25em] text-white uppercase select-none font-sans leading-none">
            BISYNC
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} BISYNC. Bureau of Indian Standards Intelligence & Pre-Compliance Platform.</p>
            <p className="text-slate-500">Statutory Data Grounded via BIS Act, 2016 & Official Gazette Notifications.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
