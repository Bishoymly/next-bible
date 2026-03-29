"use client";

import Link from "next/link";
import { uiText } from "@/lib/uiText";

export function GospelGuide({ language = "English" }) {
  const entries = uiText[language]?.gospelEntries ?? uiText.English.gospelEntries;
  const descriptions = uiText[language]?.gospelDescriptions ?? uiText.English.gospelDescriptions;
  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div
          key={index}
          className="rounded-[1.15rem] bg-white/40 px-4 py-3 ring-1 ring-[rgba(122,110,90,0.12)]"
        >
          <div className="text-sm leading-6 text-[var(--text-body)]">
            <Link
              href={entry.href}
              className="font-display text-xl text-accent hover:text-accent/80"
            >
              {entry.label}
            </Link>
            <span className="ml-2 text-[var(--text-muted)]">{descriptions[index]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
