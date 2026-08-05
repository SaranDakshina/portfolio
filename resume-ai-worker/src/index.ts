import { extractResponseText } from "./aiResponse";
import { handleFetchJob } from "./fetchJob";
import { buildPrompt } from "./prompts";
import { isRequestTooLarge, isValidRequest } from "./validation";

interface Env {
  AI: Ai;
  AI_MODEL: string;
  ALLOWED_ORIGIN: string;
}

const LOCAL_ORIGIN = "http://localhost:3000";

function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

function json(body: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  });
}

function isAllowedOrigin(requestOrigin: string, env: Env): boolean {
  return (
    requestOrigin === env.ALLOWED_ORIGIN ||
    requestOrigin === LOCAL_ORIGIN
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestOrigin = request.headers.get("Origin") ?? "";
    const responseOrigin = isAllowedOrigin(requestOrigin, env)
      ? requestOrigin
      : env.ALLOWED_ORIGIN;

    if (request.method === "OPTIONS") {
      if (!isAllowedOrigin(requestOrigin, env)) {
        return json({ error: "Origin is not allowed." }, 403, env.ALLOWED_ORIGIN);
      }

      return new Response(null, {
        status: 204,
        headers: corsHeaders(requestOrigin),
      });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405, responseOrigin);
    }

    if (!isAllowedOrigin(requestOrigin, env)) {
      return json({ error: "Origin is not allowed." }, 403, env.ALLOWED_ORIGIN);
    }

    const rawBody = await request.text();

    if (isRequestTooLarge(rawBody)) {
      return json({ error: "Request is too large." }, 413, responseOrigin);
    }

    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return json({ error: "Invalid JSON body." }, 400, responseOrigin);
    }

    if (!isValidRequest(body)) {
      return json(
        { error: "The request is missing required information." },
        400,
        responseOrigin
      );
    }

    if (body.action === "fetch-job") {
      try {
        const fetchResult = await handleFetchJob(body.jobUrl!, env);
        return json(fetchResult, 200, responseOrigin);
      } catch (error) {
        console.error("Job import failed", error);

        const message =
          error instanceof Error
            ? error.message
            : "We couldn't read that page. Paste the job description below instead.";

        return json({ error: message }, 502, responseOrigin);
      }
    }

    const prompt = buildPrompt(body);

    try {
      const result = await env.AI.run(env.AI_MODEL as keyof AiModels, {
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume and cover-letter editor. " +
              "Never invent employment history, qualifications, metrics, " +
              "skills, or personal information. Use only facts supplied by " +
              "the user. Return polished professional content.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1800,
        temperature: 0.4,
      });

      const responseText = extractResponseText(result);

      if (!responseText) {
        return json(
          { error: "The AI provider returned an empty response." },
          502,
          responseOrigin
        );
      }

      return json({ content: responseText }, 200, responseOrigin);
    } catch (error) {
      console.error("AI generation failed", error);

      return json(
        {
          error: "AI generation is temporarily unavailable. Please try again.",
        },
        503,
        responseOrigin
      );
    }
  },
};
