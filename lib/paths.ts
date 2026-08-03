export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function isExternalPath(path: string) {
  return (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  );
}

/** Prefix an internal path for plain <a> hrefs and history.pushState. */
export function withBasePath(path: string): string {
  if (!path || isExternalPath(path)) return path;

  if (path.startsWith("#")) {
    return `${BASE_PATH}/${path}`;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

/** Strip the deployed base path so values match Next.js usePathname(). */
export function stripBasePath(pathname: string): string {
  if (!BASE_PATH) return pathname || "/";

  if (pathname === BASE_PATH || pathname === `${BASE_PATH}/`) {
    return "/";
  }

  if (pathname.startsWith(`${BASE_PATH}/`)) {
    return pathname.slice(BASE_PATH.length) || "/";
  }

  return pathname || "/";
}

/** Home-page section links that work from any route in dev and on GitHub Pages. */
export function homeSectionHref(sectionId: string): string {
  const hash = sectionId.startsWith("#") ? sectionId : `#${sectionId}`;
  return `/${hash}`;
}
