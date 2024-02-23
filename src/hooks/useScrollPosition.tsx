import React from "react";
import { useThrottle } from "./useThrottle";

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = React.useState({
    position: 0,
    percentage: 0,
  });

  const handleScroll = () => {
    //get the current scroll position
    const scrollY = window.scrollY;
    //get the height of the document including non-visible area
    const scrollHeight = document.documentElement.scrollHeight;
    //get the height of the visible area
    const windowHeight = window.innerHeight;

    setScrollPosition({
      position: scrollY,
      percentage: Math.min(
        (scrollY / (scrollHeight - windowHeight)) * 100,
        100
      ),
    });
  };

  const throttledHandleScroll = useThrottle(handleScroll, 150);

  React.useEffect(() => {
    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [throttledHandleScroll]);
  return scrollPosition;
}
