"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { STANDARDS_DATABASE } from "@/lib/standards-data";
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
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { t, speakText, lowLiteracyMode } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const categories = [
    { name: "Packaging & Paper", icon: Package, count: "IS 2771, IS 1060, IS 10146, IS 14534", color: "bg-amber-50 text-amber-800 border-amber-200" },
    { name: "Electrical & Power", icon: Zap, count: "IS 1293, IS 302, IS 694, IS 3854", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "Electronics & IT (CRS)", icon: Cpu, count: "IS 16046, IS 13252, IS 16221", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { name: "Civil & Construction", icon: Layers, count: "IS 1786, IS 269, IS 2062, IS 456", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { name: "Chemicals & Pipes", icon: FlaskConical, count: "IS 4984, IS 4985, IS 15778", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bis-navy via-bis-navy-light to-bis-navy-dark text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bis-saffron/20 border border-bis-saffron/40 text-bis-saffron-light text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-3.5 h-3.5 text-bis-saffron" />
            Verified Active Standards for Indian Manufacturing & Packaging
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight max-w-3xl mx-auto">
            Navigate Indian Standards with <span className="text-bis-saffron">Absolute Precision</span>.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Instant, clause-grounded guidance on BIS Quality Control Orders (QCOs), ISI Mark specifications, mandatory test parameters, and conformity assessment schemes.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-8">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white p-1.5 border-2 border-white/20 focus-within:border-bis-saffron transition-all">
              <Search className="w-6 h-6 text-bis-text-muted ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you manufacture? (e.g. corrugated boxes, electrical plugs, PVC pipes)..."
                className="w-full px-4 py-3 text-bis-text-primary text-sm sm:text-base focus:outline-none placeholder:text-slate-400 bg-transparent font-medium"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-bis-saffron hover:bg-bis-saffron-dark text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-1.5 shrink-0"
              >
                <span>Find Standards</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Business Recommender Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-slate-300">
            <span className="text-slate-400 font-semibold">Popular Business Domains:</span>
            {[
              "Corrugated Box Packaging",
              "Food Contact Plastic Pouches",
              "Electrical Plugs (IS 1293)",
              "LED Lighting & Drivers",
              "PVC & HDPE Water Pipes",
              "TMT Steel Rebars"
            ].map((chip) => (
              <Link
                key={chip}
                href={`/explore?category=All`}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-all text-[11px]"
              >
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Low-Literacy / Visual Icon Quick Jump */}
      {lowLiteracyMode && (
        <section className="bg-amber-50 border-b border-amber-200 py-4 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-200 rounded-lg text-amber-900 font-bold">🎯</span>
              <div>
                <h3 className="text-sm font-bold text-amber-900">Icon-Guided Easy Navigation</h3>
                <p className="text-xs text-amber-700">Click any large picture to jump directly</p>
              </div>
            </div>
            <button
              onClick={() => speakText("You are using Icon-Guided Mode. Click Ask AI to ask questions, or Click Explore to see all standards.")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold"
            >
              <Volume2 className="w-4 h-4" /> Listen
            </button>
          </div>
        </section>
      )}

      {/* Feature Pillar Highlights */}
      <section className="py-12 bg-white border-b border-bis-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-bis-canvas border border-bis-border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-bis-blue flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-bis-navy text-sm mb-1">Clause-Grounded AI</h3>
              <p className="text-xs text-bis-text-secondary leading-relaxed">
                Zero hallucinations. Every answer directly references specific IS clauses, sub-clauses, and test tables.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-bis-canvas border border-bis-border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-bis-saffron flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-bis-navy text-sm mb-1">Strict Abstain Logic</h3>
              <p className="text-xs text-bis-text-secondary leading-relaxed">
                When standards are silent or out of scope, the system explicitly abstains rather than guessing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-bis-canvas border border-bis-border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-bis-navy text-sm mb-1">Compliance Wizard</h3>
              <p className="text-xs text-bis-text-secondary leading-relaxed">
                Input your product specifications to generate an automated clause gap-analysis checklist.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-bis-canvas border border-bis-border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-bis-navy text-sm mb-1">DPDP Act Compliant</h3>
              <p className="text-xs text-bis-text-secondary leading-relaxed">
                Built-in purpose limitation with user configurable retention TTL for confidential product data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-bis-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-bis-navy font-display">Major Industry Categories</h2>
              <p className="text-xs text-bis-text-secondary">Explore mandatory QCOs by technical domain</p>
            </div>
            <Link href="/explore" className="text-xs font-semibold text-bis-blue hover:underline flex items-center gap-1">
              View All {STANDARDS_DATABASE.length} Standards →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/explore?category=${encodeURIComponent(cat.name.split(" ")[0])}`}
                  className={`p-4 rounded-2xl border ${cat.color} hover:scale-[1.02] transition-all shadow-sm flex flex-col justify-between`}
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center mb-3 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-bis-navy mb-1">{cat.name}</h3>
                    <p className="text-[11px] text-bis-text-secondary">{cat.count}</p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold">
                    <span>Browse</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Active Standards List */}
      <section className="py-12 bg-white border-t border-bis-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-bis-navy font-display">Featured Quality Control Orders (QCOs)</h2>
              <p className="text-xs text-bis-text-secondary">Direct access to critical Indian Standards & testing parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STANDARDS_DATABASE.slice(0, 6).map((std) => (
              <div
                key={std.id}
                className="p-5 rounded-2xl bg-white border border-bis-border hover:border-bis-blue transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-bis-blue-soft text-bis-blue font-mono font-bold text-xs">
                      {std.code}
                    </span>
                    {std.isMandatory && (
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
                        Mandatory QCO
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-bis-navy text-sm line-clamp-2 mb-2">
                    {std.title}
                  </h3>
                  <p className="text-xs text-bis-text-secondary line-clamp-3 leading-relaxed mb-4">
                    {std.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-bis-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-bis-text-muted font-medium">
                    {std.clauses.length} Clauses • {std.department}
                  </span>
                  <Link
                    href={`/standard/${std.id}`}
                    className="text-xs font-bold text-bis-blue hover:text-bis-navy flex items-center gap-1"
                  >
                    View Clauses <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
