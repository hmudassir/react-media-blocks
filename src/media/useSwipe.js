import { useRef } from "react";

/** Horizontal swipe for touch and pen. Spread the returned props on an element. */
export default function useSwipe(onLeft, onRight, threshold = 40) {
  const start = useRef(null);
  return {
    onPointerDown: (e) => {
      if (e.pointerType !== "mouse") start.current = e.clientX;
    },
    onPointerUp: (e) => {
      if (start.current == null) return;
      const dx = e.clientX - start.current;
      start.current = null;
      if (dx <= -threshold) onLeft();
      else if (dx >= threshold) onRight();
    },
    onPointerCancel: () => (start.current = null),
  };
}
