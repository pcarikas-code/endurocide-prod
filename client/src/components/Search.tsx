import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

// Define searchable content
const searchableContent = [
  { title: "Home", href: "/", type: "Page" },
  { title: "Products", href: "/products", type: "Page" },
  { title: "Technology", href: "/technology", type: "Page" },
  { title: "Product Guides", href: "/guides", type: "Page" },
  { title: "Clinical Studies", href: "/studies", type: "Page" },
  { title: "News", href: "/news", type: "Page" },
  { title: "About Us", href: "/about", type: "Page" },
  { title: "Contact", href: "/contact", type: "Page" },
  { title: "Monkeypox Infection Control", href: "/monkeypox-infection-control", type: "Page" },
  // News Articles
  { title: "The Overlooked Vector: Mitigating HAIs", href: "/news/overlooked-vector-mitigating-hais", type: "News" },
  { title: "Clinical Evidence: A Data-Driven Approach", href: "/news/clinical-evidence-data-driven-approach", type: "News" },
  { title: "Beyond Bacteria: The Importance of Sporicidal Action", href: "/news/beyond-bacteria-importance-sporicidal-action", type: "News" },
  { title: "Operational Efficiency: A Strategic Advantage", href: "/news/operational-efficiency-strategic-advantage", type: "News" },
  { title: "Layered Defence: Integrating Curtains", href: "/news/layered-defence-integrating-curtains", type: "News" },
  { title: "Long-Term Value: The Clinical & Financial Case", href: "/news/long-term-value-clinical-financial-case", type: "News" },
];

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof searchableContent>([]);
  const [, setLocation] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = searchableContent.filter(item => 
      item.title.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  }, [query]);

  const handleSelect = (href: string) => {
    setLocation(href);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative flex items-center">
      {!isOpen ? (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(true)}
          className="text-muted-foreground hover:text-primary"
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
      ) : (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[calc(100vw-32px)] max-w-[300px] md:w-[400px] md:max-w-none bg-background z-50 flex items-center gap-2 p-2 rounded-md shadow-lg border animate-in fade-in slide-in-from-right-5 duration-200">
          <SearchIcon className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, news..."
            className="border-none shadow-none focus-visible:ring-0 h-8 px-2"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 shrink-0" 
            onClick={() => {
              setIsOpen(false);
              setQuery("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-[calc(100vw-32px)] max-w-[300px] md:w-[400px] md:max-w-none bg-background border rounded-md shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(result.href)}
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex flex-col gap-1 border-b last:border-0 border-border/40"
                >
                  <span className="font-medium text-sm text-foreground">{result.title}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{result.type}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
