import { useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("config", import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location,
      });
    }
  }, [location]);

  return null;
}
