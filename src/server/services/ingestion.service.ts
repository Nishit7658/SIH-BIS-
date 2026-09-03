import { IngestionJobsRepository, IngestionJobRecord, DocumentsRepository } from "../db/docs.repo";
import { NotFoundError, BadRequestError } from "../utils/errors";
import path from "path";
import fs from "fs";

export class IngestionService {
  static triggerIngestion(documentId: string): IngestionJobRecord {
    const doc = DocumentsRepository.findById(documentId);
    if (!doc) {
      throw new NotFoundError(`Document with ID '${documentId}'`);
    }

    if (doc.status === "INDEXED") {
      throw new BadRequestError(`Document '${doc.title}' is already indexed.`);
    }

    const job = IngestionJobsRepository.create(documentId);

    // Asynchronous background simulation without blocking the request
    setTimeout(async () => {
      try {
        IngestionJobsRepository.update(job.id, {
          status: "PROCESSING",
          stages: { textExtraction: true, chunking: false, embeddingGeneration: false, indexing: false },
        });

        // Stage 1: Text extraction
        let text = doc.extractedText || "";
        const uploadsDir = path.join(process.cwd(), ".data", "uploads");
        const filePath = path.join(uploadsDir, doc.storedFilename);

        if (!text && fs.existsSync(filePath)) {
          const rawBuffer = fs.readFileSync(filePath);
          text = rawBuffer.toString("utf-8");
        }

        // Clean & normalize text
        const cleanedText = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();

        // Stage 2: Chunking by sections/clauses
        IngestionJobsRepository.update(job.id, {
          stages: { textExtraction: true, chunking: true, embeddingGeneration: false, indexing: false },
        });

        const paragraphs = cleanedText.split(/\n\s*\n/).filter((p) => p.trim().length > 20);
        const chunkCount = Math.max(1, paragraphs.length || 5);

        // Stage 3: Embedding generation
        IngestionJobsRepository.update(job.id, {
          stages: { textExtraction: true, chunking: true, embeddingGeneration: true, indexing: false },
        });

        // Stage 4: Indexing complete
        IngestionJobsRepository.update(job.id, {
          status: "COMPLETED",
          chunksCreated: chunkCount,
          stages: { textExtraction: true, chunking: true, embeddingGeneration: true, indexing: true },
          completedAt: new Date().toISOString(),
        });

        DocumentsRepository.updateStatus(documentId, "INDEXED", chunkCount, cleanedText.substring(0, 10000));
      } catch (err: any) {
        IngestionJobsRepository.update(job.id, {
          status: "FAILED",
          errorMessage: err?.message || "Unknown error during document parsing pipeline.",
          completedAt: new Date().toISOString(),
        });
        DocumentsRepository.updateStatus(documentId, "FAILED");
      }
    }, 100);

    return job;
  }

  static getJob(jobId: string): IngestionJobRecord {
    const job = IngestionJobsRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError(`Ingestion job '${jobId}'`);
    }
    return job;
  }
}
