import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Img from "./Img";
import useSwipe from "./useSwipe";

/**
 * Full-screen viewer. Rendered in a portal so page layout can't clip it.
 * Esc closes, ←/→ and swipe move, scrolling is locked, and focus returns
 * to the thumbnail that opened it.
 */
export default function Lightbox({ images, index, onChange, onClose }) {
  const closeRef = useRef(null);
  const total = images.length;
  const go = (i) => onChange(((i % total) + total) % total);
  const swipe = useSwipe(() => go(index + 1), () => go(index - 1));
  const img = images[index];

  useEffect(() => {
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return createPortal(
    <div className="mb-lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={onClose}>
      <button ref={closeRef} className="mb-close" aria-label="Close" onClick={onClose}>×</button>
      <figure onClick={(e) => e.stopPropagation()} {...swipe}>
        <Img key={img.src} src={img.src} alt={img.alt} eager />
        <figcaption>
          {img.caption && <span>{img.caption}</span>}
          {total > 1 && <span className="mb-lb-count">{index + 1} / {total}</span>}
        </figcaption>
      </figure>
      {total > 1 && (
        <>
          <button className="mb-arrow mb-prev" aria-label="Previous image" onClick={stop(() => go(index - 1))}>‹</button>
          <button className="mb-arrow mb-next" aria-label="Next image" onClick={stop(() => go(index + 1))}>›</button>
        </>
      )}
    </div>,
    document.body
  );
}
