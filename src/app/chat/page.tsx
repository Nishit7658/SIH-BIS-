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
          INFERRED SCREEN: SOLID PURPLE LEFT SIDEBAR (~260-280px wide)
          Filled #300060, containing "New Chat", "Search Chat", & history list
          ───────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#300060] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-purple-900/50 shadow-2xl lg:static lg:translate-x-0 ${
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
              className="lg:hidden p-1.5 text-purple-300 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Pill Button */}
          <button
            onClick={handleNewChat}
            className="w-full bg-white text-[#300060] hover:bg-neutral-100 font-bold px-5 py-3 rounded-full flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Chat</span>
          </button>

          {/* Search Chat Input */}
          <div className="relative pt-1">
            <Search className="w-4 h-4 text-purple-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchChatQuery}
              onChange={(e) => setSearchChatQuery(e.target.value)}
              placeholder="Search chats…"
              className="w-full bg-purple-950/70 border border-purple-800/60 rounded-full pl-10 pr-3 py-2 text-xs text-white placeholder-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
          </div>

          {/* Chat Sessions History List */}
          <div className="flex-1 overflow-y-auto space-y-1 pt-2 pr-1 scrollbar-thin scrollbar-thumb-purple-800">
            <span className="text-[11px] font-semibold tracking-wider text-purple-300/80 uppercase px-3 block mb-2">
              Recent Conversations
            </span>

            {filteredSessions.length > 0 ? (
              filteredSessions.map((sess) => (
                <button
                  key={sess.id}
                  onClick={() => handleSelectSession(sess)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs transition-colors flex items-center gap-2.5 group ${
                    activeSessionId === sess.id
                      ? "bg-[#5D00B7] text-white font-medium shadow-sm"
                      : "text-purple-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-300 shrink-0 group-hover:text-white" />
                  <span className="truncate flex-1">{sess.title}</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-purple-300/60 px-3 py-4 text-center">
                {searchChatQuery ? "No matching chats found." : "No past conversations yet."}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-4 border-t border-purple-900/40 text-xs text-purple-300/80 flex items-center justify-between">
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
          MAIN CHAT PANEL: SIGNATURE GRADIENT BACKGROUND
          White (#FFFFFF) corner fading into vivid purple-magenta (#B14FE0–#CA83E6)
          ───────────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col justify-between h-screen overflow-y-auto relative"
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #F5ECFA 30%, #D490F0 75%, #B14FE0 100%)",
        }}
      >
        {/* ─────────────────────────────────────────────────────────────
            TOP STREAMLINED HEADER
            Left: Triangle back icon + Sidebar toggle
            Right: Gradient pill button (#6A00C4 → #300060) "BISync AI"
            ───────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 w-full px-6 sm:px-10 py-5 flex items-center justify-between z-20 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-white/40 text-[#300060] transition-colors"
              title="Toggle Sidebar"
            >
              <PanelLeft className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Back Play Triangle pointing to Home */}
            <Link
              href="/"
              className="group p-2 rounded-full hover:bg-white/40 transition-colors flex items-center justify-center"
              title="Back to Home"
            >
              <svg
                className="w-5 h-5 text-[#300060] fill-current group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <polygon points="18,4 6,12 18,20" />
              </svg>
            </Link>
          </div>

          {/* Top-Right Pill Button: Gradient fill #6A00C4 → #300060 */}
          <div
            className="text-white px-7 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-md select-none"
            style={{ background: "linear-gradient(to right, #6A00C4, #300060)" }}
          >
            BISync AI
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────────
            MAIN CONTENT AREA
            Screen 3: Initial Empty State
            Screen 4: Active Chat Thread
            ───────────────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 max-w-4xl mx-auto w-full z-10 py-6">
          {!hasMessages ? (
            /* ─────────────────────────────────────────────────────────────
               SCREEN 3 — AI ASSISTANT EMPTY STATE
               Centered large serif black heading + Frosted purple input + Popular Queries
               ───────────────────────────────────────────────────────────── */
            <div className="text-center space-y-8 my-auto">
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-neutral-900 tracking-tight">
                  how can we help you today?
                </h1>
                <p className="text-neutral-700 text-sm sm:text-base font-normal">
                  Ask about a product, standard, certification or compliance requirement…
                </p>
              </div>

              {/* Large rounded, semi-translucent purple-tinted chat input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative max-w-2xl mx-auto"
              >
                <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/70 text-left min-h-[140px] flex flex-col justify-between transition-all focus-within:ring-2 focus-within:ring-[#5D00B7]/40">
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
                    className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-600 placeholder:font-normal font-medium text-sm sm:text-base focus:outline-none resize-none"
                  />

                  {/* Circular #300060 send button anchored to right edge */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || !inputQuery.trim()}
                      className="bg-[#300060] hover:bg-[#4a008f] text-white p-3 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <ArrowUp className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Popular Queries: 3 outlined/translucent pill buttons */}
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
                        <div className="pt-3 border-t border-purple-300/40 space-y-2">
                          <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                            Verified BIS Standard Clauses:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {msg.citations.map((c, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedCitation(c)}
                                className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-purple-200 text-[#300060] text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                              >
                                <FileText className="w-3 h-3 text-[#5D00B7]" />
                                <span>{c.standardCode} {c.clauseNumber}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Bar (Copy, Voice, Feedback) */}
                      <div className="pt-2 flex items-center justify-between text-xs text-neutral-600">
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
                              feedbackGiven[msg.id] === "up" ? "text-emerald-700 font-bold" : "text-neutral-500"
                            }`}
                            title="Accurate"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, "down", msg.text)}
                            className={`p-1 rounded hover:bg-white/60 ${
                              feedbackGiven[msg.id] === "down" ? "text-red-600 font-bold" : "text-neutral-500"
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
                <div className="flex items-center gap-3 text-sm text-[#300060] font-medium py-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#5D00B7]" />
                  <span>Consulting Bureau of Indian Standards Intelligence Engine…</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* ─────────────────────────────────────────────────────────────
            PINNED BOTTOM INPUT BAR (when in active conversation)
            Rounded, semi-translucent bar with solid #300060 circular send button
            ───────────────────────────────────────────────────────────── */}
        {hasMessages && (
          <div className="fixed bottom-6 left-0 right-0 z-30 px-4 pointer-events-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-full shadow-2xl border border-white/70 p-2 pl-6 flex items-center justify-between gap-3 focus-within:ring-2 focus-within:ring-[#5D00B7]/40 transition-all pointer-events-auto"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about a product, standard, certification or compliance requirement…"
                disabled={isLoading}
                className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-600 font-normal text-sm sm:text-base focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="bg-[#300060] hover:bg-[#4a008f] text-white p-3 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
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
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-purple-100">
              <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
                <div>
                  <span className="font-mono font-bold text-xs text-[#5D00B7]">
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

              <div className="bg-[#F4F4F4] p-4 rounded-2xl text-xs sm:text-sm text-neutral-800 leading-relaxed font-mono border border-neutral-200">
                {selectedCitation.snippet}
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={selectedCitation.officialBisUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#5D00B7] hover:underline flex items-center gap-1"
                >
                  <span>Verify on e-BIS Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setSelectedCitation(null)}
                  className="px-5 py-2 bg-[#300060] text-white text-xs font-bold rounded-full hover:bg-[#5D00B7] transition-colors"
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
