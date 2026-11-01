import Img from "./Img";

/** { type: "image", src, alt, caption?, size?: "normal" | "wide" | "full" } */
export default function ImageBlock({ src, alt, caption, size = "normal" }) {
  return (
    <figure className={`mb-figure mb-${size}`}>
      <Img src={src} alt={alt} className="mb-image" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
