import React from "react";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bis-navy via-bis-blue to-bis-saffron flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-white font-black text-xl tracking-tighter">IS</span>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-bis-saffron flex items-center justify-center animate-ping">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <h3 className="font-bold text-bis-navy text-sm font-display tracking-tight">
          Retrieving Technical Standards & Clauses...
        </h3>
        <p className="text-xs text-bis-text-secondary">
          Consulting official Bureau of Indian Standards (BIS) knowledge base
        </p>
      </div>
    </div>
  );
}
