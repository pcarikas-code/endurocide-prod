"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
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
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 hover:text-[#1877F2] hover:border-[#1877F2]"
        onClick={() => handleShare('facebook')}
      >
        <Facebook className="h-4 w-4" /> Facebook
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 hover:text-[#1DA1F2] hover:border-[#1DA1F2]"
        onClick={() => handleShare('twitter')}
      >
        <Twitter className="h-4 w-4" /> Twitter
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 hover:text-[#0A66C2] hover:border-[#0A66C2]"
        onClick={() => handleShare('linkedin')}
      >
        <Linkedin className="h-4 w-4" /> LinkedIn
      </Button>
    </div>
  );
}
