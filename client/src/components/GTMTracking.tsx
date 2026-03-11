import { useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function GTMTracking() {
  const [location] = useLocation();

  useEffect(() => {
    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];
    
    // Push page_view event to GTM
    // This allows GTM to fire tags on virtual page views
    window.dataLayer.push({
      event: "page_view",
      page_path: location,
      page_title: document.title,
    });
  }, [location]);

  return null;
}
