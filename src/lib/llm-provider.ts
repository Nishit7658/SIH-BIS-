// Local LLM Provider Module: Calls local llama-server running Gemma
// Endpoint: http://127.0.0.1:8080/v1/chat/completions
// Model: gemma-local

export interface LlmGenerationOptions {
  systemPrompt: string;
  context: string;
  userQuery: string;
  temperature?: number;
}

export async function callExternalLlm(options: LlmGenerationOptions): Promise<string | null> {
  const baseUrl = (process.env.LLM_BASE_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
  const modelName = process.env.LLM_MODEL || "gemma-local";
  const temp = options.temperature ?? 0.1;

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
    console.warn("Local Gemma model server is unavailable. Please start llama-server on port 8080:", err.message);
  }

  return null;
}

