"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SupportedLanguage } from "@/lib/i18n";
import {
  Menu,
  X,
  VolumeX,
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-300 py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* 1. Left: Official Emblem & Title */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/emblem.svg"
            alt="State Emblem of India"
            className="h-10 w-auto object-contain shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-serif leading-none">
                BIS Smart Digital Expert
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300 rounded">
                Govt. of India
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Bureau of Indian Standards • National Standards Body
            </p>
          </div>
        </Link>

        {/* 2. Center: Tabbed Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap rounded-md transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right: Accessibility, Language & CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-bold bg-amber-50 px-2 py-1 rounded border border-amber-300"
            >
              <VolumeX className="w-3.5 h-3.5" /> Stop Audio
            </button>
          )}

          {/* Accessibility Font Size Control (GIGW Compliant) */}
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <span className="text-[11px] font-medium">Text:</span>
            <div className="inline-flex rounded border border-slate-300 overflow-hidden text-[10px] bg-slate-50">
              <button
                type="button"
                onClick={() => changeFontSize("normal")}
                className={`px-1.5 py-0.5 font-bold transition-colors ${
                  fontSizeLevel === "normal"
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-200"
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
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-200"
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
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
                title="Large Text Size (A++)"
              >
                A++
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <div className="inline-flex rounded border border-slate-300 overflow-hidden text-[10px] bg-slate-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-1.5 py-0.5 font-bold transition-colors ${
                    language === l.code
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/chat"
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Consult AI</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="xl:hidden p-2 rounded border border-slate-300 text-slate-700"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-slate-300 bg-white px-4 py-3 space-y-2 mt-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 rounded"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <Link
              href="/chat"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded"
            >
              Consult AI Expert
            </Link>
            <Link
              href="/verify"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded"
            >
              Verify License
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
