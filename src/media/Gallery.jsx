import { useEffect, useState } from "react";
import Img from "./Img";
import ImageSlider from "./ImageSlider";
import Lightbox from "./Lightbox";
import { clampColumns, mosaicLayout } from "./media";

/**
 * { type: "gallery", layout: "slider" | "grid" | "mosaic", columns?: 2–4,
 *   images: [{ src, alt, caption?, span?: "wide" | "tall" | "large" }] }
 * Grid and mosaic tiles open a lightbox. span applies to mosaic only.
 */
export default function Gallery({ layout = "grid", images = [], columns = 3, caption, ratio, fit, size = "wide" }) {
  const [open, setOpen] = useState(null);
  const cols = clampColumns(columns);

  useEffect(() => {
    if (layout !== "mosaic" || !import.meta.env?.DEV) return;
    const { complete, missing } = mosaicLayout(images, cols);
    if (!complete) console.warn(`Mosaic leaves a gap: add ${missing} more cell(s) to fill the last row.`);
  }, [layout, images, cols]);

  if (!images.length) return null;
  if (layout === "slider") return <ImageSlider images={images} ratio={ratio} fit={fit} size={size} caption={caption} />;

  return (
    <figure className={`mb-figure mb-${size}`}>
      <div className={`mb-gallery mb-${layout === "mosaic" ? "mosaic" : "grid"}`} style={{ "--mb-cols": cols }}>
        {images.map((img, i) => (
          <button
            key={img.src + i}
            className={`mb-tile ${layout === "mosaic" && img.span ? `mb-span-${img.span}` : ""}`}
            onClick={() => setOpen(i)}
            aria-label={`Open image ${i + 1} of ${images.length}${img.alt ? `: ${img.alt}` : ""}`}
          >
            <Img src={img.src} alt={img.alt} />
          </button>
        ))}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
      {open !== null && <Lightbox images={images} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </figure>
  );
}
