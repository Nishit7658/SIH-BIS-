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
    <footer className="bg-black text-white border-t border-neutral-900 pt-20 pb-12 px-6 sm:px-12 lg:px-20 transition-all">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top 4-Column Grid: Address, Email, Number, Let's Chat Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
          {/* Col 1: Address */}
          <div>
            <h3 className="text-white font-medium text-lg tracking-wide mb-4">Address</h3>
            <div className="text-neutral-400 text-sm leading-relaxed space-y-1">
              <p className="font-semibold text-neutral-300">Bureau of Indian Standards</p>
              <p>Manak Bhavan, 9 Bahadur Shah Zafar Marg</p>
              <p>New Delhi, Delhi 110002</p>
              <p>Central Testing Facility, Sahibabad</p>
            </div>
          </div>

          {/* Col 2: Email */}
          <div>
            <h3 className="text-white font-medium text-lg tracking-wide mb-4">Email</h3>
            <div className="text-neutral-400 text-sm leading-relaxed space-y-1.5">
              <p><a href="mailto:info@bis.gov.in" className="hover:text-white transition-colors">info@bis.gov.in</a></p>
              <p><a href="mailto:complaints@bis.gov.in" className="hover:text-white transition-colors">complaints@bis.gov.in</a></p>
              <p><a href="mailto:support@bisync.gov.in" className="hover:text-white transition-colors">support@bisync.gov.in</a></p>
              <p><a href="mailto:gazette@services.bis.gov.in" className="hover:text-white transition-colors">gazette@services.bis.gov.in</a></p>
            </div>
          </div>

          {/* Col 3: Number */}
          <div>
            <h3 className="text-white font-medium text-lg tracking-wide mb-4">Number</h3>
            <div className="text-neutral-400 text-sm leading-relaxed space-y-1.5">
              <p><a href="tel:+911123230131" className="hover:text-white transition-colors">+91 11 2323 0131</a></p>
              <p><a href="tel:+911123233375" className="hover:text-white transition-colors">+91 11 2323 3375</a></p>
              <p className="text-amber-400 font-medium">Toll Free: 1800 11 4000</p>
              <p className="text-xs text-neutral-500">Mon - Fri: 09:00 - 17:30 IST</p>
            </div>
          </div>

          {/* Col 4: Let's Chat Button */}
          <div className="flex sm:justify-end">
            <Link
              href="/chat"
              className="bg-[#5D00B7] hover:bg-[#6A00C4] text-white font-medium px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 text-base shadow-lg shadow-purple-950/60 transition-all hover:scale-105 active:scale-95"
            >
              <span>Let&apos;s Chat</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Directory Links Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pt-10 border-t border-neutral-900 text-sm">
          <div>
            <h4 className="text-neutral-500 font-medium mb-3">Standards & Research</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/explore" className="hover:text-white transition-colors">IS Standards Catalog</Link></li>
              <li><Link href="/explore?category=Electrical" className="hover:text-white transition-colors">Electrical Safety Specs</Link></li>
              <li><Link href="/explore?category=Chemicals" className="hover:text-white transition-colors">Chemical & Polymeric Norms</Link></li>
              <li><Link href="/explore?category=Consumer" className="hover:text-white transition-colors">Consumer Product Standards</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-neutral-500 font-medium mb-3">Statutory Portals</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="https://www.manakonline.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Manakonline (e-BIS)</a></li>
              <li><a href="https://dpiit.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">DPIIT Quality Control Orders</a></li>
              <li><a href="https://www.meity.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">MeitY CRS Electronics Portal</a></li>
              <li><a href="https://nabl-india.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">NABL Accredited Test Houses</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-neutral-500 font-medium mb-3">Testing & Conformity</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><span className="text-neutral-400">Central Lab: Sahibabad (UP)</span></li>
              <li><span className="text-neutral-400">Western Lab: Andheri, Mumbai</span></li>
              <li><span className="text-neutral-400">Southern Lab: Taramani, Chennai</span></li>
              <li><span className="text-neutral-400">Eastern Lab: Salt Lake, Kolkata</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-neutral-500 font-medium mb-3">Platform & Legal</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/compliance" className="hover:text-white transition-colors">BIS Compliance Suite</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">BiSync AI Copilot</Link></li>
              <li><span className="text-neutral-500 text-xs leading-relaxed block mt-1">DPDP Act (2023) compliant local telemetry & verifiable audit logs.</span></li>
            </ul>
          </div>
        </div>

        {/* Big Tracked Brand Footer Title matching Video */}
        <div className="pt-16 pb-6 border-t border-neutral-900">
          <h2 className="text-5xl sm:text-7xl md:text-9xl font-light tracking-[0.32em] text-white uppercase select-none font-sans leading-none">
            BISYNC
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-600">
            <p>© {new Date().getFullYear()} BISYNC. Bureau of Indian Standards Intelligence & Pre-Compliance Platform.</p>
            <p className="text-neutral-500">Statutory Data Grounded via BIS Act, 2016 & Official Gazette Notifications.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
