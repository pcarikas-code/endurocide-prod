import { useEffect } from "react";
import { useLocation } from "wouter";

export function CanonicalUrl() {
  const [location] = useLocation();

  useEffect(() => {
    // Base URL of the website
    const baseUrl = "https://endurocide.nz";
    
    // Construct the full canonical URL
    // Remove trailing slash if present (unless it's root) to avoid duplicates
    const path = location === "/" ? "" : location.replace(/\/$/, "");
    const canonicalUrl = `${baseUrl}${path}`;

    // Find existing canonical link or create a new one
    let link = document.querySelector("link[rel='canonical']");
    
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }

    // Update the href attribute
    link.setAttribute("href", canonicalUrl);
    
  }, [location]);

  return null; // This component doesn't render anything visible
}
