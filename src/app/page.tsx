"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, CheckCircle2 } from "lucide-react";

// Signature overlapping dual circles icon from video prototype
function DualCircles({
  primaryColor = "#e06319",
  secondaryColor = "#cbd5e1",
}: {
  primaryColor?: string;
  secondaryColor?: string;
}) {
  return (
    <div className="relative w-28 h-16 select-none">
      <div
        className="w-14 h-14 rounded-full absolute left-0 top-0 shadow-md transition-transform group-hover:scale-105"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="w-14 h-14 rounded-full absolute left-7 top-0 opacity-70 transition-transform group-hover:scale-105"
        style={{ backgroundColor: secondaryColor, mixBlendMode: "multiply" }}
      />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail("");
    }
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-purple-200">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO SECTION
          Matches frame_10.0s.png exactly
          ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-8 pb-16">
        {/* Background Vertical Spectral Light Beam (right aligned) */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[60%] pointer-events-none select-none z-0 flex justify-end">
          <div className="relative w-full h-full max-w-4xl">
            <Image
              src="/assets/hero-beam.png"
              alt="Luminous Spectrum Light Beam"
              fill
              priority
              className="object-cover object-right-top opacity-95"
            />
            {/* Subtle left-side gradient feathering */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full">
          <div className="max-w-2xl space-y-8">
            {/* Headline with Serif Italic accents */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-neutral-900 leading-[1.08] font-sans">
              Standards made <span className="font-serif italic font-normal">simpler.</span>
              <br />
              Compliance made <span className="font-serif italic font-normal">smarter.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-neutral-700 text-lg sm:text-xl font-normal leading-relaxed max-w-xl">
              AI-powered assistance for Indian Standards, BIS Services, and product compliance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/chat"
                className="bg-[#540ea3] hover:bg-[#6814c4] text-white font-medium px-8 py-3.5 rounded-full text-base shadow-xl shadow-purple-950/20 transition-all hover:scale-105 active:scale-95"
              >
                Start for free
              </Link>
              <Link
                href="/explore"
                className="bg-white hover:bg-neutral-50 text-[#540ea3] border-2 border-[#540ea3] font-medium px-8 py-3 rounded-full text-base transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: FEATURE GRID & 3D SPHERES
          Matches frame_13.5s.png exactly
          ───────────────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & 3D Purple Sphere */}
            <div className="lg:col-span-6 relative">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.12] font-sans">
                Everything you
                <br />
                need to navigate
                <br />
                Indian Standards.
              </h2>

              {/* 3D Purple Sphere with soft ambient glow */}
              <div className="relative mt-12 sm:mt-16 w-64 sm:w-80 h-64 sm:h-80 select-none pointer-events-none">
                <div className="absolute inset-0 bg-purple-600/30 rounded-full blur-3xl transform scale-110" />
                <Image
                  src="/assets/purple-sphere.png"
                  alt="3D Purple Sphere"
                  width={380}
                  height={380}
                  className="relative z-10 drop-shadow-2xl object-contain animate-float"
                />
              </div>
            </div>

            {/* Right Column: 2x2 Staggered Feature Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Column A (Cards 1 & 2) */}
              <div className="space-y-6">
                {/* Card 1: Ask BISync AI */}
                <Link
                  href="/chat"
                  className="group block bg-[#540ea3] text-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer h-72 flex flex-col justify-between"
                >
                  <DualCircles primaryColor="#e06319" secondaryColor="#ded8eb" />
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-purple-200 font-medium">Copilot</span>
                    <h3 className="text-2xl font-bold tracking-tight text-white group-hover:translate-x-1 transition-transform">
                      Ask BISync AI
                    </h3>
                  </div>
                </Link>

                {/* Card 2: Find my Standard */}
                <Link
                  href="/explore"
                  className="group block bg-[#efebf5] hover:bg-[#ded8eb] text-neutral-900 p-8 rounded-[2rem] shadow-sm hover:shadow-md hover:scale-[1.03] transition-all cursor-pointer h-72 flex flex-col justify-between"
                >
                  <DualCircles primaryColor="#2b0059" secondaryColor="#cbd5e1" />
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-purple-700 font-medium">Directory</span>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-900 group-hover:translate-x-1 transition-transform">
                      Find my Standard
                    </h3>
                  </div>
                </Link>
              </div>

              {/* Column B (Cards 3 & 4 with top stagger offset matching Figma) */}
              <div className="space-y-6 sm:mt-10">
                {/* Card 3: Compliance Checker */}
                <Link
                  href="/compliance"
                  className="group block bg-[#efebf5] hover:bg-[#ded8eb] text-neutral-900 p-8 rounded-[2rem] shadow-sm hover:shadow-md hover:scale-[1.03] transition-all cursor-pointer h-72 flex flex-col justify-between"
                >
                  <DualCircles primaryColor="#2b0059" secondaryColor="#cbd5e1" />
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-purple-700 font-medium">Assessment</span>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-900 group-hover:translate-x-1 transition-transform">
                      Compliance Checker
                    </h3>
                  </div>
                </Link>

                {/* Card 4: BIS Services */}
                <Link
                  href="/compliance"
                  className="group block bg-[#efebf5] hover:bg-[#ded8eb] text-neutral-900 p-8 rounded-[2rem] shadow-sm hover:shadow-md hover:scale-[1.03] transition-all cursor-pointer h-72 flex flex-col justify-between"
                >
                  <DualCircles primaryColor="#e06319" secondaryColor="#cbd5e1" />
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-purple-700 font-medium">e-BIS Portals</span>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-900 group-hover:translate-x-1 transition-transform">
                      BIS Services
                    </h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: "Find the right standard for your product."
          Matches frame_18.2s.png - frame_19.5s.png with full composite
          ───────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <Link
          href="/explore"
          className="group block relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-purple-900/20 hover:scale-[1.005]"
        >
          <div className="relative w-full aspect-[2511/2768] min-h-[550px] sm:min-h-[700px] lg:min-h-[850px]">
            <Image
              src="/assets/find-standards-banner.png"
              alt="Find the right standard for your product - Vacuum Flask, 9W LED Bulb, CNC MCB"
              fill
              priority
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
            />
            {/* Hover overlay hint */}
            <div className="absolute top-8 right-8 z-20">
              <span className="bg-white/90 backdrop-blur-md text-[#540ea3] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg inline-flex items-center gap-2 group-hover:bg-[#540ea3] group-hover:text-white transition-all">
                <span>Browse Product Catalog</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: NEWSLETTER / BLOG INBOX
          Matches frame_19.5s.png exactly
          ───────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#540ea3] rounded-[2.5rem] p-10 sm:p-16 lg:p-20 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-12">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.18] font-sans">
              Get the latest BISYNC news and
              <br />
              blog straight to your inbox
            </h2>

            <form onSubmit={handleSubscribe} className="max-w-3xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/50 pb-4 focus-within:border-white transition-colors">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-transparent text-white placeholder-white/70 text-lg sm:text-xl font-normal w-full focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-neutral-100 text-neutral-950 font-semibold px-8 py-3.5 rounded-full inline-flex items-center gap-2 text-base transition-all hover:scale-105 active:scale-95 shrink-0 shadow-lg"
                >
                  <span>Subscribe</span>
                  <ArrowUpRight className="w-5 h-5 text-neutral-900" />
                </button>
              </div>

              {subscribed && (
                <div className="mt-4 flex items-center gap-2 text-purple-200 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Thank you for subscribing! You will receive official BIS Gazette &amp; standard updates.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
