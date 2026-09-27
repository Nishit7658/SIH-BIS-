"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  BookOpenCheck,
  Building2,
  Sparkles,
  ExternalLink,
  Layers,
  Lock,
  Cpu,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      router.push(`/chat?q=${encodeURIComponent(heroQuery.trim())}`);
    } else {
      router.push("/chat");
    }
  };

  const sampleQuickQueries = [
    { label: "IS 1293 (Plugs & Sockets)", q: "What are the earthing pin dimensions and testing tolerances for plugs under IS 1293?" },
    { label: "IS 1786 (TMT Steel Bars)", q: "What are the chemical composition limits for carbon and sulphur in Fe 500D under IS 1786?" },
    { label: "IS 694 (PVC Cables)", q: "What is the insulation resistance requirement for PVC insulated cables under IS 694?" },
    { label: "IS 14534 (Plastic Recycling)", q: "What are the identification marking codes for plastic recycling under IS 14534?" }
  ];

  const statutorySectors = [
    {
      division: "Electrotechnical (ETD)",
      title: "Electrical Accessories & Appliances",
      qcoReference: "Electrical Accessories QCO, 2023",
      standards: [
        { code: "IS 1293:2019", name: "Plugs and Socket-Outlets (up to 250V / 16A)", scheme: "Scheme I (ISI Mark)" },
        { code: "IS 302-1:2008", name: "Safety of Household Electrical Appliances", scheme: "Scheme I (ISI Mark)" },
        { code: "IS 694:2010", name: "PVC Insulated Copper Cables (up to 1100V)", scheme: "Scheme I (ISI Mark)" }
      ]
    },
    {
      division: "Civil & Structural (CED)",
      title: "Construction Materials & Structural Steel",
      qcoReference: "Steel & Steel Products QCO, 2024",
      standards: [
        { code: "IS 1786:2008", name: "High Strength Deformed Steel Bars (Fe 500D / 550D)", scheme: "Scheme I (ISI Mark)" },
        { code: "IS 456:2000", name: "Plain and Reinforced Concrete - Code of Practice", scheme: "Technical Code" },
        { code: "IS 269:2015", name: "53 Grade Ordinary Portland Cement Specifications", scheme: "Scheme I (ISI Mark)" }
      ]
    },
    {
      division: "Chemical & Polymer (PCD)",
      title: "Polymeric, Packaging & Consumer Safety",
      qcoReference: "Plastic Products Conformity QCO, 2023",
      standards: [
        { code: "IS 14534:1998", name: "Guidelines for Recycling of Plastics & Marking Codes", scheme: "Statutory Rule" },
        { code: "IS 17526:2021", name: "Stainless Steel Vacuum Flasks & Insulated Containers", scheme: "Scheme I (ISI Mark)" },
        { code: "IS 10146:1982", name: "Polyethylene for Safe Use in Contact with Foodstuffs", scheme: "Food Safety Mandate" }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: GOVTECH HERO & DIRECT INTELLIGENCE INPUT
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/60 to-[#F8FAFC]">
        {/* Subtle engineering blueprint grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#0A192F 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full text-center space-y-8">
          {/* Institutional GovTech Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200 text-blue-950 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Official Bureau of Indian Standards Intelligence Initiative • BIS Act 2016 Grounded</span>
          </div>

          {/* Master Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0A192F] leading-[1.1] font-sans">
              Authoritative Standards Intelligence.
              <br />
              <span className="text-blue-700">Instant Regulatory Compliance.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg lg:text-xl font-normal max-w-3xl mx-auto leading-relaxed">
              AI-powered engineering copilot for Indian Standards (IS), mandatory Quality Control Orders (QCO), Scheme of Testing &amp; Inspection (STI), and real-time license verification.
            </p>
          </div>

          {/* Interactive Direct Search Bar */}
          <div className="max-w-3xl mx-auto pt-2">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-full p-2 pl-6 border border-slate-300 shadow-xl shadow-slate-900/5 flex items-center justify-between gap-3 focus-within:ring-2 focus-within:ring-blue-600/40 focus-within:border-blue-600 transition-all"
            >
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Ask about a standard (e.g. IS 1293 earthing pin tolerances, IS 1786 steel grades)…"
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#0A192F] hover:bg-blue-900 text-white font-bold px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm shrink-0 transition-all flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Consult Copilot</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>

            {/* Quick Sample Queries */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs">
              <span className="text-slate-500 font-semibold">Quick Inquiries:</span>
              {sampleQuickQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/chat?q=${encodeURIComponent(sq.q)}`)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-all shadow-2xs hover:text-blue-700"
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Hub Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/chat"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-lg shadow-blue-950/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Launch Standards Copilot</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/compliance"
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-8 py-3.5 rounded-full text-sm shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-blue-700" />
              <span>Pre-Audit Checklist</span>
            </Link>
            <Link
              href="/verify"
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-8 py-3.5 rounded-full text-sm shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Verify CM/L License</span>
            </Link>
          </div>

          {/* Real-Time Trust Metrics Bar */}
          <div className="pt-10 border-t border-slate-200/80 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#0A192F] font-mono">25,000+</span>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Indian Standards Cataloged</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">100%</span>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Clause-Citing Zero Hallucination</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">14+</span>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Technical Division Councils</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-amber-700 font-mono">DPDP 2023</span>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Sovereign Data Protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: FOUR MISSION-CRITICAL STATUTORY CAPABILITIES
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
            Engineered for Industrial Manufacturers, Engineers &amp; Exporters
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Everything required to navigate, verify, and comply with mandatory Bureau of Indian Standards specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Technical Standards Copilot
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Query complex Indian Standards in natural language. Our sovereign RAG engine extracts exact statutory clauses, chemical tolerances, and mechanical test specifications directly from official gazetted standards.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Zero-Hallucination Retrieval</span>
              <Link href="/chat" className="text-sm font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1">
                <span>Open Copilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Pre-Audit STI Compliance Matrix
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Assess plant readiness against the mandatory Scheme of Testing &amp; Inspection (STI). Run interactive self-evaluations for raw material testing, routine lot checks, and in-house laboratory calibration before official BIS factory audits.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Scheme I Pre-Audit Tool</span>
              <Link href="/compliance" className="text-sm font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1">
                <span>Start Pre-Audit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Real-Time CM/L &amp; CRS License Verifier
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Direct inquiry into the Bureau of Indian Standards Certificate of Manufacturing License (CM/L) and Compulsory Registration Scheme (CRS) database. Instantly verify license status, factory address, and validity to eliminate counterfeit products.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Authenticity Verification</span>
              <Link href="/verify" className="text-sm font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1">
                <span>Verify Registry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                National Standards &amp; Lab Directory
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Search, filter, and inspect over 25,000 gazetted specifications across all 14 BIS division councils. Map mandatory testing requirements directly to Central &amp; Regional BIS laboratories and accredited NABL test houses.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Technical Document Catalog</span>
              <Link href="/explore" className="text-sm font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1">
                <span>Browse Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: MANDATORY QUALITY CONTROL ORDERS (QCO) GAZETTE WATCH
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
                Statutory Regulatory Watch
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
                Mandatory Quality Control Orders (QCO) by Sector
              </h2>
              <p className="text-slate-600 text-sm max-w-2xl">
                Non-compliance with these gazetted standards is a punishable statutory violation under Section 29 of the Bureau of Indian Standards Act, 2016.
              </p>
            </div>

            <Link
              href="/explore"
              className="text-sm font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1.5 shrink-0"
            >
              <span>View All 25,000+ Standards</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {statutorySectors.map((sec, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFC] border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-full">
                      {sec.division}
                    </span>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full">
                      QCO Enforced
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{sec.title}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Gazette Ref: {sec.qcoReference}</p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-slate-200/80">
                    {sec.standards.map((std, sIdx) => (
                      <div key={sIdx} className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono font-bold text-[#0A192F]">{std.code}</span>
                          <span className="text-[10px] text-slate-500">{std.scheme}</span>
                        </div>
                        <p className="text-xs text-slate-700 line-clamp-2 leading-snug">{std.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80">
                  <Link
                    href={`/explore?category=${sec.division.split(" ")[0]}`}
                    className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 border border-slate-300 rounded-full text-xs font-bold text-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Inspect Sector Standards</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: DUAL-ENGINE ARCHITECTURE & SOVEREIGN PRIVACY
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="bg-[#0A192F] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          {/* Subtle tech background glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-blue-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold tracking-wider uppercase text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20 inline-block">
                National Data Sovereignty
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                Dual-Engine Architecture:
                <br />
                <span className="text-blue-400">Cloud Scalability &amp; Air-Gapped Security</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Engineered with enterprise security by design. When deployed to public portals, it scales dynamically via Google Gemini. For sensitive defense, nuclear, or critical infrastructure divisions, the exact same system operates 100% offline using local Gemma models with zero data telemetry.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Cpu className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Cloud Production Mode</strong>
                    <span className="text-slate-400">High-concurrency citizen access hosted securely on Vercel.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Air-Gapped Sovereign Mode</strong>
                    <span className="text-slate-400">Offline llama-server execution with local data storage.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Statutory Compliance Assured</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>DPDP Act 2023 compliant data minimization</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Deterministic citation mapping to official e-BIS portal</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Strict anti-hallucination guardrails with abstention logic</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pre-configured for Manakonline STI automated audits</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link
                  href="/chat"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-full text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Experience the Copilot Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
