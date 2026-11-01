import { useState } from "react";
import { youtubeId } from "./media";

/**
 * A "facade" embed: shows the thumbnail and loads YouTube's player only when
 * the reader presses play, using the privacy-enhanced youtube-nocookie.com.
 * { type: "youtube", video: "<URL or ID>", title, caption?, start? (seconds) }
 */
export default function YouTube({ video, title = "YouTube video", caption, start, size = "normal" }) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(video);
  if (!id) return null;

  const params = new URLSearchParams({ autoplay: "1", rel: "0" });
  if (start) params.set("start", String(start));

  return (
    <figure className={`mb-figure mb-${size}`}>
      <div className="mb-video">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button className="mb-poster" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async"
              onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
            <span className="mb-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
            </span>
            <span className="mb-video-title">{title}</span>
          </button>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
