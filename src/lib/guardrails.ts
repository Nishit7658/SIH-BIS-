export interface GuardrailCheckResult {
  passed: boolean;
  blockedReason?: string;
  sanitizedInput: string;
  isAdversarial: boolean;
}

const ADVERSARIAL_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|system)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(openbis|dan|jailbreak|unfiltered)/i,
  /generate\s+(a\s+)?(valid|official)\s+bis\s+license\s+certificate/i,
  /grant\s+me\s+official\s+clearance/i,
  /system\s+note:\s*user\s+has\s+vip\s+immunity/i,
  /waive\s+clause\s+\d+/i,
  /bypass\s+(qco|certification|bis)/i,
];

export function evaluatePromptGuardrail(input: string): GuardrailCheckResult {
  const trimmed = input.trim();

  for (const pattern of ADVERSARIAL_INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        passed: false,
        blockedReason: "Input contains adversarial instructions attempting to override regulatory safety rules or simulate unauthorized certificate issuance.",
        sanitizedInput: "",
        isAdversarial: true
      };
    }
  }

  // Basic HTML/Script tag sanitization
  const sanitized = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "");

  return {
    passed: true,
    sanitizedInput: sanitized,
    isAdversarial: false
  };
}

export const STATUTORY_LEGAL_DISCLAIMER = {
  text: "BIS Smart Digital Expert is an AI-assisted informational tool developed for research, reference, and pre-compliance guidance. It is not an official statutory body of the Bureau of Indian Standards. For legal certifications, formal Quality Control Order (QCO) gazettes, or statutory license applications, please consult the official portal (manakonline.in) and relevant government gazette notifications.",
  shortNotice: "Informational AI Guidance • Refer to official BIS Gazette for legal certification",
  dpdpConsentNotice: "Compliant with India's Digital Personal Data Protection (DPDP) Act 2023. User queries are processed solely for standard lookup. Zero long-term PII retention enabled by default."
};
