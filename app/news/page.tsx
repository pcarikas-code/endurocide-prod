import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Facebook, Linkedin, Twitter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/blogPosts";
import Link from "next/link";
import type { Metadata } from "next";
import NewsFilter from "@/components/NewsFilter";

export const metadata: Metadata = {
  title: "Latest News & Infection Control Updates",
  description: "Stay updated with the latest news, research findings, and product announcements from endurocide® New Zealand.",
  keywords: "infection control news, healthcare updates, hospital hygiene blog, endurocide news",
  openGraph: {
    title: "Latest News & Infection Control Updates | Endurocide NZ",
    description: "Stay updated with the latest news, research findings, and product announcements from endurocide® New Zealand.",
    url: "https://endurocide.nz/news",
    siteName: "Endurocide NZ",
    locale: "en_NZ",
    type: "website",
  },
};

export default function News() {
  return (
    <div className="min-h-screen bg-background py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "blogPost": blogPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "datePublished": new Date(post.date).toISOString(),
              "articleSection": post.category,
              "description": post.excerpt,
              "author": {
                "@type": "Organization",
                "name": "endurocide New Zealand"
              }
            }))
          }),
        }}
      />
      <div className="container max-w-[1000px] mx-auto px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Insights & Updates</h1>
          <p className="text-lg text-muted-foreground">
            Latest perspectives on infection control, clinical research, and healthcare innovation.
          </p>
        </div>

        <NewsFilter posts={blogPosts} />
      </div>
    </div>
  );
}
