"use client";

import { Check, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const shareDetails = {
  title: "The Gospel of Jesus Christ",
  text: "A concise, Scripture-grounded guide to the good news of Jesus Christ.",
};

export function GospelShareButton() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(true);

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ ...shareDetails, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await copyLink(url);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button
      type="button"
      className="reader-button reader-button-secondary"
      onClick={handleShare}
      aria-label={copied ? "Gospel link copied" : "Share the Gospel page"}
    >
      {copied ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Link copied" : "Share this page"}</span>
    </button>
  );
}
