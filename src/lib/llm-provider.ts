// LLM Provider Module: Supports Gemini, OpenAI, Groq, or Local Fallback
// You can reuse ANY existing API key from your other projects!

export interface LlmGenerationOptions {
  systemPrompt: string;
  context: string;
  userQuery: string;
  temperature?: number;
}

export async function callExternalLlm(options: LlmGenerationOptions): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const temp = options.temperature ?? 0.2; // Low temperature for factual compliance

  // 1. If Gemini API Key exists (from any Google Cloud / AI Studio project)
  if (geminiKey) {
    const geminiModels = [
      "gemini-3.6-flash",
      "gemini-flash-latest",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-3.1-pro-preview",
      "gemini-pro-latest"
    ];
    for (const modelName of geminiModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
        const payload = {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${options.systemPrompt}\n\n=== AUTHORITATIVE RETRIEVED BIS EVIDENCE & FACT SHEET ===\n${options.context}\n\n=== USER QUESTION / INQUIRY ===\n${options.userQuery}\n\n=== INSTRUCTION ===\nProvide an in-depth, comprehensive, well-structured response based on the above evidence. Include all relevant technical numbers, machine names, test tolerances, standards codes, and step-by-step procedures.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: temp,
            maxOutputTokens: 4000
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
          if (text) return text.trim();
        } else {
          const errText = await res.text();
          console.warn(`Gemini (${modelName}) returned non-200, trying fallback:`, errText);
        }
      } catch (err) {
        console.error(`Gemini (${modelName}) call failed:`, err);
      }
    }
  }

  // 2. If OpenAI Key exists (from any OpenAI project)
  if (openAiKey) {
    try {
      const url = "https://api.openai.com/v1/chat/completions";
      const payload = {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `${options.systemPrompt}\n\n=== RETRIEVED BIS CONTEXT ===\n${options.context}` },
          { role: "user", content: options.userQuery }
        ],
        temperature: temp
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text.trim();
      }
    } catch (err) {
      console.error("OpenAI API call failed:", err);
    }
  }

  // 3. If Groq Key exists
  if (groqKey) {
    try {
      const url = "https://api.groq.com/openai/v1/chat/completions";
      const payload = {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: `${options.systemPrompt}\n\n=== RETRIEVED BIS CONTEXT ===\n${options.context}` },
          { role: "user", content: options.userQuery }
        ],
        temperature: temp
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text.trim();
      }
    } catch (err) {
      console.error("Groq API call failed:", err);
    }
  }

  // If no external API key is set, returns null so the local deterministic synthesizer is used
  return null;
}
