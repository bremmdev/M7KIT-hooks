import React from "react";

type Dimensions = {
  width?: number;
  height?: number;
};

export function useResizeObserver<T extends HTMLElement>(
  elementRef: React.RefObject<T>
) {
  const [dimensions, setDimension] = React.useState<Dimensions>({
    width: undefined,
    height: undefined,
  });

  React.useEffect(() => {
    if (!elementRef.current) return;
    const observedEl = elementRef.current;
    const rect = observedEl.getBoundingClientRect();
    setDimension({
      width: rect.width,
      height: rect.height,
    });

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect) {
        const { width, height } = entries[0].contentRect;
        setDimension({
          width,
          height,
        });
      }
    });

    resizeObserver.observe(observedEl);

    return () => {
      resizeObserver.unobserve(observedEl);
    };
  }, [elementRef]);
  return dimensions;
}
