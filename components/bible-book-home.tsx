"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Menu } from "lucide-react";
import { Amiri } from "next/font/google";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BibleBooksList } from "@/components/bible-books-list";
import { uiText } from "@/lib/uiText";
import versionsDropDown from "./versions-drop-down";
import { ThemeToggle } from "./theme-toggle";
import { SiteHeader } from "./site-header";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export function BibleBookHome({ language, versions, version, book, curation, bookInfo, booksCategorized }) {
  const isArabic = language === "Arabic";
  const text = uiText[language];

  return (
    <div
      className={`page-shell min-h-screen ${isArabic ? amiri.className : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="grid min-h-screen lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className={`hidden border-border/80 bg-background/55 backdrop-blur lg:block ${isArabic ? "border-l" : "border-r"}`}>
          <ScrollArea className="h-screen scrollbar-thin px-4 py-6">
            <BibleBooksList
              language={language}
              versions={versions}
              version={version}
              book={book}
              chapter={null}
              booksCategorized={booksCategorized}
              aside={true}
            />
          </ScrollArea>
        </aside>

        <main className="relative min-w-0">
          <SiteHeader
            language={language}
            sticky={true}
            maxWidthClassName="w-full"
            title={
              <div>
                <p className="editorial-eyebrow">{text.bookIntroduction}</p>
                <p className="font-display text-lg leading-none text-foreground">{bookInfo.n}</p>
              </div>
            }
            rightContent={
              <>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side={isArabic ? "right" : "left"} className="w-[92vw] max-w-md border-border bg-background p-0">
                    <SheetTitle className="sr-only">{text.bibleNavigation}</SheetTitle>
                    <ScrollArea className="h-full px-4 py-6 scrollbar-thin">
                      <BibleBooksList
                        language={language}
                        versions={versions}
                        version={version}
                        book={book}
                        chapter={null}
                        booksCategorized={booksCategorized}
                        aside={true}
                      />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
                <Button variant="ghost" asChild className="hidden md:inline-flex">
                  <Link href={`/${version}/${bookInfo.previousBook?.slug}`}>
                    {isArabic ? <ArrowRight className="mr-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                    {bookInfo.previousBook?.n}
                  </Link>
                </Button>
                {versionsDropDown(versions, version, book, null, null, false)}
                <Button variant="ghost" asChild className="hidden md:inline-flex">
                  <Link href={`/${version}/${bookInfo.nextBook?.slug}`}>
                    {bookInfo.nextBook?.n}
                    {isArabic ? <ArrowLeft className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                  </Link>
                </Button>
                <ThemeToggle />
              </>
            }
          />

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-8">
              <section className="hero-panel rounded-xl px-6 py-10 sm:px-10">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_20rem]">
                  <div>
                    <p className="editorial-eyebrow mb-3">{text.overview}</p>
                    <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">{bookInfo.n}</h2>
                    <div className="editorial-divider my-5" />
                    <div className="space-y-4 text-base" style={{ color: "var(--hero-muted)" }}>
                      {curation.overviewParagraphs.map((text, i) => (
                        <p key={i} className={i === 0 ? "scripture-dropcap" : ""}>
                          {text}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[var(--hero-muted)]/30 p-5">
                    <p className="editorial-eyebrow mb-3">{text.chapters}</p>
                    <h3 className="text-2xl font-semibold">{bookInfo.c} {text.chapters}</h3>
                    <p className="mt-2 text-sm" style={{ color: "var(--hero-muted)" }}>
                      {text.startWithIntroduction}
                    </p>
                    <div className="mt-5 grid grid-cols-4 gap-2">
                      {Array.from({ length: Math.min(bookInfo.c, 12) }, (_, i) => i + 1).map((chapterNumber) => (
                        <Button
                          key={chapterNumber}
                          variant="outline"
                          size="sm"
                          className="border-[var(--hero-muted)]/30 bg-[var(--hero-fg)] text-[var(--hero-bg)] hover:bg-[var(--hero-fg)]/90"
                          asChild
                        >
                          <Link href={`/${version}/${book}/${chapterNumber}`}>{chapterNumber}</Link>
                        </Button>
                      ))}
                    </div>
                    {bookInfo.c > 12 ? (
                      <p className="mt-3 text-sm" style={{ color: "var(--hero-muted)" }}>{text.fullChapterGridContinues}</p>
                    ) : null}
                  </div>
                </div>
              </section>

              <section className="section-shell section-light rounded-xl p-6 sm:p-8">
                <p className="editorial-eyebrow mb-2">{text.sections}</p>
                <h2 className="text-xl font-semibold sm:text-2xl">{text.majorMovementsIn} {bookInfo.n}</h2>
                <div className="editorial-divider my-5" />
                <div className="grid gap-3 md:grid-cols-2">
                  {curation.sections.map((group) => (
                    <Link
                      key={group.title}
                      href={`/${version}/${book}/${group.fromChapter}`}
                      className="rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                    >
                      <p className="text-lg font-medium">{group.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                        {group.fromChapter === group.toChapter ? `${text.chapterLabel} ${group.fromChapter}` : `${text.chapters} ${group.fromChapter}-${group.toChapter}`}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="section-shell rounded-xl p-6 sm:p-8">
                <p className="editorial-eyebrow mb-2">{text.chapters}</p>
                <h2 className="text-xl font-semibold sm:text-2xl">{text.enterTheText}</h2>
                <div className="editorial-divider my-5" />
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                  {Array.from({ length: bookInfo.c }, (_, i) => i + 1).map((chapterNumber) => (
                    <Button
                      key={chapterNumber}
                      variant="outline"
                      className="h-10"
                      asChild
                    >
                      <Link href={`/${version}/${book}/${chapterNumber}`}>{chapterNumber}</Link>
                    </Button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
