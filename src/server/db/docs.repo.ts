import { dbStore, DatabaseSchema } from "./store";

export type DocumentRecord = DatabaseSchema["documents"][0];
export type IngestionJobRecord = DatabaseSchema["ingestionJobs"][0];

export class DocumentsRepository {
  static list(limit = 50, offset = 0): { items: DocumentRecord[]; total: number } {
    const db = dbStore.get();
    const total = db.documents.length;
    const items = db.documents.slice(offset, offset + limit);
    return { items, total };
  }

  static findById(id: string): DocumentRecord | null {
    const db = dbStore.get();
    return db.documents.find((d) => d.id === id) || null;
  }

  static create(doc: Omit<DocumentRecord, "id" | "createdAt">): DocumentRecord {
    const newDoc: DocumentRecord = {
      ...doc,
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    dbStore.update((db) => {
      db.documents.unshift(newDoc);
    });

    return newDoc;
  }

  static updateStatus(id: string, status: DocumentRecord["status"], chunksCount?: number, extractedText?: string): DocumentRecord | null {
    let updated: DocumentRecord | null = null;
    dbStore.update((db) => {
      const doc = db.documents.find((d) => d.id === id);
      if (doc) {
        doc.status = status;
        if (chunksCount !== undefined) doc.chunksCount = chunksCount;
        if (extractedText !== undefined) doc.extractedText = extractedText;
        updated = doc;
      }
    });
    return updated;
  }

  static delete(id: string): boolean {
    let deleted = false;
    dbStore.update((db) => {
      const idx = db.documents.findIndex((d) => d.id === id);
      if (idx !== -1) {
        db.documents.splice(idx, 1);
        deleted = true;
      }
    });
    return deleted;
  }
}

export class IngestionJobsRepository {
  static create(documentId: string): IngestionJobRecord {
    const newJob: IngestionJobRecord = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      documentId,
      status: "PENDING",
      stages: {
        textExtraction: false,
        chunking: false,
        embeddingGeneration: false,
        indexing: false,
      },
      chunksCreated: 0,
      startedAt: new Date().toISOString(),
    };

    dbStore.update((db) => {
      db.ingestionJobs.unshift(newJob);
    });

    return newJob;
  }

  static findById(id: string): IngestionJobRecord | null {
    const db = dbStore.get();
    return db.ingestionJobs.find((j) => j.id === id) || null;
  }

  static update(id: string, updates: Partial<Omit<IngestionJobRecord, "id" | "documentId" | "startedAt">>): IngestionJobRecord | null {
    let updated: IngestionJobRecord | null = null;
    dbStore.update((db) => {
      const job = db.ingestionJobs.find((j) => j.id === id);
      if (job) {
        Object.assign(job, updates);
        updated = job;
      }
    });
    return updated;
  }
}
