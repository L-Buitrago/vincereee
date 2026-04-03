import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // If we have a smooth scroller like Lenis, we might need a small delay
    // or use its own scrollTo method. For now, window.scrollTo(0,0) is standard.
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      });
    }, 10);
    
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
