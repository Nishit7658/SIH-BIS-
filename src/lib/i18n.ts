export type SupportedLanguage = "en" | "hi" | "mr" | "ta";

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  searchPlaceholder: string;
  askExpert: string;
  exploreStandards: string;
  complianceChecker: string;
  verifyLicense: string;
  compareStandards: string;
  adminPortal: string;
  statutoryDisclaimer: string;
  recentStandards: string;
  confidenceScore: string;
  citations: string;
  mandatoryQCO: string;
  audioReadout: string;
  voiceInput: string;
  lowLiteracyMode: string;
  escalateToSme: string;
  ticketRaised: string;
  dpdpNotice: string;
  dpdpConsentTitle: string;
  dpdpAccept: string;
  dpdpPreferences: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: "BIS Smart Digital Expert",
    tagline: "AI-Powered Technical Regulatory & Conformity Assessment Assistant",
    searchPlaceholder: "Ask about any Indian Standard (e.g. IS 1293 plug testing, IS 302 leakage current, toy QCO)...",
    askExpert: "Ask Digital Expert",
    exploreStandards: "Explore Standards",
    complianceChecker: "Compliance Wizard",
    verifyLicense: "Verify ISI Mark",
    compareStandards: "Compare Standards",
    adminPortal: "Ops & Metrics",
    statutoryDisclaimer: "Informational Tool — Verify official Bureau of Indian Standards Gazettes for statutory certification.",
    recentStandards: "Featured Quality Control Orders (QCOs)",
    confidenceScore: "Grounding Confidence",
    citations: "Verified BIS Clauses",
    mandatoryQCO: "Mandatory ISI Certification",
    audioReadout: "Listen to Answer",
    voiceInput: "Speak Question",
    lowLiteracyMode: "Icon-Guided Mode",
    escalateToSme: "Escalate to BIS Technical Officer",
    ticketRaised: "Support Ticket Dispatched",
    dpdpNotice: "DPDP Act 2023 Compliant: Session data is confidential with zero long-term retention.",
    dpdpConsentTitle: "Privacy & Data Protection Consent",
    dpdpAccept: "Acknowledge & Continue",
    dpdpPreferences: "Privacy Preferences"
  },
  hi: {
    appName: "बीआईएस स्मार्ट डिजिटल विशेषज्ञ",
    tagline: "भारतीय मानक ब्यूरो (BIS) तकनीकी विनियम एवं अनुरूपता सहायक",
    searchPlaceholder: "किसी भी भारतीय मानक के बारे में पूछें (उदा. IS 1293 प्लग परीक्षण, IS 302 लीकेज करंट)...",
    askExpert: "विशेषज्ञ से पूछें",
    exploreStandards: "मानक खोजें",
    complianceChecker: "अनुपालन विज़ार्ड",
    verifyLicense: "आईएसआई मार्क सत्यापन",
    compareStandards: "मानकों की तुलना",
    adminPortal: "संचालन और मेट्रिक्स",
    statutoryDisclaimer: "सूचनात्मक उपकरण — वैधानिक प्रमाणन के लिए आधिकारिक बीआईएस राजपत्र देखें।",
    recentStandards: "प्रमुख गुणवत्ता नियंत्रण आदेश (QCOs)",
    confidenceScore: "आधारभूत विश्वसनीयता",
    citations: "सत्यापित बीआईएस खंड",
    mandatoryQCO: "अनिवार्य आईएसआई प्रमाणन",
    audioReadout: "उत्तर सुनें",
    voiceInput: "बोलकर पूछें",
    lowLiteracyMode: "चित्र-निर्देशित मोड",
    escalateToSme: "बीआईएस अधिकारी को अग्रेषित करें",
    ticketRaised: "सहायता टिकट दर्ज",
    dpdpNotice: "डीपीडीपी अधिनियम 2023 के अनुरूप: शून्य दीर्घकालिक डेटा प्रतिधारण।",
    dpdpConsentTitle: "गोपनीयता और डेटा सुरक्षा सहमति",
    dpdpAccept: "स्वीकार करें और आगे बढ़ें",
    dpdpPreferences: "गोपनीयता विकल्प"
  },
  mr: {
    appName: "बीआयएस स्मार्ट डिजिटल तज्ज्ञ",
    tagline: "भारतीय मानक ब्युरो तांत्रिक नियमन आणि अनुपालन सहाय्यक",
    searchPlaceholder: "कोणत्याही भारतीय मानकाबद्दल विचारा (उदा. IS 1293 प्लग, IS 302)...",
    askExpert: "तज्ज्ञांना विचारा",
    exploreStandards: "मानके शोधा",
    complianceChecker: "अनुपालन विझार्ड",
    verifyLicense: "आयएसआय मार्क पडताळणी",
    compareStandards: "मानकांची तुलना",
    adminPortal: "ऑप्स आणि मेट्रिक्स",
    statutoryDisclaimer: "माहितीपर साधन — अधिकृत बीआयएस राजपत्राचा संदर्भ घ्या.",
    recentStandards: "महत्त्वाचे गुणवत्ता नियंत्रण आदेश",
    confidenceScore: "विश्वासार्हता स्कोअर",
    citations: "सत्यापित बीआयएस कलमे",
    mandatoryQCO: "अनिवार्य आयएसआय प्रमाणन",
    audioReadout: "उत्तर ऐका",
    voiceInput: "बोलून विचारा",
    lowLiteracyMode: "चित्र-मार्गदर्शित मोड",
    escalateToSme: "अधिकाऱ्याकडे वर्ग करा",
    ticketRaised: "मदत तिकीट तयार",
    dpdpNotice: "डीपीडीपी कायदा २०२३ नुसार डेटा सुरक्षित.",
    dpdpConsentTitle: "डेटा गोपनीयता संमती",
    dpdpAccept: "स्वीकारा आणि पुढे जा",
    dpdpPreferences: "गोपनीयता सेटिंग्ज"
  },
  ta: {
    appName: "பிஐஎஸ் ஸ்மார்ட் டிஜிட்டல் நிபுணர்",
    tagline: "இந்திய தர நிர்ணய பணியகம் (BIS) தொழில்நுட்ப ஒழுங்குமுறை உதவியாளர்",
    searchPlaceholder: "இந்திய தரநிலைகள் பற்றி கேட்கவும் (எ.கா. IS 1293, IS 302)...",
    askExpert: "நிபுணரிடம் கேளுங்கள்",
    exploreStandards: "தரநிலைகளை ஆராயுங்கள்",
    complianceChecker: "இணக்க வழிகாட்டி",
    verifyLicense: "ஐஎஸ்ஐ முத்திரை சரிபார்ப்பு",
    compareStandards: "தரநிலைகளை ஒப்பிடுக",
    adminPortal: "நிர்வாகம் & அளவீடுகள்",
    statutoryDisclaimer: "தகவல் கருவி — சட்டப்பூர்வ சான்றிதழுக்கு அதிகாரப்பூர்வ பிஐஎஸ் இதழைப் பார்க்கவும்.",
    recentStandards: "முக்கிய தரக் கட்டுப்பாட்டு ஆணைகள் (QCO)",
    confidenceScore: "நம்பகத்தன்மை",
    citations: "சரிபார்க்கப்பட்ட பிஐஎஸ் உட்பிரிவுகள்",
    mandatoryQCO: "கட்டாய ஐஎஸ்ஐ சான்றிதழ்",
    audioReadout: "பதிலை கேளுங்கள்",
    voiceInput: "பேசி கேளுங்கள்",
    lowLiteracyMode: "பட வழிகாட்டி பயன்முறை",
    escalateToSme: "பிஐஎஸ் அதிகாரிக்கு அனுப்பவும்",
    ticketRaised: "டிக்கெட் உருவாக்கப்பட்டது",
    dpdpNotice: "டிபிடிபி சட்டம் 2023 இணக்கமானது.",
    dpdpConsentTitle: "தரவு தனியுரிமை ஒப்புதல்",
    dpdpAccept: "ஏற்றுக்கொண்டு தொடரவும்",
    dpdpPreferences: "தனியுரிமை அமைப்புகள்"
  }
};
