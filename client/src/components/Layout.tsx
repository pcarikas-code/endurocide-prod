import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, ShieldCheck, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Search from "@/components/Search";



export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/guides", label: "Guides" },
    { href: "/studies", label: "Clinical Studies" },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-[1000px] mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-2xl font-bold text-primary tracking-tight">endurocide® NZ</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
                    location === item.href
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            <Search />
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Search />
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[64px] z-40 bg-background border-t flex flex-col overflow-y-auto h-[calc(100vh-64px)]">
            <div className="p-4 space-y-2 flex-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "block py-4 px-4 text-lg font-medium cursor-pointer rounded-lg hover:bg-muted transition-colors border-b border-border/40 last:border-0",
                      location === item.href
                        ? "text-primary bg-primary/5 border-transparent"
                        : "text-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="p-6 bg-muted/30 border-t space-y-6">
              <Link href="/contact">
                <Button 
                  className="w-full h-12 text-base font-semibold shadow-md" 
                  size="lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Request a Quote
                </Button>
              </Link>
              
              <div className="space-y-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">Contact Us</p>
                <a href="tel:+642102966718" className="block text-lg font-semibold text-primary hover:underline">
                  +64 (0)21 029 66718
                </a>
                <a href="mailto:info@endurocide.nz" className="block text-base text-muted-foreground hover:text-foreground transition-colors">
                  info@endurocide.nz
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t">
        <div className="container max-w-[1000px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.webp" alt="endurocide® NZ Logo" className="h-12 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advanced antimicrobial disposable curtains for superior infection control in healthcare environments.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Kenco Limited are the official distributors of <strong>endurocide®</strong> for New Zealand.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products"><span className="hover:text-primary cursor-pointer">Antimicrobial Curtains</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/technology"><span className="hover:text-primary cursor-pointer">Technology</span></Link></li>
              <li><Link href="/about"><span className="hover:text-primary cursor-pointer">About Us</span></Link></li>
              <li><Link href="/contact"><span className="hover:text-primary cursor-pointer">Contact</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li>info@endurocide.nz</li>
              <li>+64 (0)21 029 66718</li>
            </ul>
            
            <a 
              href="https://www.linkedin.com/company/kenco-ltd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#0077b5] hover:text-[#0077b5]/80 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              Follow us on LinkedIn
            </a>

          </div>
        </div>
        <div className="container max-w-[1000px] mx-auto px-4 md:px-8 mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} endurocide® NZ. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
