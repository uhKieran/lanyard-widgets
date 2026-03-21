import { useCallback, useRef, useState } from "react";
const exitAnimation = 300;

/**
 * Manages the show/exit animation states for widget cards.
 * Returns `{ isVisible, isExiting, showWidget, hideWidget }`.
 */

export function useWidgetVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const isVisibleRef = useRef(false);

  const showWidget = useCallback(() => {
    setIsVisible(true);
    setIsExiting(false);
    isVisibleRef.current = true;
  }, []);

  const hideWidget = useCallback(() => {
    if (!isVisibleRef.current) return;
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      isVisibleRef.current = false;
    }, exitAnimation);
  }, []);

  return { isVisible, isExiting, showWidget, hideWidget };
}
