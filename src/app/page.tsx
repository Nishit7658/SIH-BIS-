"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { STANDARDS_DATABASE } from "@/lib/standards-data";
import { BIS_LABORATORIES_DATABASE } from "@/lib/laboratories-data";
import { BIS_SCHEMES_DATABASE } from "@/lib/schemes-data";
import {
  Search,
  MessageSquare,
  Compass,
  CheckSquare,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  FlaskConical,
  Package,
  ArrowRight,
  Sparkles,
  BookOpen,
  Volume2,
  Lock,
  Factory,
  CheckCircle2,
  Award,
  Building2,
  FileText
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const domainCards = [
    {
      domain: "Stainless Steel Bottles & Flasks",
      code: "IS 17526:2021",
      scheme: "Scheme I (ISI Mark)",
      qco: "Cookware & Insulated Flasks QCO",
      link: "/standard/is-17526-2021",
      icon: Package,
      color: "border-amber-200 hover:border-bis-saffron bg-amber-50/40"
    },
    {
      domain: "Corrugated Box Packaging",
      code: "IS 2771 (Part 1):2020",
      scheme: "Scheme I (ISI Mark)",
      qco: "Packaging Materials QCO",
      link: "/standard/is-2771-1-2020",
      icon: Layers,
      color: "border-blue-200 hover:border-bis-blue bg-blue-50/40"
    },
    {
      domain: "Electrical Plugs & Sockets",
      code: "IS 1293:2019",
      scheme: "Scheme I (ISI Mark)",
      qco: "Electrical Accessories QCO",
      link: "/standard/is-1293-2019",
      icon: Zap,
      color: "border-purple-200 hover:border-purple-500 bg-purple-50/40"
    },
    {
      domain: "HDPE & UPVC Water Pipes",
      code: "IS 4984 / IS 4985",
      scheme: "Scheme I (ISI Mark)",
      qco: "Piping & Water Supply QCO",
      link: "/standard/is-4984-2016",
      icon: FlaskConical,
      color: "border-cyan-200 hover:border-cyan-500 bg-cyan-50/40"
    },
    {
      domain: "TMT Steel & Cement",
      code: "IS 1786:2020",
      scheme: "Scheme I (ISI Mark)",
      qco: "Steel Products QCO",
      link: "/standard/is-1786-2020",
      icon: Building2,
      color: "border-emerald-200 hover:border-emerald-500 bg-emerald-50/40"
    },
    {
      domain: "Electronics & IT Hardware",
      code: "IS 16046 / IS 13252",
      scheme: "CRS Registration",
      qco: "MeitY Compulsory Registration",
      link: "/standard/is-16046-2-2018",
      icon: Cpu,
      color: "border-slate-200 hover:border-slate-500 bg-slate-50/40"
    }
  ];

  const tools = [
    {
      title: "AI Compliance Assistant",
      desc: "Conversational RAG grounded in official BIS clauses with Google Gemini.",
      link: "/chat",
      icon: MessageSquare,
      badge: "Gemini 2.5 Live"
    },
    {
      title: "Active Standards Catalog",
      desc: "Search 200+ strictly valid, non-superseded Indian Standards.",
      link: "/explore",
      icon: Compass,
      badge: "60+ Valid Codes"
    },
    {
      title: "Recognized Testing Labs (LRS)",
      desc: "Directory of BIS-accredited test houses with NABL numbers and contacts.",
      link: "/explore",
      icon: FlaskConical,
      badge: "8 Hubs Across India"
    },
    {
      title: "License Authenticity Verifier",
      desc: "Instant verification of CM/L license numbers and QR codes.",
      link: "/verify",
      icon: ShieldCheck,
      badge: "Statutory Check"
    }
  ];

  return (
    <div className="min-h-screen space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bis-navy via-bis-navy-light to-bis-navy text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bis-saffron/20 border border-bis-saffron/40 text-bis-saffron-light text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-3.5 h-3.5 text-bis-saffron" />
            Statutory Indian Standards & Factory Setup Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-tight max-w-4xl mx-auto">
            Navigate Indian Standards with <span className="text-bis-saffron">Absolute Precision</span>.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Clause-grounded guidance on BIS Quality Control Orders (QCOs), manufacturing blueprints, mandatory in-house QC laboratory equipment, and testing laboratories across India.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-8">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white p-1.5 border-2 border-white/20 focus-within:border-bis-saffron transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you manufacture? (e.g. stainless steel bottles, corrugated boxes, PVC pipes)..."
                className="w-full px-3 py-3 text-bis-text-primary text-xs sm:text-sm focus:outline-none placeholder:text-slate-400 bg-transparent font-semibold"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-bis-navy hover:bg-bis-navy-light text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4 text-bis-saffron" />
              </button>
            </div>
          </form>

          {/* Quick Domain Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-300">
            <span className="text-slate-400 font-semibold">Popular Presets:</span>
            {[
              { label: "Steel Bottles (IS 17526)", q: "I manufacture stainless steel bottles and vacuum flasks" },
              { label: "Corrugated Boxes (IS 2771)", q: "I manufacture corrugated boxes and shipping cartons" },
              { label: "Plugs & Sockets (IS 1293)", q: "I make electrical plugs and socket outlets" },
              { label: "PVC Pipes (IS 4985)", q: "I manufacture UPVC pipes for water supply" }
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => router.push(`/chat?q=${encodeURIComponent(chip.q)}`)}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium transition-colors border border-white/10"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-bis-border shadow-md">
          <div className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-bis-navy font-display">60+</span>
            <p className="text-xs text-bis-text-secondary font-medium">Valid Active Standards</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-bis-blue font-display">100%</span>
            <p className="text-xs text-bis-text-secondary font-medium">Grounded RAG Accuracy</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-bis-saffron font-display">8+</span>
            <p className="text-xs text-bis-text-secondary font-medium">Recognized Testing Labs</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-display">5</span>
            <p className="text-xs text-bis-text-secondary font-medium">Certification Schemes</p>
          </div>
        </div>
      </div>

      {/* Domain Factory Blueprints Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-bis-border pb-4">
          <div>
            <span className="text-xs font-bold text-bis-saffron uppercase tracking-wider">Manufacturing Hub</span>
            <h2 className="text-2xl font-black text-bis-navy font-display mt-0.5">
              Factory Setup & Standards Blueprints
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-bis-blue hover:text-bis-navy flex items-center gap-1"
          >
            <span>View All Standards & Labs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domainCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                href={card.link}
                className={`p-6 rounded-3xl border transition-all shadow-xs hover:shadow-md space-y-4 flex flex-col justify-between ${card.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-white shadow-xs text-bis-navy">
                      <Icon className="w-5 h-5 text-bis-blue" />
                    </div>
                    <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded-lg text-bis-navy border border-bis-border">
                      {card.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-bis-navy text-base font-display">{card.domain}</h3>
                    <p className="text-xs text-bis-text-secondary mt-1">{card.qco}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-bis-border/50 flex items-center justify-between text-xs">
                  <span className="font-bold text-bis-navy">{card.scheme}</span>
                  <span className="text-bis-blue font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Blueprint →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Core Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-bis-border pb-4">
          <span className="text-xs font-bold text-bis-blue uppercase tracking-wider">Operational Tools</span>
          <h2 className="text-2xl font-black text-bis-navy font-display mt-0.5">
            Complete BIS Compliance & Research Suite
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <Link
                key={idx}
                href={t.link}
                className="bg-white p-6 rounded-3xl border border-bis-border hover:border-bis-blue shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-bis-canvas flex items-center justify-center text-bis-blue">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {t.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-bis-navy text-sm">{t.title}</h3>
                    <p className="text-xs text-bis-text-secondary mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs font-bold text-bis-blue flex items-center gap-1">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 text-bis-saffron" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
