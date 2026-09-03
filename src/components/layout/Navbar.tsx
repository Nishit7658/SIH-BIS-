"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SupportedLanguage } from "@/lib/i18n";
import {
  Search,
  BookOpen,
  FileText,
  ShieldCheck,
  GitCompare,
  Activity,
  ExternalLink,
  Menu,
  X,
  VolumeX,
  Building2,
  CheckCircle2
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, isSpeaking, stopSpeaking } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/chat", label: "Consultation Workbench" },
    { href: "/explore", label: "Standards & Lab Directory" },
    { href: "/compliance", label: "Audit & QCO Checklist" },
    { href: "/verify", label: "License Verification (CM/L)" },
    { href: "/compare", label: "Comparator" },
    { href: "/admin/ops", label: "Audit Telemetry" },
  ];

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
    { code: "ta", label: "தமிழ்" }
  ];

  return (
    <header className="border-b border-gov-border bg-white text-gov-text sticky top-0 z-50">
      {/* 1. Official Government Header Strip */}
      <div className="bg-gov-navy text-slate-300 text-[11px] px-4 py-1 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-200 tracking-wide">
              GOVERNMENT OF INDIA • BUREAU OF INDIAN STANDARDS (मानक: पथप्रदर्शक:)
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-400">
              National Standards Body under BIS Act, 2016
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold"
              >
                <VolumeX className="w-3 h-3" /> Stop Audio
              </button>
            )}

            <div className="flex items-center gap-1">
              <span className="text-slate-400">Language:</span>
              <div className="inline-flex rounded border border-slate-700 overflow-hidden">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                      language === l.code ? "bg-gov-saffron text-white" : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <a
              href="https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 hover:text-white hidden lg:flex items-center gap-1 font-medium"
            >
              <span>e-BIS Portal</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Primary Portal Title & Emblem */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded border border-gov-navy bg-gov-navy text-white flex items-center justify-center font-black text-xl font-mono">
            <span>IS</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-gov-navy tracking-tight font-serif">
                BIS Smart Digital Expert
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-gov-saffron border border-amber-300 rounded-sm">
                Regulatory RAG v2.5
              </span>
            </div>
            <p className="text-xs text-gov-slate font-medium">
              Technical Standards, QCO Directives & Factory Blueprint Intelligence System
            </p>
          </div>
        </Link>

        {/* Search Fast Shortcut */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/chat?q=What%20are%20the%20mandatory%20standards%20for%20packaging"
            className="text-xs px-2.5 py-1.5 bg-gov-paper border border-gov-border rounded hover:border-gov-slate text-gov-slate font-medium transition-colors"
          >
            Packaging QCO
          </Link>
          <Link
            href="/chat?q=Factory%20setup%20blueprint%20for%20stainless%20steel%20vacuum%20flasks"
            className="text-xs px-2.5 py-1.5 bg-gov-paper border border-gov-border rounded hover:border-gov-slate text-gov-slate font-medium transition-colors"
          >
            Steel Bottles (IS 17526)
          </Link>
          <Link
            href="/chat?q=IS%201293%20plug%20pin%20tolerances"
            className="text-xs px-2.5 py-1.5 bg-gov-paper border border-gov-border rounded hover:border-gov-slate text-gov-slate font-medium transition-colors"
          >
            Plugs (IS 1293)
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded border border-gov-border text-gov-navy"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 3. Tabbed Primary Navigation Bar */}
      <nav className="border-t border-gov-border bg-gov-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? "border-gov-navy text-gov-navy bg-white"
                      : "border-transparent text-gov-slate hover:text-gov-navy hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-gov-slate">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            <span>Registry: 60 Valid Standards</span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gov-border bg-white px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-xs font-bold text-gov-navy hover:bg-gov-paper rounded"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
