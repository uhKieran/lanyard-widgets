import { useEffect } from "react";

export function useWidgetHeightReporter() {
  useEffect(() => {
    const card = document.querySelector(".card") as HTMLElement | null;
    if (!card) return;

    const observer = new ResizeObserver(() => {
      if (card.offsetHeight > 0) {
        window.parent.postMessage(
          {
            type: "lanyard-widget-height",
            height: card.offsetTop + card.offsetHeight + 12,
          },
          "*",
        );
      }
    });

    observer.observe(card);
    return () => observer.disconnect();
  }, []);
}

export function useDarkTheme(isDark: boolean) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.className = isDark ? "dark" : "";
  }, [isDark]);
}
