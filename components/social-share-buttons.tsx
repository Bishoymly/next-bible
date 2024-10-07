import { useState } from "react";
import { TooltipProvider } from "./ui/tooltip";
import { Button } from "./ui/button";
import { Facebook, Linkedin, Share2 } from "lucide-react";
import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { uiText } from "@/lib/uiText";

export default function SocialShareButtons({ language, version, book, chapter, verse, verseText }) {
  const [linkCopied, setLinkCopied] = useState(false);

  const shareUrl = window.location.href;
  const shareText = `${book} ${chapter}:${verse} ${verseText}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <div className="flex mt-4 gap-2">
        <Button variant="outline" size="icon" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")}>
          <Facebook className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank")}>
          <TwitterLogoIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, "_blank")}
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleCopyLink}>
          {linkCopied ? <span className="text-xs">{uiText[language].linkCopied}</span> : <Share2 className="h-4 w-4" />}
        </Button>
      </div>
    </TooltipProvider>
  );
}
