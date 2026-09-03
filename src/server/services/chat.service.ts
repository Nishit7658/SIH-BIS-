import { ChatRepository, ChatSessionRecord, ChatMessage } from "../db/chat.repo";
import { executeRagQuery, RagResult } from "@/lib/rag-engine";
import { evaluatePromptGuardrail } from "@/lib/guardrails";
import { NotFoundError } from "../utils/errors";

export interface ProcessChatInput {
  query: string;
  sessionId?: string;
  userId?: string;
}

export class ChatService {
  static listSessions(userId?: string): ChatSessionRecord[] {
    return ChatRepository.listSessions(userId);
  }

  static getSession(sessionId: string): ChatSessionRecord {
    const session = ChatRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundError(`Chat session '${sessionId}'`);
    }
    return session;
  }

  static deleteSession(sessionId: string): boolean {
    const session = this.getSession(sessionId);
    return ChatRepository.deleteSession(session.id);
  }

  static async processMessage(input: ProcessChatInput): Promise<{
    session: ChatSessionRecord;
    response: RagResult;
  }> {
    const { query, sessionId, userId } = input;

    // 1. Resolve or create chat session
    let session = sessionId ? ChatRepository.findSessionById(sessionId) : null;
    if (!session) {
      const autoTitle = query.length > 40 ? `${query.substring(0, 37)}...` : query;
      session = ChatRepository.createSession(autoTitle, userId);
    }

    // 2. Persist user message
    ChatRepository.addMessage(session.id, {
      role: "user",
      content: query,
    });

    // 3. Security Guardrail Check
    const guardResult = evaluatePromptGuardrail(query);
    let ragResult: RagResult;

    if (!guardResult.passed) {
      ragResult = {
        query,
        answer: `⚠️ **Security & Regulatory Guardrail Interception**: ${guardResult.blockedReason}`,
        citations: [],
        confidence: 0.0,
        isAbstained: true,
        abstainReason: "ADVERSARIAL_INPUT_DETECTED",
        cached: false,
        costTier: "cached",
        latencyMs: 12,
        relevantStandards: [],
        isAdversarial: true,
      };
    } else {
      // 4. Grounded RAG Query
      ragResult = await executeRagQuery(guardResult.sanitizedInput);
    }

    // 5. Persist assistant response
    ChatRepository.addMessage(session.id, {
      role: "assistant",
      content: ragResult.answer,
      citations: ragResult.citations,
    });

    const refreshedSession = ChatRepository.findSessionById(session.id) || session;

    return {
      session: refreshedSession,
      response: ragResult,
    };
  }
}
