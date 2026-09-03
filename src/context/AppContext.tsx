"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLanguage, TRANSLATIONS, TranslationDictionary } from "@/lib/i18n";
import { Standard } from "@/lib/standards-data";

export interface SavedReport {
  id: string;
  productName: string;
  title?: string;
  category: string;
  standardCode: string;
  standard?: string;
  score: number;
  status: "Compliant" | "Action Required" | "Non-Compliant";
  createdAt: string;
  date?: string;
  details: string;
  passedChecks?: number;
  totalChecks?: number;
}

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  lowLiteracyMode: boolean;
  setLowLiteracyMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  dpdpConsentAccepted: boolean;
  acceptDpdpConsent: () => void;
  dataRetentionDays: number;
  setDataRetentionDays: (days: number) => void;
  savedStandards: string[]; // Standard IDs
  toggleSaveStandard: (id: string) => void;
  savedReports: SavedReport[];
  saveReport: (report: SavedReport) => void;
  deleteReport: (id: string) => void;
  clearAllUserData: () => void;
  speakText: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [lowLiteracyMode, setLowLiteracyMode] = useState<boolean>(false);
  const [dpdpConsentAccepted, setDpdpConsentAccepted] = useState<boolean>(false);
  const [dataRetentionDays, setDataRetentionDays] = useState<number>(30);
  const [savedStandards, setSavedStandards] = useState<string[]>(["is-1293-2019", "is-302-1-2008"]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("bis_app_lang") as SupportedLanguage;
      if (savedLang && TRANSLATIONS[savedLang]) setLanguage(savedLang);

      const consent = localStorage.getItem("bis_dpdp_consent");
      if (consent === "true") setDpdpConsentAccepted(true);

      const lowLit = localStorage.getItem("bis_low_literacy");
      if (lowLit === "true") setLowLiteracyMode(true);

      const savedStds = localStorage.getItem("bis_saved_standards");
      if (savedStds) setSavedStandards(JSON.parse(savedStds));

      const savedReps = localStorage.getItem("bis_saved_reports");
      if (savedReps) setSavedReports(JSON.parse(savedReps));
    } catch (e) {
      console.warn("Local storage access exception:", e);
    }
  }, []);

  const handleSetLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    try {
      localStorage.setItem("bis_app_lang", lang);
    } catch (e) {}
  };

  const handleSetLowLiteracyMode = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === "function" ? val(lowLiteracyMode) : val;
    setLowLiteracyMode(nextVal);
    try {
      localStorage.setItem("bis_low_literacy", nextVal ? "true" : "false");
    } catch (e) {}
  };

  const acceptDpdpConsent = () => {
    setDpdpConsentAccepted(true);
    try {
      localStorage.setItem("bis_dpdp_consent", "true");
    } catch (e) {}
  };

  const toggleSaveStandard = (id: string) => {
    setSavedStandards(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem("bis_saved_standards", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const saveReport = (report: SavedReport) => {
    setSavedReports(prev => {
      const next = [report, ...prev];
      try {
        localStorage.setItem("bis_saved_reports", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const deleteReport = (id: string) => {
    setSavedReports(prev => {
      const next = prev.filter(r => r.id !== id);
      try {
        localStorage.setItem("bis_saved_reports", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const clearAllUserData = () => {
    setSavedStandards([]);
    setSavedReports([]);
    try {
      localStorage.removeItem("bis_saved_standards");
      localStorage.removeItem("bis_saved_reports");
    } catch (e) {}
  };

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#>`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (language === "hi") utterance.lang = "hi-IN";
    else if (language === "ta") utterance.lang = "ta-IN";
    else utterance.lang = "en-IN";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        lowLiteracyMode,
        setLowLiteracyMode: handleSetLowLiteracyMode,
        dpdpConsentAccepted,
        acceptDpdpConsent,
        dataRetentionDays,
        setDataRetentionDays,
        savedStandards,
        toggleSaveStandard,
        savedReports,
        saveReport,
        deleteReport,
        clearAllUserData,
        speakText,
        isSpeaking,
        stopSpeaking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
