import { BASE_PATH, withBasePath } from "@/lib/paths";

export function assetPath(path: string): string {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (BASE_PATH && normalized.startsWith(`${BASE_PATH}/`)) return normalized;
  return withBasePath(normalized);
}
