import { DocumentsRepository, DocumentRecord } from "../db/docs.repo";
import { BadRequestError, NotFoundError } from "../utils/errors";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.join(process.cwd(), ".data", "uploads");

function ensureUploadsDir(): void {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch {
    // Ignore in read-only environments
  }
}

export interface DocumentUploadInput {
  title: string;
  filename: string;
  mimeType: string;
  fileBuffer: Buffer;
  metadata?: Record<string, any>;
}

export class DocumentsService {
  static listDocuments(page = 1, limit = 20): {
    documents: DocumentRecord[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  } {
    const offset = (page - 1) * limit;
    const { items, total } = DocumentsRepository.list(limit, offset);

    return {
      documents: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static getDocumentById(id: string): DocumentRecord {
    const doc = DocumentsRepository.findById(id);
    if (!doc) {
      throw new NotFoundError(`Document '${id}'`);
    }
    return doc;
  }

  static uploadDocument(input: DocumentUploadInput): DocumentRecord {
    const { title, filename, mimeType, fileBuffer, metadata = {} } = input;

    // 1. Validation
    const allowedMimeTypes = [
      "application/pdf",
      "text/plain",
      "text/markdown",
      "application/json",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedMimeTypes.includes(mimeType.toLowerCase())) {
      throw new BadRequestError(`Unsupported file type '${mimeType}'. Allowed: PDF, TXT, JSON, DOCX.`);
    }

    const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
    if (fileBuffer.length > MAX_SIZE_BYTES) {
      throw new BadRequestError(`File size exceeds 15 MB limit (Current: ${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB).`);
    }

    // 2. Safe internal filename
    const safeBase = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
    const storedFilename = `doc_${Date.now()}_${safeBase}`;
    ensureUploadsDir();

    try {
      fs.writeFileSync(path.join(UPLOADS_DIR, storedFilename), fileBuffer);
    } catch {
      // Allow in-memory fallback
    }

    // 3. Simple text extraction preview if text/plain or json
    let initialText: string | undefined = undefined;
    if (mimeType.includes("text") || mimeType.includes("json")) {
      initialText = fileBuffer.toString("utf-8").substring(0, 5000);
    }

    const newDoc = DocumentsRepository.create({
      title: title.trim() || filename,
      originalFilename: filename,
      storedFilename,
      fileSize: fileBuffer.length,
      mimeType,
      status: "UPLOADED",
      chunksCount: 0,
      extractedText: initialText,
      metadata,
    });

    return newDoc;
  }

  static deleteDocument(id: string): boolean {
    const doc = this.getDocumentById(id);
    const deleted = DocumentsRepository.delete(id);

    if (deleted) {
      try {
        const filePath = path.join(UPLOADS_DIR, doc.storedFilename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch {
        // Continue
      }
    }

    return deleted;
  }
}
