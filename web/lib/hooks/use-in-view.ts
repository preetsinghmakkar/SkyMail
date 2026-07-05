import { useEffect, useRef, useState } from "react";

/**
 * True once the element has scrolled into view (fires once, then disconnects).
 * Immediately true if the user prefers reduced motion.
 */
export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, inView]);

  return { ref, inView };
}
