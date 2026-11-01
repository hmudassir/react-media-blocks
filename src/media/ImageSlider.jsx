import { useState } from "react";
import Img from "./Img";
import useSwipe from "./useSwipe";

/**
 * One image at a time: arrows, dots, swipe, and ←/→ when focused.
 * fit "cover" fills the frame (crops); "contain" shows the whole image.
 */
export default function ImageSlider({ images, ratio = "16 / 9", fit = "cover", size = "wide", caption }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const go = (i) => setIndex(((i % total) + total) % total);
  const swipe = useSwipe(() => go(index + 1), () => go(index - 1));
  if (!total) return null;
  const current = images[index];

  return (
    <figure className={`mb-figure mb-${size}`}>
      <div
        className="mb-slider"
        style={{ aspectRatio: ratio }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`Image gallery, ${total} images. Use the arrow keys to move.`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        {...swipe}
      >
        <div className="mb-track" style={{ transform: `translateX(${-index * 100}%)` }}>
          {images.map((img, i) => (
            <div className="mb-slide" key={img.src + i} aria-hidden={i !== index}>
              <Img src={img.src} alt={img.alt} eager={i === 0} style={{ objectFit: fit }} />
            </div>
          ))}
        </div>
        {total > 1 && (
          <>
            <button className="mb-arrow mb-prev" aria-label="Previous image" onClick={() => go(index - 1)}>‹</button>
            <button className="mb-arrow mb-next" aria-label="Next image" onClick={() => go(index + 1)}>›</button>
            <div className="mb-count" aria-live="polite">{index + 1} / {total}</div>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="mb-dots">
          {images.map((_, i) => (
            <button key={i} className={i === index ? "active" : ""} aria-label={`Show image ${i + 1}`} aria-current={i === index} onClick={() => go(i)} />
          ))}
        </div>
      )}
      {(current.caption || caption) && <figcaption>{current.caption || caption}</figcaption>}
    </figure>
  );
}
