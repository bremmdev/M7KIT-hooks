import React from "react";

type Options = {
  /**
   * CSS selector for elements to make inert, e.g. 'main, header'
   * @default 'body'
   */
  selector?: string;
  /**
   * Class to add to body to prevent scrolling
   */
  preventBodyScrollClass?: string;
  /**
   * Prevent body scrolling using inline styles
   * @default false
   */
  preventBodyScrollInline?: boolean;
};

export function useMakeInert({
  selector = "body",
  preventBodyScrollClass,
  preventBodyScrollInline = false,
}: Options) {
  const toggleInert = React.useCallback(
    (add: boolean) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`No elements found matching selector: ${selector}`);
        return;
      }
      elements.forEach((el) =>
        add ? el.setAttribute("inert", "") : el.removeAttribute("inert")
      );
    },
    [selector]
  );

  React.useEffect(() => {
    toggleInert(true);
    //toggle prevent body scroll using either a provided class or inline styles
    preventBodyScrollClass
      ? document.body.classList.add(preventBodyScrollClass)
      : preventBodyScrollInline
      ? (document.body.style.overflowY = "hidden")
      : null;

    return () => {
      toggleInert(false);
      preventBodyScrollClass
        ? document.body.classList.remove(preventBodyScrollClass)
        : preventBodyScrollInline
        ? (document.body.style.overflowY = "initial")
        : null;
    };
  }, [toggleInert, preventBodyScrollClass, preventBodyScrollInline]);
}
