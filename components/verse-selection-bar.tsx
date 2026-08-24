"use client";

import { useEffect, useState } from "react";
import { Check, Copy, MoreHorizontal, Share2, X } from "lucide-react";

type ShareStatus = "idle" | "copied" | "shared" | "error";

function getVerseUrl(verse: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("verse", verse);
  url.hash = verse;
  return url.toString();
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

export function VerseSelectionBar({
  reference,
  version,
  verse,
  verseText,
  onDetails,
  onClose,
}: {
  reference: string;
  version: string;
  verse: string;
  verseText: string;
  onDetails: () => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<ShareStatus>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function copyLink() {
    try {
      await copyToClipboard(getVerseUrl(verse));
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  async function shareVerse() {
    const url = getVerseUrl(verse);
    const shareData = {
      title: reference,
      text: `${verseText}\n${reference} (${version.toUpperCase()})`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setStatus("shared");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      }
      return;
    }

    await copyLink();
  }

  const announcement =
    status === "copied"
      ? "Verse link copied"
      : status === "shared"
        ? "Verse shared"
        : status === "error"
          ? "Sharing is unavailable. Try copying the link again."
          : "";

  return (
    <aside className="reader-verse-toolbar" role="toolbar" aria-label={`${reference} actions`}>
      <div className="reader-verse-toolbar-reference">
        <strong>{reference}</strong>
        <span>{version.toUpperCase()}</span>
      </div>
      <div className="reader-verse-toolbar-actions">
        <button type="button" className="reader-verse-toolbar-action" onClick={shareVerse} aria-label={`Share ${reference}`} title="Share verse">
          <Share2 aria-hidden="true" />
          <span>Share</span>
        </button>
        <button type="button" className="reader-verse-toolbar-action" onClick={copyLink} aria-label={`Copy link to ${reference}`} title="Copy verse link">
          {status === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          <span>{status === "copied" ? "Copied" : "Copy link"}</span>
        </button>
        <button type="button" className="reader-verse-toolbar-action" onClick={onDetails} aria-label={`Open details for ${reference}`} title="Verse details">
          <MoreHorizontal aria-hidden="true" />
          <span>Details</span>
        </button>
        <button type="button" className="reader-verse-toolbar-close" onClick={onClose} aria-label={`Clear ${reference} selection`} title="Close verse actions">
          <X aria-hidden="true" />
        </button>
      </div>
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </aside>
  );
}
