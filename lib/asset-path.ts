import { withBasePath } from "@/lib/paths";

export function assetPath(path: string): string {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return withBasePath(normalized);
}
