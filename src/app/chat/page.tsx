"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Citation, RagResult } from "@/lib/rag-engine";
import {
  Search,
  Send,
  Printer,
  Copy,
  CheckCircle2,
  ExternalLink,
  Volume2,
  VolumeX,
  FileText,
  AlertTriangle,
  Scale,
  Building2,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  BookOpen,
  Layers,
  FlaskConical,
  X
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  citations?: Citation[];
  confidence?: number;
  isAbstained?: boolean;
  abstainReason?: string;
  cached?: boolean;
  costTier?: string;
  latencyMs?: number;
  timestamp: string;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const { t, speakText, isSpeaking, stopSpeaking } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "### Technical Regulatory Consultation Desk\n\nI am the **BIS Smart Digital Expert**, a technical intelligence system grounded in official Bureau of Indian Standards (BIS) specifications, Quality Control Orders (QCOs), and conformity schemes (Scheme I ISI Mark vs Scheme II CRS).\n\nAsk any question regarding product compliance, testing tolerances, raw material standards, in-house laboratory setup under the BIS Scheme of Testing & Inspection (STI), or the Manakonline application process.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down">>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    }
  }, [initialQuery]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSend.trim() }),
      });

      const data: RagResult = await response.json();

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.answer,
        citations: data.citations,
        confidence: data.confidence,
        isAbstained: data.isAbstained,
        abstainReason: data.abstainReason,
        cached: data.cached,
        costTier: data.costTier,
        latencyMs: data.latencyMs,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: "bot",
        text: "⚠️ **System Communication Interruption**: Unable to retrieve response from the standards server. Please check local connectivity and retry.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = async (messageId: string, rating: "up" | "down", query: string) => {
    setFeedbackGiven(prev => ({ ...prev, [messageId]: rating }));
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, rating, messageId })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const printDossier = () => {
    window.print();
  };

  const quickConsultations = [
    { label: "Steel Bottles (IS 17526)", q: "What are the chemical composition limits and testing methods under IS 17526 for vacuum bottles?" },
    { label: "Corrugated Cartons (IS 2771)", q: "What are the bursting strength and edge crush test requirements for corrugated boxes under IS 2771?" },
    { label: "Electrical Plugs (IS 1293)", q: "What is the glow wire and temperature rise test requirement for electrical plugs under IS 1293?" },
    { label: "HDPE Pipes (IS 4984)", q: "What hydrostatic pressure test and raw material specifications apply to HDPE water pipes under IS 4984?" },
    { label: "Toys Safety (IS 9873)", q: "What are the mechanical and chemical safety standards for toys under the Toys Quality Control Order?" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* 1. Workbench Header & Export Toolbar */}
      <div className="bg-white border border-gov-border rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-gov-navy text-white px-2 py-0.5 rounded-sm">
              REGULATORY CONSOLE
            </span>
            <h1 className="text-base font-bold text-gov-navy font-serif">
              BIS Standards Consultation & Advisory Workbench
            </h1>
          </div>
          <p className="text-xs text-gov-slate mt-0.5">
            Grounded in active Indian Standards, DPIIT Quality Control Orders & Scheme of Testing and Inspection (STI).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 no-print">
          <button
            onClick={printDossier}
            className="px-3 py-1.5 bg-gov-paper hover:bg-slate-200 border border-gov-border text-gov-navy text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
            title="Print or Export as PDF Dossier"
          >
            <Printer className="w-3.5 h-3.5 text-gov-slate" />
            <span>Print Technical Dossier</span>
          </button>

          <Link
            href="/explore"
            className="px-3 py-1.5 bg-gov-paper hover:bg-slate-200 border border-gov-border text-gov-navy text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-gov-slate" />
            <span>Standards Catalog</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Workbench Layout (Split Grid: Reference Drawer + Consultation Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Reference Drawer (1 Column) */}
        <div className="lg:col-span-1 space-y-4 no-print">
          {/* Preset Questions */}
          <div className="bg-white border border-gov-border rounded p-3.5 space-y-2 shadow-subtle">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b border-gov-border pb-1">
              Standard Technical Inquiries
            </h3>
            <div className="space-y-1">
              {quickConsultations.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.q)}
                  disabled={isLoading}
                  className="w-full text-left p-2 rounded text-xs text-gov-slate hover:text-gov-navy hover:bg-gov-paper font-medium border border-transparent hover:border-gov-border transition-colors block"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Statutory Integrity Note */}
          <div className="bg-gov-paper border border-gov-border rounded p-3 text-[11px] text-gov-slate space-y-1.5">
            <p className="font-bold text-gov-navy flex items-center gap-1">
              <Scale className="w-3 h-3 text-gov-saffron" />
              Regulatory Integrity Rules:
            </p>
            <p className="leading-relaxed">
              Every technical claim is validated against active gazetted standards. If a query is outside the scope of Indian Standards, the assistant explicitly abstains rather than generating speculative claims.
            </p>
          </div>
        </div>

        {/* Center Consultation Memo Stream (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-gov-border rounded p-4 sm:p-6 shadow-subtle min-h-[550px] flex flex-col justify-between">
            {/* Message Thread */}
            <div className="space-y-6 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded border ${
                    msg.sender === "user"
                      ? "bg-slate-50 border-slate-300 text-gov-navy ml-4 sm:ml-12"
                      : "bg-white border-gov-border text-gov-text mr-0 sm:mr-4"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-gov-border/60 pb-2 mb-3 text-[11px]">
                    <span className="font-bold font-mono uppercase tracking-wide text-gov-navy">
                      {msg.sender === "user" ? "Inquiry / Request" : "Authoritative Technical Memorandum"}
                    </span>
                    <div className="flex items-center gap-2 text-gov-slate font-mono text-[10px]">
                      {msg.latencyMs && <span>Latency: {msg.latencyMs}ms</span>}
                      {msg.confidence !== undefined && (
                        <span className="font-bold text-emerald-700">
                          Confidence: {(msg.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Message Content rendered in clean prose */}
                  <div className="prose-bis text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Citations Footer for Bot Messages */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gov-border space-y-2">
                      <strong className="text-[11px] font-bold text-gov-slate uppercase tracking-wide block">
                        Verified BIS Clause Citations:
                      </strong>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((c, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedCitation(c)}
                            className="px-2.5 py-1 rounded bg-gov-paper hover:bg-slate-200 border border-gov-border text-gov-navy text-[11px] font-mono flex items-center gap-1 transition-colors"
                          >
                            <FileText className="w-3 h-3 text-gov-slate" />
                            <span>{c.standardCode} {c.clauseNumber}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions (Copy, Audio Readout, Feedback) */}
                  {msg.sender === "bot" && (
                    <div className="mt-3 pt-2 border-t border-gov-border/60 flex items-center justify-between text-[11px] text-gov-slate no-print">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="hover:text-gov-navy flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === msg.id ? "Copied" : "Copy Memo"}</span>
                        </button>

                        <button
                          onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.text)}
                          className="hover:text-gov-navy flex items-center gap-1"
                        >
                          {isSpeaking ? <VolumeX className="w-3 h-3 text-red-600" /> : <Volume2 className="w-3 h-3" />}
                          <span>{isSpeaking ? "Stop Voice" : "Audio Readout"}</span>
                        </button>
                      </div>

                      {/* Feedback rating */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">Accurate?</span>
                        <button
                          onClick={() => handleFeedback(msg.id, "up", msg.text)}
                          className={`p-1 rounded hover:bg-slate-100 ${
                            feedbackGiven[msg.id] === "up" ? "text-emerald-700 font-bold" : "text-slate-500"
                          }`}
                          title="Verified Accurate"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "down", msg.text)}
                          className={`p-1 rounded hover:bg-slate-100 ${
                            feedbackGiven[msg.id] === "down" ? "text-red-600 font-bold" : "text-slate-500"
                          }`}
                          title="Flag Inaccuracy"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="p-4 rounded border border-gov-border bg-gov-paper space-y-2 animate-pulse">
                  <div className="flex items-center gap-2 text-xs font-bold text-gov-navy">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-gov-saffron" />
                    <span>Consulting Bureau of Indian Standards Repository...</span>
                  </div>
                  <p className="text-xs text-gov-slate">
                    Matching clauses, verifying chemical composition tolerances, and synthesizing technical guide.
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Console Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="pt-3 border-t border-gov-border no-print">
              <div className="flex rounded border border-gov-border overflow-hidden bg-white focus-within:border-gov-navy shadow-subtle">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Enter your technical or compliance question (e.g. testing limits under IS 17526, glow wire requirement, scheme comparison)..."
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-gov-text focus:outline-none placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputQuery.trim()}
                  className="px-5 py-2.5 bg-gov-navy hover:bg-gov-navy-light text-white font-bold text-xs transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1"
                >
                  <span>Transmit</span>
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Citation Modal / Inspector */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gov-border max-w-xl w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between border-b border-gov-border pb-2.5">
              <div>
                <span className="font-mono font-bold text-xs text-gov-saffron">
                  {selectedCitation.standardCode} • {selectedCitation.clauseNumber}
                </span>
                <h3 className="font-bold text-sm text-gov-navy font-serif mt-0.5">
                  {selectedCitation.clauseTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="p-1 text-slate-400 hover:text-gov-navy"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gov-paper p-3 rounded border border-gov-border font-mono text-xs text-gov-slate leading-relaxed">
              {selectedCitation.snippet}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gov-border">
              <a
                href={selectedCitation.officialBisUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>Verify on e-BIS Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setSelectedCitation(null)}
                className="px-3 py-1 bg-gov-navy text-white text-xs font-bold rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gov-slate font-mono">Initializing Regulatory Console...</div>}>
      <ChatContent />
    </Suspense>
  );
}
