// Dual-Engine LLM Provider Module:
// Priority 1: Google Gemini API (when GEMINI_API_KEY is configured in Vercel or .env)
// Priority 2: Local llama-server running Gemma via OpenAI-compatible endpoint (127.0.0.1:8080)
// Fallback: Returns null, enabling deterministic verified BIS standards clause generator

export interface LlmGenerationOptions {
  systemPrompt: string;
  context: string;
  userQuery: string;
  temperature?: number;
}

export async function callExternalLlm(options: LlmGenerationOptions): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const temp = options.temperature ?? 0.1;

  // 1. Google Gemini API Route (Cloud / Vercel Production Mode)
  if (geminiKey && geminiKey.trim()) {
    try {
      const geminiModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey.trim()}`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${options.systemPrompt}\n\n=== RETRIEVED BIS STANDARDS CONTEXT ===\n${options.context}\n\n=== RULES ===\n1. Answer strictly using ONLY the retrieved BIS standards context.\n2. Do not invent information.\n3. Render Markdown tables for chemical/mechanical tolerances where present.\n\n=== USER INQUIRY ===\n${options.userQuery}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: temp,
          maxOutputTokens: 4096
        }
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return text.trim();
        }
      } else {
        const errText = await res.text();
        console.warn(`Google Gemini API error (${res.status}):`, errText);
      }
    } catch (err: any) {
      console.warn("Google Gemini API call failed:", err.message);
    }
  }

  // 2. Local llama-server Route (On-Premise / Sovereign Gemma Mode)
  const baseUrl = (process.env.LLM_BASE_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
  const modelName = process.env.LLM_MODEL || "gemma-local";

  try {
    const url = `${baseUrl}/v1/chat/completions`;
    const payload = {
      model: modelName,
      messages: [
        {
          role: "system",
          content: `${options.systemPrompt}\n\n=== RETRIEVED BIS STANDARDS CONTEXT ===\n${options.context}\n\nRULES:\n1. Answer strictly using ONLY the retrieved context above.\n2. Do not invent information.\n3. If the context does not contain the answer, say the available BIS documents do not provide enough information.`
        },
        {
          role: "user",
          content: options.userQuery
        }
      ],
      temperature: temp,
      max_tokens: 4096
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      const msg = data.choices?.[0]?.message;
      if (msg) {
        const text = msg.content || msg.reasoning_content || "";
        if (text.trim()) return text.trim();
      }
    } else {
      const errText = await res.text();
      console.warn(`Local llama-server (${modelName}) returned status ${res.status}:`, errText);
    }
  } catch (err: any) {
    // Expected when running without a local llama-server running on port 8080
  }

  return null;
}
