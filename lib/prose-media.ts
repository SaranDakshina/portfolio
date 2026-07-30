const PROSE_VIDEO_FILTERS: Record<string, string> = {
  "/projects/woap/woap-filters.mp4": "brightness(1.12) contrast(1.1)",
  "/projects/woap/woap-list-view.mp4": "brightness(1.12) contrast(1.1)",
};

export function getProseVideoFilter(src: string): string | undefined {
  return PROSE_VIDEO_FILTERS[src];
}

export function parseProseMediaAlt(alt: string): {
  caption: string;
  aspectRatio?: string;
} {
  const pipeIndex = alt.lastIndexOf("|");
  if (pipeIndex === -1) {
    return { caption: alt };
  }

  const caption = alt.slice(0, pipeIndex).trim();
  const ratio = alt.slice(pipeIndex + 1).trim();
  if (/^\d+\/\d+$/.test(ratio)) {
    return { caption, aspectRatio: ratio };
  }

  return { caption: alt };
}
