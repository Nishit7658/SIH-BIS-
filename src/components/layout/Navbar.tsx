"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SupportedLanguage } from "@/lib/i18n";
import { Menu, X, Globe, ChevronDown } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Dedicated Chat Workbench in the Figma prototype uses its own streamlined header
  if (pathname === "/chat") {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Standards Catalog" },
    { href: "/compliance", label: "Pre-Audit Matrix" },
    { href: "/verify", label: "Verify License" },
  ];

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
    { code: "ta", label: "தமிழ்" },
  ];

  const currentLangLabel = languages.find((l) => l.code === language)?.label || "Language";

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
      <div className="bg-[#0A192F] text-white rounded-full px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl shadow-slate-950/40 border border-slate-700/50 backdrop-blur-md">
        {/* Brand Left */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/emblem.svg"
            alt="State Emblem of India"
            className="h-7 w-auto object-contain brightness-0 invert opacity-95 shrink-0 group-hover:opacity-100 transition-opacity"
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-[0.2em] text-white uppercase font-sans leading-none">
              BISYNC
            </span>
            <span className="text-[9px] text-amber-400 font-semibold tracking-wider uppercase mt-0.5 hidden sm:inline">
              Bureau of Indian Standards AI
            </span>
          </div>
        </Link>

        {/* Center Nav Items */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs sm:text-sm tracking-wide transition-colors ${
                  isActive
                    ? "text-[#F59E0B] font-bold"
                    : "text-slate-300 hover:text-white font-medium"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Language Switcher Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="border border-slate-600 hover:border-slate-400 text-slate-200 rounded-full px-4 py-2 text-xs font-medium hover:bg-white/10 transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLangLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#0A192F] border border-slate-700 rounded-2xl shadow-xl py-1 z-50 text-xs">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-800 transition-colors ${
                      language === l.code ? "text-[#F59E0B] font-bold" : "text-white/90"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Launch Copilot CTA Pill */}
          <Link
            href="/chat"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-2 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <span>Ask Copilot</span>
            <span className="text-blue-200">↗</span>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/chat"
            className="bg-blue-600 text-white rounded-full px-3.5 py-1.5 text-xs font-bold"
          >
            Copilot
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white p-1 hover:text-amber-300"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 bg-[#0A192F] border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-200 hover:text-[#F59E0B] py-1 px-2"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Language:</span>
            <div className="flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    language === l.code ? "bg-[#F59E0B] text-slate-950 font-bold" : "bg-slate-800 text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
