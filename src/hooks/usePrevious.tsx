import React from "react";

export function usePrevious<T>(value: T) {
  const previousRef = React.useRef<T | undefined>(undefined);

  React.useEffect(() => {
    previousRef.current = value;
  });

  return previousRef.current;
}