import React from "react";
import Link from "next/link";
import { Search, ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-bis-border p-8 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-bis-saffron mx-auto flex items-center justify-center font-black text-2xl">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-bis-navy font-display">
            Standard or Page Not Found
          </h1>
          <p className="text-xs text-bis-text-secondary leading-relaxed">
            The Indian Standard code or page you requested could not be located in the current digital repository.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/explore"
            className="w-full sm:w-auto px-4 py-2.5 bg-bis-navy hover:bg-bis-navy-light text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-bis-saffron" />
            <span>Search Standards Catalog</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2.5 bg-bis-canvas hover:bg-slate-200 border border-bis-border text-bis-navy text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
