import { extractResponseText, describeAiResultShape } from "./aiResponse";
import { buildFetchJobPrompt } from "./prompts";
import type { FetchJobResult, ImportedCompany, ImportedJob } from "./types";

const MAX_URL_LENGTH = 2048;
const MAX_RESPONSE_BYTES = 1024 * 1024;
const MAX_PAGE_TEXT = 15000;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "::1",
]);

function isPrivateIp(hostname: string): boolean {
  if (/^10\./.test(hostname)) return true;
  if (/^127\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;
  if (/^169\.254\./.test(hostname)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return true;
  if (/^0\./.test(hostname)) return true;
  if (hostname.startsWith("fe80:")) return true;
  if (hostname.startsWith("fc") || hostname.startsWith("fd")) return true;
  return false;
}

export function validateJobUrl(raw: string): URL {
  const trimmed = raw.trim();

  if (!trimmed || trimmed.length > MAX_URL_LENGTH) {
    throw new Error("That job URL is not valid.");
  }

  let url: URL;

  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("That job URL is not valid.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Only HTTPS job URLs are supported.");
  }

  const hostname = url.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname) || isPrivateIp(hostname)) {
    throw new Error("That URL is not allowed.");
  }

  return url;
}

export function extractTitle(html: string): string {
  const og =
    html.match(
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i
    );
  if (og?.[1]) return decodeBasicEntities(og[1]).trim();

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title?.[1]) {
    return decodeBasicEntities(title[1].replace(/\s+/g, " ")).trim();
  }

  return "";
}

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

/**
 * When AI returns incomplete fields, fill from page heuristics so Import still helps.
 */
function mergeHeuristics(
  parsed: FetchJobResult | null,
  html: string,
  pageText: string,
  sourceUrl: string
): FetchJobResult | null {
  const title = extractTitle(html);
  const inferredJobTitle = title
    .split("|")[0]
    .split("–")[0]
    .split("-")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(-1)[0] || title;

  if (!parsed) {
    if (!inferredJobTitle || pageText.length < 50) return null;

    return {
      company: {
        companyName: title.includes("-")
          ? title.split("-")[0].trim()
          : inferredJobTitle,
      },
      job: {
        jobTitle: inferredJobTitle,
        description: pageText.slice(0, MAX_PAGE_TEXT),
        source: sourceUrl,
      },
      warnings: [
        "AI extraction was incomplete; filled fields from the page title and text. Review carefully.",
      ],
    };
  }

  const companyName = parsed.company.companyName?.trim();
  const jobTitle = parsed.job.jobTitle?.trim() || inferredJobTitle;
  const description =
    parsed.job.description?.trim().length >= 50
      ? parsed.job.description
      : pageText.slice(0, MAX_PAGE_TEXT);

  if (!companyName || !jobTitle || description.length < 50) {
    return null;
  }

  return {
    company: {
      ...parsed.company,
      companyName,
    },
    job: {
      ...parsed.job,
      jobTitle,
      description,
      source: parsed.job.source || sourceUrl,
    },
    warnings: parsed.warnings,
  };
}

export function stripHtml(html: string): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length > MAX_PAGE_TEXT) {
    text = text.slice(0, MAX_PAGE_TEXT);
  }

  return text;
}

function parseFetchJobResponse(
  content: string,
  fallbackDescription?: string
): FetchJobResult | null {
  const trimmed = content.trim();
  const fenced =
    trimmed.match(/```json\s*([\s\S]*?)\s*```/) ||
    trimmed.match(/```\s*([\s\S]*?)\s*```/);

  let candidate = fenced ? fenced[1].trim() : trimmed;

  if (!candidate.startsWith("{")) {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      candidate = candidate.slice(start, end + 1);
    }
  }

  try {
    const parsed = JSON.parse(candidate) as Record<string, unknown>;
    const company = (parsed.company ?? {}) as Record<string, unknown>;
    const job = (parsed.job ?? {}) as Record<string, unknown>;

    const companyName =
      typeof company.companyName === "string" ? company.companyName.trim() : "";
    const jobTitle =
      typeof job.jobTitle === "string" ? job.jobTitle.trim() : "";
    let description =
      typeof job.description === "string" ? job.description.trim() : "";

    // Keep partial parses — mergeHeuristics fills gaps from page text/title.
    if (!companyName && !jobTitle && !description) {
      return null;
    }

    if (description.length < 50 && fallbackDescription && fallbackDescription.length >= 50) {
      description = fallbackDescription.slice(0, MAX_PAGE_TEXT);
    }

    const toOptionalString = (value: unknown): string | undefined =>
      typeof value === "string" && value.trim() ? value.trim() : undefined;

    const toStringArray = (value: unknown): string[] | undefined => {
      if (!Array.isArray(value)) return undefined;
      const items = value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
      return items.length ? items : undefined;
    };

    return {
      company: {
        companyName: companyName || "Unknown company",
        website: toOptionalString(company.website),
        industry: toOptionalString(company.industry),
        description: toOptionalString(company.description),
        hiringManagerName: toOptionalString(company.hiringManagerName),
      },
      job: {
        jobTitle: jobTitle || "Untitled role",
        location: toOptionalString(job.location),
        description: description || fallbackDescription?.slice(0, MAX_PAGE_TEXT) || "",
        requiredSkills: toStringArray(job.requiredSkills),
        preferredSkills: toStringArray(job.preferredSkills),
        source: toOptionalString(job.source),
      },
      warnings: toStringArray(parsed.warnings),
    };
  } catch {
    return null;
  }
}

async function fetchJobHtml(url: URL): Promise<string> {
  let currentUrl = url;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    const response = await fetch(currentUrl.toString(), {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("Location");

      if (!location) {
        throw new Error("Could not follow the job page redirect.");
      }

      currentUrl = validateJobUrl(new URL(location, currentUrl).toString());
      continue;
    }

    if (!response.ok) {
      throw new Error(
        `Could not fetch the job page (HTTP ${response.status}).`
      );
    }

    const contentLength = Number(response.headers.get("Content-Length") || 0);

    if (contentLength > MAX_RESPONSE_BYTES) {
      throw new Error("The job page is too large to import.");
    }

    const html = await response.text();

    if (html.length > MAX_RESPONSE_BYTES) {
      throw new Error("The job page is too large to import.");
    }

    return html;
  }

  throw new Error("The job page redirected too many times.");
}

export async function handleFetchJob(
  jobUrl: string,
  env: { AI: Ai; AI_MODEL: string }
): Promise<FetchJobResult> {
  const url = validateJobUrl(jobUrl);
  const html = await fetchJobHtml(url);
  const pageText = stripHtml(html);

  if (pageText.length < 100) {
    throw new Error(
      "We couldn't read enough text from that page. Paste the job description below instead."
    );
  }

  const prompt = buildFetchJobPrompt(pageText, url.toString());

  // gpt-oss models spend tokens on reasoning; keep effort low and leave room for JSON.
  const result = await env.AI.run(env.AI_MODEL as keyof AiModels, {
    messages: [
      {
        role: "system",
        content:
          "You extract structured job posting data from web page text. " +
          "Use only information present in the text. Never invent facts. " +
          "Return valid JSON only. Do not explain your reasoning.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 4096,
    temperature: 0.1,
    // Supported by gpt-oss on Workers AI; ignored by other models.
    reasoning: { effort: "low" },
  } as Record<string, unknown>);

  const responseText = extractResponseText(result);
  let parsed: FetchJobResult | null = null;

  if (responseText) {
    parsed = parseFetchJobResponse(responseText, pageText);
  } else {
    console.error(
      "fetch-job: empty AI text",
      describeAiResultShape(result),
      JSON.stringify(result)?.slice(0, 500)
    );
  }

  if (!parsed || !parsed.job.jobTitle || parsed.job.description.length < 50) {
    // Allow incomplete AI output — fill title/description from the page.
    if (responseText && !parsed) {
      console.error(
        "fetch-job: failed to parse AI JSON",
        responseText.slice(0, 800)
      );
    }
    parsed = mergeHeuristics(parsed, html, pageText, url.toString());
  } else {
    parsed = mergeHeuristics(parsed, html, pageText, url.toString());
  }

  if (!parsed) {
    throw new Error(
      "We couldn't read that page. Paste the job description below instead."
    );
  }

  return {
    company: parsed.company,
    job: {
      ...parsed.job,
      source: parsed.job.source || url.toString(),
    },
    warnings: parsed.warnings,
  };
}
