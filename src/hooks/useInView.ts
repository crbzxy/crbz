import { useEffect, useRef, useState } from 'react';

/** Se activa una vez cuando el elemento entra al viewport; imita framer-motion's useInView({ once: true }). */
export function useInView<T extends HTMLElement>(margin = '-100px') {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isInView) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isInView, margin]);

  return { ref, isInView };
}
