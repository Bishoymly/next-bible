import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Layers3,
  LibraryBig,
  MessageCircleQuestion,
  ScrollText,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { uiText } from "@/lib/uiText";
import { ChurchGuidanceComponent } from "./church-guidance";
import { SalvationGuideComponent } from "./salvation-guide";
import { GospelGuide } from "./gospel-guide";
import { SiteHeader } from "./site-header";
import { cn } from "@/lib/utils";

const studyFeatureIcons = [LibraryBig, ScrollText, Layers3];

type HomeLanguage = keyof typeof uiText;

export function HomePageComponent({ language = "English" }: { language?: HomeLanguage }) {
  const text = uiText[language];
  const readingPaths = text.readingPaths ?? uiText.English.readingPaths;
  const studyFeatures = (text.studyFeatures ?? uiText.English.studyFeatures).map((feature, index) => ({
    ...feature,
    icon: studyFeatureIcons[index],
  }));
  const shelfLinks = text.shelfLinks ?? uiText.English.shelfLinks;
  const readerHighlights = text.readerHighlights ?? uiText.English.readerHighlights;
  const primaryChapterHref = language === "Arabic" ? "/avd/genesis/1" : "/bsb/genesis/1";
  const bookIntroductionHref = language === "Arabic" ? "/avd/john" : "/bsb/john";

  return (
    <div className="page-shell">
      <SiteHeader
        language={language}
        libraryHref="/bsb"
        libraryLabel={text.library}
        askLabel={text.ask}
      />

      <main className="relative z-10 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl">
          <div className="hero-panel rounded-xl px-6 py-12 sm:px-10 sm:py-16">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_20rem]">
              <div className="max-w-2xl">
                <p className="editorial-eyebrow mb-4">{text.scriptureContextReverence}</p>
                <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  {text.homeHeroTitleStart}{" "}
                  <span className="opacity-70">{text.homeHeroTitleAccent}</span>{" "}
                  {text.homeHeroTitleEnd}
                </h1>
                <div className="editorial-divider my-6" />
                <p className="max-w-xl text-lg" style={{ color: "var(--hero-muted)" }}>
                  {text.homeHeroBody}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={readingPaths[0].href}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "bg-[var(--hero-fg)] text-[var(--hero-bg)] hover:bg-[var(--hero-fg)]/90"
                    )}
                  >
                    {text.openStudyLibrary}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="https://ask.holybiblereader.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "outline" }),
                      "border-[var(--hero-muted)] bg-transparent text-[var(--hero-fg)] hover:bg-[var(--hero-fg)]/10"
                    )}
                  >
                    <MessageCircleQuestion className="mr-2 h-4 w-4" />
                    {text.askBibleQuestion}
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border border-[var(--hero-muted)]/30 p-5">
                <p className="editorial-eyebrow mb-4">{text.readingPathsTitle}</p>
                <div className="space-y-3">
                  {readingPaths.map((path) => (
                    <Link
                      key={path.title}
                      href={path.href}
                      className="group block rounded-md border border-[var(--hero-muted)]/20 px-4 py-3 transition-colors hover:bg-[var(--hero-fg)]/5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-medium">{path.title}</h2>
                        <ArrowRight className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 text-sm" style={{ color: "var(--hero-muted)" }}>
                        {path.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
          <div className="section-shell rounded-xl p-6 sm:p-8">
            <p className="editorial-eyebrow mb-2">{text.whyThisFeelsDifferent}</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">{text.slowerDeeperStudy}</h2>
            <div className="editorial-divider my-5" />
            <div className="grid gap-4">
              {studyFeatures.map((feature) => (
                <article key={feature.title} className="rounded-lg border border-border p-4">
                  <feature.icon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="mt-3 text-lg font-medium">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="section-shell section-light rounded-xl p-6 sm:p-8">
            <p className="editorial-eyebrow mb-2">{text.translationShelf}</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">{text.chooseReadingTradition}</h2>
            <div className="editorial-divider my-5" />
            <div className="space-y-2">
              {shelfLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted"
                >
                  <div>
                    <p className="font-medium">{link.label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{link.note}</p>
                  </div>
                  <Compass className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
          <div className="section-shell section-light rounded-xl p-6 sm:p-8">
            <p className="editorial-eyebrow mb-2">{text.beginHere}</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">{text.gentlePath}</h2>
            <div className="editorial-divider my-5" />
            <p className="text-muted-foreground">{text.gentlePathBody}</p>
            <div className="my-6 border-t border-border" />
            <GospelGuide language={language} />
          </div>

          <div className="section-shell rounded-xl p-6 sm:p-8">
            <p className="editorial-eyebrow mb-2">{text.insideTheReader}</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">{text.redesignedChapterExperience}</h2>
            <div className="editorial-divider my-5" />
            <p className="text-muted-foreground">{text.chapterReadingDesc}</p>
            <div className="mt-5 space-y-2">
              {readerHighlights.map((highlight) => (
                <div key={highlight} className="rounded-lg border border-border px-4 py-3">
                  <p className="text-sm text-muted-foreground">{highlight}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={primaryChapterHref} className={cn(buttonVariants())}>
                {text.readAChapter}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href={bookIntroductionHref} className={cn(buttonVariants({ variant: "outline" }))}>
                {text.openBookIntroduction}
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
          <div className="section-shell section-light rounded-xl p-5 sm:p-6">
            <SalvationGuideComponent language={language} />
          </div>
          <div className="section-shell rounded-xl p-5 sm:p-6">
            <ChurchGuidanceComponent language={language} />
          </div>
        </section>
      </main>
    </div>
  );
}
