import { useEffect } from "react";
import { useLocation } from "wouter";

export default function LegacyRedirects() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Normalize path by removing trailing slash
    const path = location.endsWith("/") && location.length > 1 
      ? location.slice(0, -1) 
      : location;

    // Define redirects map: oldPath -> newPath
    const redirects: Record<string, string> = {
      "/product-info-endurocide-hospital-curtains": "/products",
      "/the-facts-hospital-acquired-infections": "/studies", // or /news/overlooked-vector-mitigating-hais
      "/monkeypox": "/monkeypox-infection-control",
      "/contact-us": "/contact",
      "/about-us": "/about"
    };

    if (redirects[path]) {
      setLocation(redirects[path]);
    }
  }, [location, setLocation]);

  return null;
}
