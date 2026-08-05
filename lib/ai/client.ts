import type {
  AiRequest,
  AiResponse,
  FetchJobResult,
} from "@/types/resume-builder";

const endpoint = process.env.NEXT_PUBLIC_RESUME_AI_ENDPOINT;

export async function generateResumeContent(
  payload: AiRequest,
  signal?: AbortSignal
): Promise<AiResponse> {
  if (!endpoint) {
    throw new Error(
      "AI endpoint is not configured. Set NEXT_PUBLIC_RESUME_AI_ENDPOINT."
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  const data = (await response.json()) as AiResponse | { error?: string };

  if (!response.ok) {
    throw new Error(
      "error" in data && data.error
        ? data.error
        : "Unable to generate content."
    );
  }

  return data as AiResponse;
}

export async function fetchJobFromUrl(
  jobUrl: string,
  signal?: AbortSignal
): Promise<FetchJobResult> {
  const data = await generateResumeContent(
    { action: "fetch-job", jobUrl: jobUrl.trim() },
    signal
  );

  if (!data.company || !data.job) {
    throw new Error(
      "We couldn't read that page. Paste the job description below instead."
    );
  }

  return {
    company: data.company,
    job: data.job,
    warnings: data.warnings,
  };
}
