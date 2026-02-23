import { blogPosts } from "@/lib/blogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Tag, Share2, Facebook, Twitter, Linkedin, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${post.title} - endurocide® NZ News`,
    description: post.excerpt,
    keywords: `endurocide, ${post.category}, infection control, hospital curtains`,
    openGraph: {
      title: `${post.title} - endurocide® NZ News`,
      description: post.excerpt,
      url: `https://endurocide.nz/news/${post.slug}`,
      siteName: "Endurocide NZ",
      locale: "en_NZ",
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: ["Endurocide NZ"],
      section: post.category,
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function Article({ params }: PageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Get related articles (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);
    
  // If not enough related posts in same category, fill with recent posts
  if (relatedPosts.length < 3) {
    const otherPosts = blogPosts
      .filter(p => p.id !== post.id && !relatedPosts.find(rp => rp.id === p.id))
      .slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...otherPosts);
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": new Date(post.date).toISOString(),
            "articleSection": post.category,
            "description": post.excerpt,
            "author": {
              "@type": "Organization",
              "name": "endurocide New Zealand"
            }
          }),
        }}
      />

      <div className="container max-w-[1000px] mx-auto px-4">
        <Link href="/news">
          <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Button>
        </Link>

        <article className="bg-card rounded-xl border shadow-sm overflow-hidden mb-16">
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1 bg-secondary/50 px-3 py-1 rounded-full text-secondary-foreground">
                <Tag className="h-3 w-3" /> {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {post.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="prose prose-lg max-w-none text-muted-foreground">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="font-medium text-foreground flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Share this article:
              </span>
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="flex flex-col h-full hover:shadow-md transition-all duration-300 border-muted">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="font-medium text-xs">
                        {relatedPost.category}
                      </Badge>
                      <div className="flex items-center text-muted-foreground text-[10px] font-medium">
                        <Calendar className="h-3 w-3 mr-1" />
                        {relatedPost.date}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/news/${relatedPost.slug}`} className="hover:underline focus:outline-none">
                        {relatedPost.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-3">
                    <p 
                      className="text-muted-foreground text-xs leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: relatedPost.excerpt }}
                    />
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link href={`/news/${relatedPost.slug}`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="p-0 h-auto hover:bg-transparent hover:text-primary group flex items-center gap-1 text-xs font-medium"
                      >
                        Read Article <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
