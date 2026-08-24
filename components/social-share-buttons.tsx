"use client";

import { useState } from "react";
import { TooltipProvider } from "./ui/tooltip";
import { Button } from "./ui/button";
import { Check, Facebook, Link2, Linkedin } from "lucide-react";
import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { uiText } from "@/lib/uiText";

export default function SocialShareButtons({ language, version, book, chapter, verse, verseText }: { language: string; version: string; book: string; chapter: string; verse: string; verseText: string }) {
  const [linkCopied, setLinkCopied] = useState(false);

  const shareText = `${book} ${chapter}:${verse} (${version.toUpperCase()}) ${verseText}`;

  function getShareUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("verse", verse);
    url.hash = verse;
    return url.toString();
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl());
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  function openShareWindow(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <TooltipProvider>
      <div className="flex mt-4 gap-2">
        <Button type="button" variant="outline" size="icon" aria-label={`Share ${book} ${chapter}:${verse} on Facebook`} title="Share on Facebook" onClick={() => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`)}>
          <Facebook className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button type="button" variant="outline" size="icon" aria-label={`Share ${book} ${chapter}:${verse} on X`} title="Share on X" onClick={() => openShareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getShareUrl())}`)}>
          <TwitterLogoIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Share ${book} ${chapter}:${verse} on LinkedIn`}
          title="Share on LinkedIn"
          onClick={() => openShareWindow(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(getShareUrl())}&title=${encodeURIComponent(shareText)}`)}
        >
          <Linkedin className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={handleCopyLink} aria-label={linkCopied ? uiText[language].linkCopied : `Copy link to ${book} ${chapter}:${verse}`} title="Copy verse link">
          {linkCopied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
        </Button>
        <span className="sr-only" aria-live="polite">{linkCopied ? uiText[language].linkCopied : ""}</span>
      </div>
    </TooltipProvider>
  );
}
