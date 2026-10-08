import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function GTMTracking() {
  const [location] = useLocation();
  const isInitialRoute = useRef(true);

  useEffect(() => {
    // The Google tag records the initial document load. Emit this custom
    // event only after a client-side navigation so GA4 does not double-count
    // the first page view of an SPA session.
    if (isInitialRoute.current) {
      isInitialRoute.current = false;
      return;
    }

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    const canonicalUrl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;

    // Push page_view event to GTM
    // This allows GTM to fire tags on virtual page views
    window.dataLayer.push({
      event: "page_view",
      page_path: location,
      page_location: canonicalUrl || window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return null;
}
