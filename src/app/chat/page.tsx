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
  Plus,
  Search,
  PanelLeft,
  MessageSquare,
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

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
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

  // Inferred screen: persistent/collapsible left sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchChatQuery, setSearchChatQuery] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bisync_chat_sessions");
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load local chat sessions", e);
    }
  }, []);

  // Save active chat messages into current session
  useEffect(() => {
    if (messages.length === 0) return;

    setSessions((prev) => {
      const currentId = activeSessionId || `session-${Date.now()}`;
      if (!activeSessionId) {
        setActiveSessionId(currentId);
      }

      const firstUserMsg = messages.find((m) => m.sender === "user");
      const title = firstUserMsg
        ? firstUserMsg.text.slice(0, 32) + (firstUserMsg.text.length > 32 ? "…" : "")
        : "New Conversation";

      const existingIndex = prev.findIndex((s) => s.id === currentId);
      let updated: ChatSession[];

      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          messages,
          title: updated[existingIndex].title || title,
        };
      } else {
        updated = [
          {
            id: currentId,
            title,
            createdAt: new Date().toLocaleDateString(),
            messages,
          },
          ...prev,
        ];
      }

      try {
        localStorage.setItem("bisync_chat_sessions", JSON.stringify(updated.slice(0, 25)));
      } catch (err) {
        console.warn(err);
      }
      return updated;
    });
  }, [messages, activeSessionId]);

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

  const handleNewChat = () => {
    setMessages([]);
    setInputQuery("");
    setActiveSessionId(null);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleSelectSession = (sess: ChatSession) => {
    setActiveSessionId(sess.id);
    setMessages(sess.messages || []);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
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

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchChatQuery.toLowerCase())
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          PERSISTENT SOVEREIGN LEFT SIDEBAR (~260-280px wide)
          Filled #0A192F, containing "New Chat", "Search Chat", & history list
          ───────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0A192F] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-2xl lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 space-y-4 flex-1 flex flex-col overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="text-xl font-bold tracking-[0.25em] text-white uppercase font-sans">
                BISYNC
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Pill Button */}
          <button
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-full flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Consultation</span>
          </button>

          {/* Search Chat Input */}
          <div className="relative pt-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchChatQuery}
              onChange={(e) => setSearchChatQuery(e.target.value)}
              placeholder="Search chat history…"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-full pl-10 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Chat Sessions History List */}
          <div className="flex-1 overflow-y-auto space-y-1 pt-2 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 block mb-2">
              Recent Consultations
            </span>

            {filteredSessions.length > 0 ? (
              filteredSessions.map((sess) => (
                <button
                  key={sess.id}
                  onClick={() => handleSelectSession(sess)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs transition-colors flex items-center gap-2.5 group ${
                    activeSessionId === sess.id
                      ? "bg-blue-900/60 border border-blue-500/40 text-white font-medium shadow-sm"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400 shrink-0 group-hover:text-white" />
                  <span className="truncate flex-1">{sess.title}</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-400 px-3 py-4 text-center">
                {searchChatQuery ? "No matching chats found." : "No past consultations yet."}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>BIS Standards Intelligence</span>
          <Link href="/explore" className="hover:text-white underline">
            Catalog
          </Link>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          MAIN CHAT PANEL: CLEAN EXECUTIVE SOVEREIGN AI CANVAS
          ───────────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col justify-between h-screen overflow-y-auto relative"
        style={{
          background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 50%, #F1F5F9 100%)",
        }}
      >
        {/* ─────────────────────────────────────────────────────────────
            TOP STREAMLINED HEADER
            ───────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 w-full px-6 sm:px-10 py-4 flex items-center justify-between z-20 backdrop-blur-md bg-white/70 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-slate-200/60 text-[#0A192F] transition-colors"
              title="Toggle Sidebar"
            >
              <PanelLeft className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Back Play Triangle pointing to Home */}
            <Link
              href="/"
              className="group p-2 rounded-full hover:bg-slate-200/60 transition-colors flex items-center justify-center"
              title="Back to Home"
            >
              <svg
                className="w-5 h-5 text-[#0A192F] fill-current group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <polygon points="18,4 6,12 18,20" />
              </svg>
            </Link>
          </div>

          {/* Top-Right Pill Button */}
          <div className="bg-[#0A192F] text-white px-5 py-2 rounded-full font-bold text-xs tracking-wide shadow-sm flex items-center gap-2 select-none border border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>BIS Standards Copilot</span>
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────────
            MAIN CONTENT AREA
            ───────────────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 max-w-4xl mx-auto w-full z-10 py-6">
          {!hasMessages ? (
            /* ─────────────────────────────────────────────────────────────
               SCREEN 3 — AI ASSISTANT EMPTY STATE
               ───────────────────────────────────────────────────────────── */
            <div className="text-center space-y-8 my-auto">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold shadow-2xs">
                  <span>Bureau of Indian Standards Smart Digital Expert</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A192F] tracking-tight font-sans">
                  How can the Standards Copilot assist you?
                </h1>
                <p className="text-slate-600 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
                  Ask about mandatory Indian Standards, mechanical/chemical test tolerances, Quality Control Orders, or STI lab requirements.
                </p>
              </div>

              {/* Clean executive input card */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative max-w-2xl mx-auto"
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-300 text-left min-h-[140px] flex flex-col justify-between transition-all focus-within:ring-2 focus-within:ring-blue-600/40 focus-within:border-blue-600">
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
                    placeholder="Ask about a product, standard, certification or compliance requirement…"
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-medium text-sm sm:text-base focus:outline-none resize-none"
                  />

                  {/* Circular #0A192F send button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || !inputQuery.trim()}
                      className="bg-[#0A192F] hover:bg-blue-900 text-white p-3 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <ArrowUp className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Popular Queries */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs sm:text-sm">
                <span className="font-semibold text-slate-500">Popular Inquiries:</span>
                {popularQueries.map((pq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(pq.q)}
                    className="border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium px-4 py-1.5 rounded-full transition-all hover:scale-105 shadow-2xs hover:text-blue-700"
                  >
                    {pq.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               SCREEN 4 — AI ASSISTANT ACTIVE CONVERSATION
               User message: Right-aligned rounded gray pill
               AI response: Plain left-aligned dark text directly on gradient (no bubble)
               ───────────────────────────────────────────────────────────── */
            <div className="space-y-8 pb-32 pt-4">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  {msg.sender === "user" ? (
                    /* User Bubble: Right-aligned rounded gray pill */
                    <div className="flex justify-end">
                      <div className="bg-[#F4F4F4] text-neutral-900 text-sm sm:text-base font-normal px-6 py-3.5 rounded-3xl max-w-xl shadow-xs border border-neutral-200/50 leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    /* AI Response: Plain left-aligned text directly on gradient */
                    <div className="text-neutral-900 text-sm sm:text-base leading-relaxed space-y-4 max-w-3xl pr-4">
                      <MarkdownRenderer content={msg.text} />

                      {/* Citations Snippets */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-3 border-t border-slate-200 space-y-2">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                            Verified BIS Standard Clauses:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {msg.citations.map((c, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedCitation(c)}
                                className="px-3 py-1 rounded-lg bg-blue-50/80 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                              >
                                <FileText className="w-3 h-3 text-blue-600" />
                                <span className="font-mono">{c.standardCode} {c.clauseNumber}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Bar (Copy, Voice, Feedback) */}
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="hover:text-slate-900 flex items-center gap-1 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                          </button>

                          <button
                            onClick={() => (isSpeaking ? stopSpeaking() : speakText(msg.text))}
                            className="hover:text-slate-900 flex items-center gap-1 transition-colors"
                          >
                            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                            <span>{isSpeaking ? "Stop Voice" : "Listen"}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFeedback(msg.id, "up", msg.text)}
                            className={`p-1 rounded hover:bg-slate-200 ${
                              feedbackGiven[msg.id] === "up" ? "text-emerald-700 font-bold" : "text-slate-400"
                            }`}
                            title="Accurate"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, "down", msg.text)}
                            className={`p-1 rounded hover:bg-slate-200 ${
                              feedbackGiven[msg.id] === "down" ? "text-red-600 font-bold" : "text-slate-400"
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
                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium py-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Consulting Bureau of Indian Standards Intelligence Engine…</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* ─────────────────────────────────────────────────────────────
            PINNED BOTTOM INPUT BAR (when in active conversation)
            ───────────────────────────────────────────────────────────── */}
        {hasMessages && (
          <div className="fixed bottom-6 left-0 right-0 z-30 px-4 pointer-events-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-300 p-2 pl-6 flex items-center justify-between gap-3 focus-within:ring-2 focus-within:ring-blue-600/40 focus-within:border-blue-600 transition-all pointer-events-auto"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about a product, standard, certification or compliance requirement…"
                disabled={isLoading}
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 font-normal text-sm sm:text-base focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="bg-[#0A192F] hover:bg-blue-900 text-white p-3 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
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
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    {selectedCitation.standardCode} • {selectedCitation.clauseNumber}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 font-sans mt-2">
                    {selectedCitation.clauseTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCitation(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed font-mono border border-slate-200">
                {selectedCitation.snippet}
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={selectedCitation.officialBisUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  <span>Verify on e-BIS Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setSelectedCitation(null)}
                  className="px-5 py-2 bg-[#0A192F] text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBFBFC] p-12 text-center text-neutral-600 text-sm font-sans flex items-center justify-center">
          Initializing BISync AI…
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
