"use client";

import Link from "next/link";
import { uiText } from "@/lib/uiText";

export function SalvationGuideComponent({ language = "English" }) {
  const version = language === "Arabic" ? "avd" : "asv";
  const text = uiText[language];
  const verseText = text.salvationVerses ?? uiText.English.salvationVerses;
  const verseReferences = text.salvationReferences ?? uiText.English.salvationReferences;

  return (
    <div className="h-full px-1 py-1 sm:px-0 sm:py-0">
      <p className="editorial-eyebrow mb-3">{text.hope}</p>
      <h3 className="text-4xl text-[var(--ink)]">{text.pathToSalvation}</h3>
      <p className="mt-3 text-base text-[var(--text-muted)]">{text.salvationIntro}</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-[1.15rem] bg-white/45 p-4 ring-1 ring-[rgba(122,110,90,0.12)]">
          <h4 className="font-semibold text-accent">{text.recognizeNeed}</h4>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {verseText[0]} -
            <Link className="ml-1 text-accent hover:text-accent/80 hover:underline" href={`/${version}/romans/3#23`}>
              {verseReferences[0]}
            </Link>
          </p>
        </div>
        <div className="rounded-[1.15rem] bg-white/45 p-4 ring-1 ring-[rgba(122,110,90,0.12)]">
          <h4 className="font-semibold text-accent">{text.believeInJesus}</h4>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {verseText[1]} -
            <Link className="ml-1 text-accent hover:text-accent/80 hover:underline" href={`/${version}/john/3#16`}>
              {verseReferences[1]}
            </Link>
          </p>
        </div>
        <div className="rounded-[1.15rem] bg-white/45 p-4 ring-1 ring-[rgba(122,110,90,0.12)]">
          <h4 className="font-semibold text-accent">{text.confessRepent}</h4>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {verseText[2]} -
            <Link className="ml-1 text-accent hover:text-accent/80 hover:underline" href={`/${version}/1-john/1#9`}>
              {verseReferences[2]}
            </Link>
          </p>
        </div>
        <div className="rounded-[1.15rem] bg-white/45 p-4 ring-1 ring-[rgba(122,110,90,0.12)]">
          <h4 className="font-semibold text-accent">{text.acceptJesus}</h4>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {verseText[3]} -
            <Link className="ml-1 text-accent hover:text-accent/80 hover:underline" href={`/${version}/romans/10#9`}>
              {verseReferences[3]}
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-[1.2rem] bg-white/45 p-4 ring-1 ring-[rgba(122,110,90,0.12)]">
        <h4 className="mb-2 font-semibold text-accent">{text.prayerForSalvation}</h4>
        <p className="text-sm text-[var(--text-muted)]">{text.prayerText}</p>
      </div>
    </div>
  );
}
