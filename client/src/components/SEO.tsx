import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: Record<string, any>;
}

export default function SEO({
  title,
  description,
  keywords = "endurocide, antimicrobial curtains, hospital curtains, infection control, healthcare curtains, disposable curtains",
  image = "/og-image.jpg",
  url = window.location.href,
  type = "website",
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = `${title} | endurocide® New Zealand`;

    // Update meta tags
    const metaTags = {
      description: description,
      keywords: keywords,
      "og:title": title,
      "og:description": description,
      "og:image": image,
      "og:url": url,
      "og:type": type,
      "twitter:card": "summary_large_image",
      "twitter:title": title,
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
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

  }, [title, description, keywords, image, url, type, structuredData]);

  return null;
}
