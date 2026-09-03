import { NextRequest } from "next/server";
import { DocumentsService } from "@/server/services/documents.service";
import { validatePagination } from "@/server/validation/schemas";
import { apiSuccess, apiError } from "@/server/utils/response";
import { BadRequestError } from "@/server/utils/errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit } = validatePagination(
      searchParams.get("page"),
      searchParams.get("limit")
    );

    const data = DocumentsService.listDocuments(page, limit);

    return apiSuccess(data.documents, undefined, data.pagination);
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Failed to list documents.", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data Upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const title = (formData.get("title") as string) || file?.name || "Untitled Document";

      if (!file) {
        throw new BadRequestError("A document file is required in 'file' field.");
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const doc = DocumentsService.uploadDocument({
        title,
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        fileBuffer: buffer,
        metadata: {
          uploadedVia: "multipart",
        },
      });

      return apiSuccess(doc, "Document uploaded successfully.", undefined, 201);
    }

    // 2. JSON Body with Base64 Content
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { title, filename, mimeType, contentBase64, textContent } = body;

      if (!filename || (!contentBase64 && !textContent)) {
        throw new BadRequestError("filename and either contentBase64 or textContent are required.");
      }

      const buffer = contentBase64 
        ? Buffer.from(contentBase64, "base64")
        : Buffer.from(textContent, "utf-8");

      const doc = DocumentsService.uploadDocument({
        title: title || filename,
        filename,
        mimeType: mimeType || (textContent ? "text/plain" : "application/pdf"),
        fileBuffer: buffer,
        metadata: {
          uploadedVia: "json",
        },
      });

      return apiSuccess(doc, "Document uploaded successfully.", undefined, 201);
    }

    throw new BadRequestError("Unsupported Content-Type. Expected multipart/form-data or application/json.");
  } catch (error: any) {
    if (error.statusCode) {
      return apiError(error.code, error.message, error.statusCode);
    }
    return apiError("SERVER_ERROR", "Document upload failed.", 500);
  }
}
