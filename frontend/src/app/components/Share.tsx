"use client";
import React from "react";
import { Button } from "@/components/ui/button"; // Your custom Button
import { Share2 } from "lucide-react"; // Your icon

interface RWebShareProps {
  url: string;
  title: string;
  text: string;
}

export const ShareButton: React.FC<RWebShareProps> = ({ url, title, text }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.error("Web Share API is not supported in your browser.");
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
};
