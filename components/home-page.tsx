"use client";

import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Layers3,
  LibraryBig,
  MessageCircleQuestion,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uiText } from "@/lib/uiText";
import { ChurchGuidanceComponent } from "./church-guidance";
import { SalvationGuideComponent } from "./salvation-guide";
import { GospelGuide } from "./gospel-guide";
import { ThemeToggle } from "./theme-toggle";
import { SiteHeader } from "./site-header";
const studyFeatureIcons = [LibraryBig, ScrollText, Layers3];

export function HomePageComponent({ language = "English" }) {
  const text = uiText[language];
  const readingPaths = text.readingPaths ?? uiText.English.readingPaths;
  const studyFeatures = (text.studyFeatures ?? uiText.English.studyFeatures).map((feature, index) => ({
    ...feature,
    icon: studyFeatureIcons[index],
  }));
  const shelfLinks = text.shelfLinks ?? uiText.English.shelfLinks;
  const readerHighlights = text.readerHighlights ?? uiText.English.readerHighlights;
  const primaryChapterHref = language === "Arabic" ? "/avd/genesis/1" : "/asv/genesis/1";
  const bookIntroductionHref = language === "Arabic" ? "/avd/john" : "/kjv/john";

  return (
    <div className="page-shell overflow-hidden">
      <SiteHeader
        language={language}
        rightContent={
          <>
            <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
              <Link href="/asv">{text.library}</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
              <Link href="https://ask.holybiblereader.com" target="_blank" rel="noopener noreferrer">
                {text.ask}
              </Link>
            </Button>
            <ThemeToggle />
          </>
        }
      />

      <main className="relative z-10 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="hero-panel rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_22rem]">
              <div className="max-w-4xl">
                <p className="editorial-eyebrow mb-5">{text.scriptureContextReverence}</p>
                <h1 className="max-w-4xl text-5xl leading-[0.95] text-[var(--parchment)] sm:text-6xl lg:text-[5.5rem]">
                  {text.homeHeroTitleStart} <em className="text-[var(--gold-pale)] not-italic">{text.homeHeroTitleAccent}</em> {text.homeHeroTitleEnd}
                </h1>
                <div className="editorial-divider my-8" />
                <p className="max-w-2xl text-xl italic text-[rgba(245,240,232,0.72)]">
                  {text.homeHeroBody}
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <Link href={readingPaths[0].href}>
                      {text.openStudyLibrary}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-[rgba(240,217,138,0.28)] bg-white/5 text-[var(--parchment)] hover:text-[var(--navy-deep)]">
                    <Link href="https://ask.holybiblereader.com" target="_blank" rel="noopener noreferrer">
                      <MessageCircleQuestion className="mr-2 h-4 w-4" />
                      {text.askBibleQuestion}
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-white/5 p-6 text-[var(--parchment)]">
                <p className="editorial-eyebrow mb-4">{text.readingPathsTitle}</p>
                <div className="space-y-4">
                  {readingPaths.map((path) => (
                    <Link
                      key={path.title}
                      href={path.href}
                      className="group block rounded-[1.25rem] bg-white/6 px-4 py-4 ring-1 ring-white/8 transition-all duration-200 hover:scale-[1.01] hover:bg-[rgba(240,217,138,0.08)] hover:ring-[rgba(240,217,138,0.3)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-2xl text-[var(--parchment)]">{path.title}</h2>
                        <ArrowRight className="h-4 w-4 text-[var(--gold)] group-hover:translate-x-0.5" />
                      </div>
                      <p className="mt-2 text-base text-[rgba(245,240,232,0.66)]">{path.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="section-shell rounded-[1.75rem] p-6 sm:p-8">
            <p className="editorial-eyebrow mb-3">{text.whyThisFeelsDifferent}</p>
            <h2 className="text-4xl text-foreground sm:text-5xl">{text.slowerDeeperStudy}</h2>
            <div className="editorial-divider my-6" />
            <div className="grid gap-4 md:grid-cols-3">
              {studyFeatures.map((feature) => (
                <article key={feature.title} className="rounded-[1.35rem] bg-background/35 p-5 ring-1 ring-border/40">
                  <feature.icon className="h-5 w-5 text-accent" />
                  <h3 className="mt-4 text-2xl text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-base text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="section-shell section-light rounded-[1.75rem] p-6 sm:p-8">
            <p className="editorial-eyebrow mb-3">{text.translationShelf}</p>
            <h2 className="text-4xl text-[var(--ink)] sm:text-5xl">{text.chooseReadingTradition}</h2>
            <div className="editorial-divider my-6" />
            <div className="space-y-3">
              {shelfLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-[1.2rem] bg-white/45 px-4 py-4 ring-1 ring-[rgba(122,110,90,0.14)] transition-all duration-200 hover:scale-[1.01] hover:bg-[rgba(240,217,138,0.16)] hover:ring-[var(--gold)]"
                >
                  <div>
                    <p className="font-display text-2xl leading-none text-[var(--ink)]">{link.label}</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{link.note}</p>
                  </div>
                  <Compass className="h-4 w-4 text-[var(--gold)]" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="section-shell section-light rounded-[1.75rem] p-6 sm:p-8">
            <p className="editorial-eyebrow mb-3">{text.beginHere}</p>
            <h2 className="text-4xl text-[var(--ink)] sm:text-5xl">{text.gentlePath}</h2>
            <div className="editorial-divider my-6" />
            <p className="text-lg text-[var(--text-body)]">
              {text.gentlePathBody}
            </p>
            <div className="cross-separator my-7">
              <span>✦</span>
            </div>
            <GospelGuide language={language} />
          </div>

          <div className="section-shell rounded-[1.75rem] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="editorial-eyebrow mb-3">{text.insideTheReader}</p>
                <h2 className="text-4xl text-foreground sm:text-5xl">{text.redesignedChapterExperience}</h2>
              </div>
              <Sparkles className="hidden h-5 w-5 text-accent md:block" />
            </div>
            <div className="editorial-divider my-6" />
            <p className="max-w-2xl text-lg text-muted-foreground">
              {text.chapterReadingDesc}
            </p>
            <div className="mt-6 grid gap-3">
              {readerHighlights.map((highlight) => (
                <div key={highlight} className="rounded-[1.15rem] bg-background/28 px-4 py-4 ring-1 ring-border/30">
                  <p className="text-base text-muted-foreground">{highlight}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={primaryChapterHref}>
                  {text.readAChapter}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={bookIntroductionHref}>
                  {text.openBookIntroduction}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="section-shell section-light rounded-[1.75rem] p-5 sm:p-6">
            <SalvationGuideComponent language={language} />
          </div>
          <div className="section-shell rounded-[1.75rem] p-5 sm:p-6">
            <ChurchGuidanceComponent language={language} />
          </div>
        </section>
      </main>
    </div>
  );
}
