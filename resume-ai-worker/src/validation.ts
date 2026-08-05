import type { AiRequest } from "./types";

export function isValidRequest(value: unknown): value is AiRequest {
  if (!value || typeof value !== "object") return false;

  const request = value as Partial<AiRequest>;

  if (!request.action) return false;

  if (request.action === "parse-resume") {
    return Boolean(request.rawText && request.rawText.trim().length > 20);
  }

  if (request.action === "fetch-job") {
    return Boolean(
      request.jobUrl &&
        request.jobUrl.trim().length > 0 &&
        request.jobUrl.length <= 2048
    );
  }

  return Boolean(
    request.resume &&
      request.company &&
      request.company.jobDescription
  );
}

export function isRequestTooLarge(body: string): boolean {
  return body.length > 100000;
}
