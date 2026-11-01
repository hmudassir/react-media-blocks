/** Pure helpers (no React), unit-tested in test/media.test.mjs. */

/** Prefix relative media paths with a base URL (e.g. a CDN); full URLs pass through. */
export function mediaUrl(src, base = "") {
  if (!src) return "";
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  const b = String(base).replace(/\/+$/, "");
  return b + (src.startsWith("/") ? src : `/${src}`);
}

/** A YouTube video ID from an ID or any common YouTube URL; null if none. */
export function youtubeId(input = "") {
  const value = String(input).trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
  let id = null;
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const m = url.pathname.match(/^\/(embed|shorts|live|v)\/([^/?#]+)/);
      if (m) id = m[2];
    }
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

/** How many grid cells a mosaic tile occupies. */
export const SPAN_CELLS = { wide: 2, tall: 2, large: 4 };

/**
 * Check a mosaic layout: total cells and whether they fill complete rows.
 * A dense grid can still leave holes around tall tiles, but an incomplete
 * total always leaves at least one gap on the last row.
 */
export function mosaicLayout(images = [], columns = 4) {
  const cells = images.reduce((n, img) => n + (SPAN_CELLS[img.span] || 1), 0);
  const remainder = cells % columns;
  return { cells, rows: Math.ceil(cells / columns), complete: remainder === 0, missing: remainder ? columns - remainder : 0 };
}

export const clampColumns = (n) => Math.min(Math.max(Number(n) || 3, 2), 4);
