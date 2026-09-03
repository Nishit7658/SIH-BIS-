import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "bis_store.json");

export interface DatabaseSchema {
  users: Array<{
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: "user" | "officer" | "admin";
    organization?: string;
    industrySector?: string;
    preferences: {
      dataRetentionDays: number;
      language: string;
      lowLiteracyMode: boolean;
    };
    createdAt: string;
    updatedAt: string;
  }>;
  documents: Array<{
    id: string;
    title: string;
    originalFilename: string;
    storedFilename: string;
    fileSize: number;
    mimeType: string;
    extractedText?: string;
    status: "UPLOADED" | "PARSED" | "INDEXED" | "FAILED";
    chunksCount: number;
    metadata: Record<string, any>;
    createdAt: string;
  }>;
  ingestionJobs: Array<{
    id: string;
    documentId: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    stages: {
      textExtraction: boolean;
      chunking: boolean;
      embeddingGeneration: boolean;
      indexing: boolean;
    };
    chunksCreated: number;
    errorMessage?: string;
    startedAt: string;
    completedAt?: string;
  }>;
  chatSessions: Array<{
    id: string;
    userId?: string;
    title: string;
    messages: Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      citations?: any[];
      timestamp: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  auditTickets: Array<{
    id: string;
    query: string;
    userContext: string;
    priority: "HIGH" | "MEDIUM" | "CRITICAL";
    status: "OPEN" | "RESOLVED" | "IN_REVIEW";
    assignedOfficer: string;
    createdAt: string;
  }>;
}

const defaultSchema: DatabaseSchema = {
  users: [],
  documents: [],
  ingestionJobs: [],
  chatSessions: [],
  auditTickets: []
};

let memoryStore: DatabaseSchema = { ...defaultSchema };
let isInitialized = false;

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Ignore in non-filesystem environments
  }
}

function loadStore(): DatabaseSchema {
  if (isInitialized) return memoryStore;

  ensureDataDir();
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      memoryStore = { ...defaultSchema, ...JSON.parse(raw) };
    } else {
      memoryStore = { ...defaultSchema };
      saveStore(memoryStore);
    }
  } catch {
    memoryStore = { ...defaultSchema };
  }

  isInitialized = true;
  return memoryStore;
}

function saveStore(data: DatabaseSchema): void {
  memoryStore = data;
  ensureDataDir();
  try {
    const tempPath = `${STORE_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, STORE_PATH);
  } catch (err) {
    // Memory store remains consistent
  }
}

export const dbStore = {
  get: (): DatabaseSchema => loadStore(),
  update: (updater: (db: DatabaseSchema) => void): DatabaseSchema => {
    const store = loadStore();
    updater(store);
    saveStore(store);
    return store;
  },
};
