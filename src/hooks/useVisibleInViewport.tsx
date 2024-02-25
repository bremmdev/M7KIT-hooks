import React from "react";

/**
 * Custom hook that triggers a callback when a specified element becomes visible in the viewport.
 *
 * @template T The HTML element type.
 * @param {React.RefObject<T>} elementRef The ref of the element to observe.
 * @param {() => void} cb The callback function to execute when the element becomes visible.
 * @param {boolean} [once=true] If true, the callback will be triggered only once; otherwise, it will be triggered every time the element becomes visible.
 * @returns {void}
 */

export function useVisibleInViewport<T extends HTMLElement>(
  elementRef: React.RefObject<T>,
  cb: () => void,
  once = true
) {
  React.useEffect(() => {
    function handleIntersect(
      entries: Array<IntersectionObserverEntry>,
      observer: IntersectionObserver
    ) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // Call the callback and unobserve the target element if once is true
          cb();
          if (once) {
            observer.unobserve(entry.target);
          }
        }
      }
    }

    const observer = new IntersectionObserver(handleIntersect);
    const targetElement = elementRef.current;
    if (targetElement) {
      observer.observe(targetElement);
    }

    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [cb, once, elementRef]);
}
