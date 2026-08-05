/**
 * Extract text from Workers AI results across response shapes:
 * - Classic: { response: string }
 * - Chat Completions: { choices: [{ message: { content } }] }
 * - gpt-oss: content may be null; answer can be in reasoning / reasoning_content
 * - Responses API: { output: [{ type: "message", content: [...] }] }
 */
export function extractResponseText(result: unknown): string {
  if (typeof result === "string") return result;
  if (!result || typeof result !== "object") return "";

  const record = result as Record<string, unknown>;

  if (typeof record.response === "string") return record.response;
  if (typeof record.output_text === "string") return record.output_text;
  if (typeof record.text === "string") return record.text;

  if (Array.isArray(record.choices) && record.choices[0]) {
    const choice = record.choices[0] as {
      message?: {
        content?: unknown;
        reasoning?: unknown;
        reasoning_content?: unknown;
      };
      text?: string;
    };

    if (typeof choice.text === "string" && choice.text.trim()) {
      return choice.text.trim();
    }

    const message = choice.message;
    if (message) {
      const fromContent = contentToText(message.content);
      if (fromContent) return fromContent;

      // gpt-oss often returns content:null and puts work in reasoning fields
      const fromReasoning =
        contentToText(message.reasoning_content) ||
        contentToText(message.reasoning);
      if (fromReasoning) return fromReasoning;
    }
  }

  if (Array.isArray(record.output)) {
    const messageParts: string[] = [];
    const reasoningParts: string[] = [];

    for (const item of record.output) {
      if (!item || typeof item !== "object") continue;

      const entry = item as Record<string, unknown>;
      const text =
        contentToText(entry.content) ||
        (typeof entry.text === "string" ? entry.text : "");

      if (!text) continue;

      if (entry.type === "reasoning") {
        reasoningParts.push(text);
      } else {
        messageParts.push(text);
      }
    }

    if (messageParts.length) return messageParts.join("\n").trim();
    if (reasoningParts.length) return reasoningParts.join("\n").trim();
  }

  if (record.result && typeof record.result === "object") {
    return extractResponseText(record.result);
  }

  return "";
}

function contentToText(content: unknown): string {
  if (typeof content === "string") return content.trim();

  if (!Array.isArray(content)) return "";

  const parts: string[] = [];

  for (const part of content) {
    if (typeof part === "string") {
      parts.push(part);
      continue;
    }

    if (!part || typeof part !== "object") continue;

    const record = part as Record<string, unknown>;

    if (typeof record.text === "string") {
      parts.push(record.text);
    } else if (typeof record.output_text === "string") {
      parts.push(record.output_text);
    } else if (typeof record.content === "string") {
      parts.push(record.content);
    }
  }

  return parts.join("\n").trim();
}

export function describeAiResultShape(result: unknown): string {
  if (result == null) return String(result);
  if (typeof result !== "object") return typeof result;

  const keys = Object.keys(result as object);
  return `keys=[${keys.join(", ")}]`;
}
