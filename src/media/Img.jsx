import { useState } from "react";
import { mediaUrl } from "./media";
import { MEDIA_BASE } from "./config";

/** Lazy image that shows a placeholder instead of a broken-image icon if loading fails. */
export default function Img({ src, alt = "", className = "", eager = false, style }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`mb-fallback ${className}`} style={style} role="img" aria-label={alt || "Image unavailable"}>
        Image unavailable
      </div>
    );
  }
  return (
    <img
      className={className}
      src={mediaUrl(src, MEDIA_BASE)}
      alt={alt}
      style={style}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable="false"
      onError={() => setFailed(true)}
    />
  );
}
