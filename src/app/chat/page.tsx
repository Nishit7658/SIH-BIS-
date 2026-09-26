"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Citation, RagResult } from "@/lib/rag-engine";
import {
  ArrowUp,
  Copy,
  Volume2,
  VolumeX,
  FileText,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ExternalLink,
  X,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";

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
  const { speakText, isSpeaking, stopSpeaking } = useApp();

  const [messages, setMessages] = useState<Message[]>([]);
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
    setFeedbackGiven((prev) => ({ ...prev, [messageId]: rating }));
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, rating, messageId }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const popularQueries = [
    { label: "IS 1293 Plug Earthing", q: "What are the earthing pin dimensions and testing tolerances for plugs under IS 1293?" },
    { label: "IS 302 Leakage Current", q: "What is the maximum permissible leakage current under IS 302 for electrical appliances?" },
    { label: "Plastic Recycling Codes", q: "What are the identification marking codes for plastic recycling under IS 14534?" },
  ];

  const hasMessages = messages.length > 0;

  return (
    <div
      className="min-h-screen relative flex flex-col justify-between"
      style={{
        background:
          "radial-gradient(circle at 50% 35%, rgba(216, 185, 255, 0.45) 0%, rgba(238, 225, 255, 0.25) 45%, rgba(250, 248, 254, 1) 90%)",
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          TOP STREAMLINED HEADER
          Matches frame_33.5s.png: Left back triangle + Right BiSync AI pill
          ───────────────────────────────────────────────────────────── */}
      <header className="w-full px-6 sm:px-12 py-6 flex items-center justify-between z-20">
        <Link
          href="/"
          className="group p-2 rounded-full hover:bg-purple-200/50 transition-colors flex items-center justify-center"
          title="Back to Home"
        >
          {/* Solid purple left-pointing triangle matching frame_33.5s */}
          <svg
            className="w-6 h-6 text-[#2b0059] fill-current group-hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
          >
            <polygon points="18,4 6,12 18,20" />
          </svg>
        </Link>

        <div className="bg-[#540ea3] text-white px-7 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-md">
          BiSync AI
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA
          State 1: Initial Empty / Welcome view (frame_33.5s.png)
          State 2: Active Chat Thread (frame_37.0s.png)
          ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 max-w-4xl mx-auto w-full z-10 py-6">
        {!hasMessages ? (
          /* INITIAL VIEW: Centered Headline + Frosted Box + Popular Queries */
          <div className="text-center space-y-8 my-auto">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-neutral-900 tracking-tight">
                how can we help you today?
              </h1>
              <p className="text-neutral-700 text-sm sm:text-base font-normal">
                Get clear answers about standards, certification, compliance, and BIS services
              </p>
            </div>

            {/* Central Frosted Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="bg-[#a89cb5]/60 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 text-left min-h-[140px] flex flex-col justify-between transition-all focus-within:ring-2 focus-within:ring-[#540ea3]/40">
                <textarea
                  rows={3}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about a product, standard, certification or compliance requirement..."
                  className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-700 placeholder:font-normal font-medium text-sm sm:text-base focus:outline-none resize-none"
                />

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !inputQuery.trim()}
                    className="bg-[#23004b] hover:bg-[#380277] text-white p-2.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <ArrowUp className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </form>

            {/* Popular Queries Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs sm:text-sm">
              <span className="font-semibold text-neutral-800">Popular Queries :</span>
              {popularQueries.map((pq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(pq.q)}
                  className="border border-white/80 bg-white/40 hover:bg-white/70 backdrop-blur-sm text-neutral-800 font-medium px-4 py-1.5 rounded-full transition-all hover:scale-105 shadow-xs"
                >
                  {pq.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ACTIVE CHAT THREAD: Matches frame_37.0s.png */
          <div className="space-y-8 pb-32 pt-4">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.sender === "user" ? (
                  /* User Bubble: Right-aligned pill */
                  <div className="flex justify-end">
                    <div className="bg-[#ded9e2] text-neutral-900 text-sm sm:text-base font-normal px-6 py-3.5 rounded-3xl max-w-xl shadow-sm leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  /* Assistant Response: Left-aligned direct text without bubble */
                  <div className="text-neutral-900 text-sm sm:text-base leading-relaxed space-y-4 max-w-3xl pr-4">
                    <MarkdownRenderer content={msg.text} />

                    {/* Citations Snippets */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-3 border-t border-purple-200/60 space-y-2">
                        <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">
                          Verified BIS Standard Clauses:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((c, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedCitation(c)}
                              className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-purple-200 text-[#301257] text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <FileText className="w-3 h-3 text-[#540ea3]" />
                              <span>{c.standardCode} {c.clauseNumber}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Bar (Copy, Audio Readout, Feedback) */}
                    <div className="pt-2 flex items-center justify-between text-xs text-neutral-500">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="hover:text-neutral-900 flex items-center gap-1 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                        </button>

                        <button
                          onClick={() => (isSpeaking ? stopSpeaking() : speakText(msg.text))}
                          className="hover:text-neutral-900 flex items-center gap-1 transition-colors"
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{isSpeaking ? "Stop Voice" : "Listen"}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFeedback(msg.id, "up", msg.text)}
                          className={`p-1 rounded hover:bg-white/60 ${
                            feedbackGiven[msg.id] === "up" ? "text-emerald-700 font-bold" : "text-neutral-400"
                          }`}
                          title="Accurate"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "down", msg.text)}
                          className={`p-1 rounded hover:bg-white/60 ${
                            feedbackGiven[msg.id] === "down" ? "text-red-600 font-bold" : "text-neutral-400"
                          }`}
                          title="Report Issue"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-sm text-[#301257] font-medium py-3">
                <RefreshCw className="w-4 h-4 animate-spin text-[#540ea3]" />
                <span>Consulting Bureau of Indian Standards Intelligence Engine...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          PINNED BOTTOM INPUT BAR (when active)
          Matches frame_37.0s.png exactly
          ───────────────────────────────────────────────────────────── */}
      {hasMessages && (
        <div className="fixed bottom-6 left-0 right-0 z-30 px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-2.5 pl-6 flex items-center justify-between gap-3 focus-within:ring-2 focus-within:ring-[#540ea3]/40 transition-all"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask BISync AI"
              disabled={isLoading}
              className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-500 font-normal text-sm sm:text-base focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-[#23004b] hover:bg-[#380277] text-white p-2.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </button>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CITATION DETAIL MODAL
          ───────────────────────────────────────────────────────────── */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-purple-100">
            <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="font-mono font-bold text-xs text-[#540ea3]">
                  {selectedCitation.standardCode} • {selectedCitation.clauseNumber}
                </span>
                <h3 className="font-bold text-base text-neutral-900 font-sans mt-0.5">
                  {selectedCitation.clauseTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#f8f6fc] p-4 rounded-2xl text-xs sm:text-sm text-neutral-700 leading-relaxed font-mono">
              {selectedCitation.snippet}
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={selectedCitation.officialBisUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#540ea3] hover:underline flex items-center gap-1"
              >
                <span>Verify on e-BIS Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedCitation(null)}
                className="px-4 py-2 bg-[#23004b] text-white text-xs font-bold rounded-full hover:bg-[#380277] transition-colors"
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f6fc] p-12 text-center text-neutral-600 text-sm font-sans">
          Initializing BiSync AI...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
