"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/lib/blogPosts";

interface NewsFilterProps {
  posts: BlogPost[];
}

export default function NewsFilter({ posts }: NewsFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(posts.map(post => post.category)));
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  const handleShare = (platform: string, title: string, slug: string) => {
    const url = `${window.location.origin}/news/${slug}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="rounded-full"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-muted">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="font-medium">
                  {post.category}
                </Badge>
                <div className="flex items-center text-muted-foreground text-xs font-medium">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  {post.date}
                </div>
              </div>
              <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors">
                <Link href={`/news/${post.slug}`} className="hover:underline focus:outline-none">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p 
                className="text-muted-foreground text-sm leading-relaxed line-clamp-4"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            </CardContent>
            <CardFooter className="pt-0 flex justify-between items-center">
              <Link href={`/news/${post.slug}`}>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto hover:bg-transparent hover:text-primary group flex items-center gap-2"
                >
                  Read Article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-[#1877F2]" 
                  title="Share on Facebook"
                  onClick={() => handleShare('facebook', post.title, post.slug)}
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-[#1DA1F2]" 
                  title="Share on Twitter"
                  onClick={() => handleShare('twitter', post.title, post.slug)}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-[#0A66C2]" 
                  title="Share on LinkedIn"
                  onClick={() => handleShare('linkedin', post.title, post.slug)}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
