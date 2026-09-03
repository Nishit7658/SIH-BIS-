"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SupportedLanguage } from "@/lib/i18n";
import {
  MessageSquare,
  Compass,
  CheckSquare,
  ShieldCheck,
  GitCompare,
  Bookmark,
  Activity,
  Globe,
  Eye,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Wrench,
  FileCheck
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t, lowLiteracyMode, setLowLiteracyMode, isSpeaking, stopSpeaking } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mainLinks = [
    { href: "/chat", label: t.askExpert, icon: MessageSquare },
    { href: "/explore", label: t.exploreStandards, icon: Compass },
    { href: "/compliance", label: t.complianceChecker, icon: CheckSquare },
  ];

  const toolLinks = [
    { href: "/verify", label: t.verifyLicense, icon: ShieldCheck, desc: "Instant CM/L license authenticity check" },
    { href: "/compare", label: t.compareStandards, icon: GitCompare, desc: "Side-by-side technical specs comparator" },
    { href: "/saved", label: "Saved Workspace", icon: Bookmark, desc: "Bookmarked standards & compliance reports" },
    { href: "/admin/ops", label: "Admin & Operations", icon: Activity, desc: "Audit queue & system evaluation metrics" },
  ];

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "EN" },
    { code: "hi", label: "हिंदी", flag: "HI" },
    { code: "gu", label: "ગુજરાતી", flag: "GU" },
    { code: "mr", label: "मराठी", flag: "MR" },
    { code: "ta", label: "தமிழ்", flag: "TA" }
  ];

  const isToolsActive = toolLinks.some(tl => pathname === tl.href || pathname.startsWith(tl.href));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-bis-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-bis-navy to-bis-blue flex items-center justify-center shadow-md text-white font-black text-lg tracking-tighter border border-white/20 group-hover:scale-105 transition-transform">
              <span className="text-bis-saffron">IS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-bis-navy text-base sm:text-lg leading-tight tracking-tight">
                  BIS Expert
                </span>
                <span className="bg-bis-saffron/10 text-bis-saffron font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-bis-saffron/20 hidden sm:flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI Digital Assistant
                </span>
              </div>
              <p className="text-[10px] text-bis-text-secondary font-medium hidden md:block">
                Bureau of Indian Standards Technical Repository
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {mainLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-bis-navy text-white shadow-xs"
                      : "text-bis-text-secondary hover:text-bis-navy hover:bg-bis-canvas"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-bis-saffron" : "text-bis-blue"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isToolsActive
                    ? "bg-bis-navy text-white shadow-xs"
                    : "text-bis-text-secondary hover:text-bis-navy hover:bg-bis-canvas"
                }`}
              >
                <Wrench className={`w-3.5 h-3.5 ${isToolsActive ? "text-bis-saffron" : "text-bis-blue"}`} />
                <span>Tools & Registry</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${toolsDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-bis-border shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-bis-border/50">
                    Verification & Compliance Tools
                  </div>
                  <div className="space-y-1 pt-1">
                    {toolLinks.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = pathname === tool.href;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setToolsDropdownOpen(false)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs transition-colors ${
                            isActive ? "bg-bis-blue-soft text-bis-navy font-bold" : "hover:bg-bis-canvas text-bis-text-secondary hover:text-bis-navy"
                          }`}
                        >
                          <div className="p-1 rounded-lg bg-bis-canvas text-bis-blue shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-bis-navy">{tool.label}</p>
                            <p className="text-[10px] text-slate-400 leading-tight">{tool.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Audio Indicator */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold animate-pulse border border-red-200"
                title="Stop Audio Readout"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stop Audio</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-bis-border bg-bis-canvas hover:bg-slate-200 text-xs font-bold text-bis-navy transition-colors"
                title="Select Interface Language"
              >
                <Globe className="w-3.5 h-3.5 text-bis-blue" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
              </button>
              <div className="absolute right-0 mt-1 hidden group-hover:block bg-white rounded-xl shadow-lg border border-bis-border py-1 w-32 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-bis-canvas ${
                      language === lang.code ? "text-bis-saffron font-bold bg-bis-canvas" : "text-bis-navy"
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[10px] text-slate-400">{lang.flag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-bis-border lg:hidden text-bis-navy hover:bg-bis-canvas transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-bis-border bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Main Navigation</p>
            {mainLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive ? "bg-bis-navy text-white shadow-xs" : "text-bis-navy hover:bg-bis-canvas"
                  }`}
                >
                  <Icon className="w-4 h-4 text-bis-blue" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1 pt-2 border-t border-bis-border/60">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Verification & Tools</p>
            {toolLinks.map((tool) => {
              const Icon = tool.icon;
              const isActive = pathname === tool.href;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive ? "bg-bis-navy text-white shadow-xs" : "text-bis-navy hover:bg-bis-canvas"
                  }`}
                >
                  <Icon className="w-4 h-4 text-bis-saffron" />
                  <span>{tool.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
