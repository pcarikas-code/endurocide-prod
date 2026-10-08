import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
  structuredData?: Record<string, any>;
}

export default function SEO({
  title,
  description,
  keywords = "endurocide, antimicrobial curtains, hospital curtains, infection control, healthcare curtains, disposable curtains",
  image = "/og-image.jpg",
  url = window.location.href.replace(/^http:/, "https:"),
  type = "website",
  robots = "index, follow",
  structuredData,
}: SEOProps) {
  useEffect(() => {
    const resolvedTitle =
      title === "Home"
        ? "endurocide® NZ | Antimicrobial Hospital Curtains"
        : `${title} | endurocide® NZ`;

    document.title = resolvedTitle;

    // Update meta tags
    const metaTags = {
      description: description,
      keywords: keywords,
      "og:title": resolvedTitle,
      "og:description": description,
      "og:image": image,
      "og:url": url,
      "og:type": type,
      "og:site_name": "endurocide® NZ",
      "og:locale": "en_NZ",
      "og:image:alt": description,
      "og:image:width": "1200",
      "og:image:height": "630",
      "robots": robots,
      "twitter:card": "summary_large_image",
      "twitter:title": resolvedTitle,
      "twitter:description": description,
      "twitter:image": image,
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      // Try to find existing meta tag by name or property
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        // Use 'property' for og: tags, 'name' for others
        element.setAttribute(name.startsWith("og:") ? "property" : "name", name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    });

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    // Ensure canonical URL does not contain query parameters
    try {
      const canonicalUrl = new URL(url);
      canonical.setAttribute("href", `${canonicalUrl.origin}${canonicalUrl.pathname}`);
    } catch (e) {
      // Fallback if URL parsing fails
      canonical.setAttribute("href", url);
    }

    // Inject Structured Data (JSON-LD)
    if (structuredData) {
      const scriptId = "seo-schema";
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

  }, [title, description, keywords, image, url, type, robots, structuredData]);

  return null;
}
