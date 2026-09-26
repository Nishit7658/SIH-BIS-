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
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, isSpeaking, stopSpeaking } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<"normal" | "large" | "larger">("normal");

  const changeFontSize = (level: "normal" | "large" | "larger") => {
    setFontSizeLevel(level);
    if (typeof document !== "undefined") {
      if (level === "normal") {
        document.documentElement.style.fontSize = "100%";
      } else if (level === "large") {
        document.documentElement.style.fontSize = "108%";
      } else if (level === "larger") {
        document.documentElement.style.fontSize = "116%";
      }
    }
  };

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

            {/* Accessibility Font Size Control (GIGW Compliant) */}
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-slate-400">Text:</span>
              <div className="inline-flex rounded border border-slate-700 overflow-hidden text-[10px]">
                <button
                  type="button"
                  onClick={() => changeFontSize("normal")}
                  className={`px-1.5 py-0.5 font-bold transition-colors ${
                    fontSizeLevel === "normal"
                      ? "bg-gov-saffron text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                  title="Default Text Size (A)"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => changeFontSize("large")}
                  className={`px-1.5 py-0.5 font-bold transition-colors ${
                    fontSizeLevel === "large"
                      ? "bg-gov-saffron text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                  title="Medium Text Size (A+)"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => changeFontSize("larger")}
                  className={`px-1.5 py-0.5 font-bold transition-colors ${
                    fontSizeLevel === "larger"
                      ? "bg-gov-saffron text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                  title="Large Text Size (A++)"
                >
                  A++
                </button>
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
          <img
            src="/emblem.svg"
            alt="State Emblem of India"
            className="h-12 w-auto object-contain shrink-0 drop-shadow-sm"
          />
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

        {/* Official Statutory Quick Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/chat"
            className="text-xs px-3.5 py-2 bg-gov-navy hover:bg-slate-900 text-white font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Consult AI Expert</span>
            <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
          </Link>
          <Link
            href="/verify"
            className="text-xs px-3 py-2 bg-white border border-gov-border hover:border-gov-slate text-gov-navy font-semibold rounded transition-colors"
          >
            Verify License (CM/L)
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
