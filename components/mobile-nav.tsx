"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

export function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] z-40 bg-background border-t flex flex-col overflow-y-auto h-[calc(100vh-64px)]">
          <div className="p-4 space-y-2 flex-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <div
                  className={cn(
                    "block py-4 px-4 text-lg font-medium cursor-pointer rounded-lg hover:bg-muted transition-colors border-b border-border/40 last:border-0",
                    pathname === item.href
                      ? "text-primary bg-primary/5 border-transparent"
                      : "text-foreground"
                  )}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
          
          <div className="p-6 bg-muted/30 border-t space-y-6">
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              <Button 
                className="w-full h-12 text-base font-semibold shadow-md" 
                size="lg"
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
    </>
  );
}
