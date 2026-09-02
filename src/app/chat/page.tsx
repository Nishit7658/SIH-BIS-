"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Citation, RagResult } from "@/lib/rag-engine";
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Zap,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Share2,
  Copy,
  ExternalLink,
  ChevronRight,
  Headphones
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
      text: "Namaste! I am your **BIS Smart Digital Expert**.\n\nAsk me any question regarding Indian Standards (IS), mandatory Quality Control Orders (QCOs), test parameters, or certification schemes (ISI Mark vs CRS). Every response is strictly grounded in official BIS clauses.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [escalatingId, setEscalatingId] = useState<string | null>(null);
  const [escalatedTickets, setEscalatedTickets] = useState<Record<string, string>>({});
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle URL query parameter
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
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "An error occurred while connecting to the standards repository. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Speech Recognition
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendMessage(transcript);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  // Escalate to BIS Technical Desk
  const handleEscalate = async (messageId: string, queryText: string) => {
    setEscalatingId(messageId);
    try {
      const res = await fetch("/api/ops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, userContext: "Escalated from Digital Expert Chat" }),
      });
      const data = await res.json();
      if (data.success) {
        setEscalatedTickets((prev) => ({
          ...prev,
          [messageId]: data.ticket.id,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEscalatingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header bar with Telemetry & DPDP status */}
      <div className="flex items-center justify-between pb-3 border-b border-bis-border text-xs text-bis-text-secondary mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-bis-navy">RAG Engine: Active (Strict Grounding)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1 text-[11px] bg-bis-canvas px-2.5 py-1 rounded-md border border-bis-border">
            <ShieldCheck className="w-3.5 h-3.5 text-bis-blue" />
            DPDP Ephemeral Session
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} animate-in fade-in`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-4 sm:p-5 shadow-sm text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-bis-navy text-white rounded-br-none"
                  : "bg-white text-bis-text-primary border border-bis-border rounded-bl-none"
              }`}
            >
              {/* Bot Meta Header */}
              {msg.sender === "bot" && (
                <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-bis-border/60 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-bis-navy">
                    <Sparkles className="w-3.5 h-3.5 text-bis-saffron" />
                    <span>BIS Digital Expert</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {msg.confidence !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          msg.confidence >= 0.8
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {Math.round(msg.confidence * 100)}% Grounded
                      </span>
                    )}
                    {msg.cached && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-bis-blue text-[10px] font-bold border border-blue-200 flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5 text-amber-500" />
                        Cached
                      </span>
                    )}
                    <button
                      onClick={() => window.print()}
                      className="p-1 rounded hover:bg-slate-100 text-bis-text-secondary"
                      title="Download / Print full chat response as PDF"
                    >
                      <FileText className="w-3.5 h-3.5 text-bis-navy" />
                    </button>
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1 rounded hover:bg-slate-100 text-bis-text-secondary"
                      title={t.audioReadout}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Message Body (Markdown formatted) */}
              <div className="whitespace-pre-line prose prose-sm max-w-none">
                {msg.text}
              </div>

              {/* Verified Citations List */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-bis-border space-y-2">
                  <p className="text-xs font-bold text-bis-navy flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-bis-blue" />
                      {t.citations} ({msg.citations.length})
                    </span>
                    <a
                      href="https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-bis-blue hover:underline flex items-center gap-1"
                    >
                      <span>Official e-BIS Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((cite, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCitation(cite)}
                        className="text-left px-2.5 py-1.5 rounded-lg bg-bis-blue-soft/60 hover:bg-bis-blue-soft text-bis-navy border border-bis-blue/20 text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <span className="font-mono font-bold text-bis-blue">{cite.standardCode}</span>
                        <span className="text-slate-600 font-semibold">{cite.clauseNumber}</span>
                        <ChevronRight className="w-3 h-3 text-bis-blue ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Rating Widget (Handbook Part 5.3 & Part 20) */}
              {msg.sender === "bot" && (
                <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-bis-border/50">
                  <span>Was this citation helpful?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={async () => {
                        await fetch("/api/feedback", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            query: msg.text.substring(0, 100),
                            answerSnippet: msg.text.substring(0, 200),
                            rating: "helpful"
                          })
                        });
                        alert("Thank you! Feedback recorded for evaluation harness.");
                      }}
                      className="px-2 py-0.5 rounded bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors font-medium"
                    >
                      👍 Helpful
                    </button>
                    <button
                      onClick={async () => {
                        await fetch("/api/feedback", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            query: msg.text.substring(0, 100),
                            answerSnippet: msg.text.substring(0, 200),
                            rating: "flag_inaccuracy",
                            comments: "Flagged by user in chat interface"
                          })
                        });
                        alert("Flagged for content ops review. Thank you!");
                      }}
                      className="px-2 py-0.5 rounded bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 transition-colors font-medium"
                    >
                      👎 Flag Inaccuracy
                    </button>
                  </div>
                </div>
              )}

              {/* Abstain Alert & Escalation Action */}
              {msg.isAbstained && msg.sender === "bot" && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Regulatory Abstention Triggered</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This answer cannot be verified with 100% clause certainty in the current standards catalog.
                  </p>
                  {escalatedTickets[msg.id] ? (
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 font-bold flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t.ticketRaised}: Ticket #{escalatedTickets[msg.id]}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEscalate(msg.id, msg.text)}
                      disabled={escalatingId === msg.id}
                      className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      {escalatingId === msg.id ? "Dispatching..." : t.escalateToSme}
                    </button>
                  )}
                </div>
              )}

              {/* Timestamp & Meta Footer */}
              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{msg.timestamp}</span>
                {msg.latencyMs && <span>Latency: {msg.latencyMs}ms</span>}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-white border border-bis-border max-w-sm animate-pulse text-xs text-bis-navy font-semibold">
            <Sparkles className="w-4 h-4 text-bis-saffron animate-spin" />
            Analyzing official BIS standards & clauses...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Starters */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 py-3">
          {[
            "What is the maximum voltage under IS 1293:2019?",
            "What are the leakage current limits in IS 302-1?",
            "Explain mandatory spark testing under IS 694",
            "What are the recycling symbol codes in IS 14534?"
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-bis-canvas text-bis-navy border border-bis-border transition-colors font-medium shadow-xs text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="pt-3 border-t border-bis-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about clauses, testing rules, or ISI mark requirements..."
              className="w-full pl-4 pr-12 py-3 bg-white border border-bis-border rounded-xl text-sm text-bis-text-primary focus:outline-none focus:ring-2 focus:ring-bis-blue/30 shadow-sm"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                isRecording
                  ? "bg-red-500 text-white animate-bounce"
                  : "text-bis-text-muted hover:text-bis-blue"
              }`}
              title="Voice Input (Speak your question)"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-5 py-3 bg-bis-navy hover:bg-bis-navy-light disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-4 h-4 text-bis-saffron" />
          </button>
        </form>
      </div>

      {/* Citation Detail Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-bis-border max-w-xl w-full p-6 text-bis-text-primary space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded bg-bis-blue-soft text-bis-blue font-mono font-bold text-xs">
                  {selectedCitation.standardCode}
                </span>
                <h3 className="font-bold text-base text-bis-navy mt-1">
                  {selectedCitation.clauseNumber}: {selectedCitation.clauseTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-bis-canvas border border-bis-border text-sm leading-relaxed">
              <p className="font-semibold text-xs text-bis-text-secondary uppercase mb-1">Standard Clause Content</p>
              <p className="text-bis-navy font-medium">{selectedCitation.snippet}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/standard/${selectedCitation.standardId}`}
                className="text-xs font-bold text-bis-blue hover:underline flex items-center gap-1"
              >
                Open Full Standard Document <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setSelectedCitation(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
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
    <Suspense fallback={<div className="p-12 text-center text-bis-navy font-bold">Loading BIS Expert Chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
