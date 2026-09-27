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
    { href: "/explore", label: "Standards" },
    { href: "/compliance", label: "BIS Services" },
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
      <div className="bg-[#300060] text-white rounded-full px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl shadow-purple-950/40 border border-purple-900/30 backdrop-blur-md">
        {/* Brand Left */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/emblem.svg"
            alt="State Emblem of India"
            className="h-6 w-auto object-contain brightness-0 invert opacity-90 shrink-0 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-white uppercase font-sans">
            BISYNC
          </span>
        </Link>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wide transition-colors ${
                  isActive
                    ? "text-[#F16104] font-semibold"
                    : "text-white/80 hover:text-white font-medium"
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
              className="border border-white/60 hover:border-white text-white rounded-full px-5 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 opacity-80" />
              <span>{currentLangLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#300060] border border-purple-800/60 rounded-2xl shadow-xl py-1 z-50 text-xs">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-purple-900/60 transition-colors ${
                      language === l.code ? "text-[#F16104] font-bold" : "text-white/90"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BiSync AI White CTA Pill */}
          <Link
            href="/chat"
            className="bg-white hover:bg-slate-100 text-[#300060] rounded-full px-6 py-2 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            BISync AI
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/chat"
            className="bg-white text-[#300060] rounded-full px-3.5 py-1.5 text-xs font-bold"
          >
            AI
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white p-1 hover:text-purple-300"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-2 bg-[#300060] border border-purple-900/40 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-white/90 hover:text-[#F16104] py-1 px-2"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between">
            <span className="text-xs text-white/70">Language:</span>
            <div className="flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    language === l.code ? "bg-[#F16104] text-white font-bold" : "bg-purple-950 text-white"
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
