export interface GuardrailCheckResult {
  passed: boolean;
  blockedReason?: string;
  sanitizedInput: string;
  isAdversarial: boolean;
}

const ADVERSARIAL_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|system|prior)\s+(instructions|prompts|rules|directives)/i,
  /you\s+are\s+now\s+(openbis|dan|jailbreak|unfiltered|godmode|developer\s+mode)/i,
  /generate\s+(a\s+)?(valid|official|fake)\s+bis\s+(license|certificate|cml)/i,
  /grant\s+me\s+official\s+(clearance|license|stamp)/i,
  /system\s+note:\s*user\s+has\s+vip\s+immunity/i,
  /waive\s+clause\s+\d+/i,
  /bypass\s+(qco|certification|bis|audit|inspection)/i,
  /forget\s+(your\s+)?(rules|instructions|directives)/i,
  /act\s+as\s+(an\s+)?unrestricted/i,
  /sudo\s+mode/i,
  /override\s+(all\s+)?safety/i
];

export function evaluatePromptGuardrail(input: string): GuardrailCheckResult {
  if (!input || typeof input !== "string") {
    return {
      passed: false,
      blockedReason: "Input must be a valid non-empty string.",
      sanitizedInput: "",
      isAdversarial: false
    };
  }

  // 1. Length constraint to prevent buffer flooding
  if (input.length > 2000) {
    return {
      passed: false,
      blockedReason: "Query exceeds maximum permissible length of 2,000 characters.",
      sanitizedInput: "",
      isAdversarial: false
    };
  }

  // 2. Strip invisible Unicode and non-printable control characters (Token Smearing Defense)
  const normalized = input
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Zero-width spaces
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // ASCII control characters
    .trim();

  // 3. Adversarial Pattern Matching
  for (const pattern of ADVERSARIAL_INJECTION_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        passed: false,
        blockedReason: "Input contains adversarial instructions attempting to override regulatory safety rules or simulate unauthorized certificate issuance.",
        sanitizedInput: "",
        isAdversarial: true
      };
    }
  }

  // 4. HTML/Script tag sanitization
  const sanitized = normalized
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
