import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { MobileNav } from "@/components/mobile-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Endurocide NZ",
  description: "Endurocide® Antimicrobial Hospital Curtains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="relative flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/" className="flex items-center space-x-2">
                      <div className="relative h-8 w-8 md:h-10 md:w-10">
                        <Image
                          src="/logo.webp"
                          alt="Endurocide Logo"
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                      <span className="hidden font-bold sm:inline-block text-lg md:text-xl text-primary">
                        Endurocide NZ
                      </span>
                    </Link>
                  </div>
                  
                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">Products</Link>
                    <Link href="/technology" className="transition-colors hover:text-foreground/80 text-foreground/60">Technology</Link>
                    <Link href="/clinical-studies" className="transition-colors hover:text-foreground/80 text-foreground/60">Clinical Studies</Link>
                    <Link href="/guides" className="transition-colors hover:text-foreground/80 text-foreground/60">Guides</Link>
                    <Link href="/news" className="transition-colors hover:text-foreground/80 text-foreground/60">News</Link>
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
                    <Link href="/contact">
                      <Button size="sm">Contact Us</Button>
                    </Link>
                  </nav>

                  {/* Mobile Navigation */}
                  <MobileNav navItems={[
                    { href: "/products", label: "Products" },
                    { href: "/technology", label: "Technology" },
                    { href: "/clinical-studies", label: "Clinical Studies" },
                    { href: "/guides", label: "Guides" },
                    { href: "/news", label: "News" },
                    { href: "/about", label: "About" },
                    { href: "/contact", label: "Contact" },
                  ]} />
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t bg-muted/40 py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2024 Endurocide NZ. All rights reserved.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                    <Link href="/terms" className="hover:underline">Terms of Service</Link>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
