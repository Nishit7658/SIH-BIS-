"use client";

import React, { useState } from "react";
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
  Sparkles
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t, lowLiteracyMode, setLowLiteracyMode, isSpeaking, stopSpeaking } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/chat", label: t.askExpert, icon: MessageSquare },
    { href: "/explore", label: t.exploreStandards, icon: Compass },
    { href: "/compliance", label: t.complianceChecker, icon: CheckSquare },
    { href: "/verify", label: t.verifyLicense, icon: ShieldCheck },
    { href: "/compare", label: t.compareStandards, icon: GitCompare },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: "/admin/ops", label: "Ops & KPIs", icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-bis-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bis-navy to-bis-blue flex items-center justify-center shadow-md text-white font-black text-xl tracking-tighter border border-white/20">
              <span className="text-bis-saffron">IS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-bis-navy text-lg leading-tight tracking-tight">
                  BIS Expert
                </span>
                <span className="bg-bis-saffron/10 text-bis-saffron font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-bis-saffron/20 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI Companion
                </span>
              </div>
              <p className="text-[11px] text-bis-text-secondary font-medium hidden sm:block">
                Bureau of Indian Standards Digital Assistant
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-bis-navy text-white shadow-sm"
                      : "text-bis-text-secondary hover:text-bis-navy hover:bg-bis-canvas"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-bis-saffron" : "text-bis-blue"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls (Language, Low-Literacy Mode, Audio) */}
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

            {/* Low Literacy / Icon-guided toggle */}
            <button
              onClick={() => setLowLiteracyMode(prev => !prev)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                lowLiteracyMode
                  ? "bg-amber-100 border-amber-300 text-amber-900 shadow-sm"
                  : "bg-white border-bis-border text-bis-text-secondary hover:bg-bis-canvas"
              }`}
              title="Toggle Icon-Guided / Low-Literacy Mode"
            >
              <Eye className="w-4 h-4 text-bis-saffron" />
              <span className="hidden xl:inline">{lowLiteracyMode ? "Icon Mode: ON" : "Icon Mode"}</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-bis-blue absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="pl-8 pr-3 py-1.5 bg-white border border-bis-border rounded-lg text-xs font-semibold text-bis-navy focus:outline-none focus:ring-2 focus:ring-bis-blue/30 cursor-pointer shadow-sm"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="mr">मराठी (MR)</option>
                <option value="ta">தமிழ் (TA)</option>
              </select>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-bis-border text-bis-navy hover:bg-bis-canvas md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-bis-border bg-white px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-bis-navy text-white"
                    : "text-bis-text-secondary hover:bg-bis-canvas"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-bis-saffron" : "text-bis-blue"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
