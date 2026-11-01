import ImageBlock from "./ImageBlock";
import Gallery from "./Gallery";
import YouTube from "./YouTube";

/**
 * Render content stored as JSON blocks. Unknown types are skipped (with a
 * warning in development), so new block types never crash older clients.
 * Text is rendered as text, never as HTML.
 */
const RENDERERS = {
  p: (b, key) => <p key={key} className="mb-p">{b.text}</p>,
  heading: (b, key) => <h2 key={key} className="mb-h">{b.text}</h2>,
  quote: (b, key) => <blockquote key={key} className="mb-quote">{b.text}</blockquote>,
  image: (b, key) => <ImageBlock key={key} {...b} />,
  gallery: (b, key) => <Gallery key={key} {...b} />,
  youtube: (b, key) => <YouTube key={key} {...b} />,
};

export default function BlockRenderer({ blocks = [] }) {
  return blocks.map((block, i) => {
    const render = RENDERERS[block?.type];
    if (!render) {
      if (import.meta.env?.DEV) console.warn(`Unknown block type “${block?.type}”`, block);
      return null;
    }
    return render(block, i);
  });
}
