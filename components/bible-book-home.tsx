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
    <div className={`page-shell min-h-screen ${isArabic ? `[direction:rtl] ${amiri.className}` : "[direction:ltr]"}`}>
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
                <p className="font-display text-2xl leading-none text-foreground">{bookInfo.n}</p>
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
              <section className="hero-panel rounded-[2rem] px-6 py-10 sm:px-10">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_20rem]">
                  <div>
                    <p className="editorial-eyebrow mb-4">{text.overview}</p>
                    <h2 className="text-5xl leading-[0.95] text-[var(--parchment)] sm:text-6xl">{bookInfo.n}</h2>
                    <div className="editorial-divider my-6" />
                    <div className="space-y-5 text-lg text-[rgba(245,240,232,0.76)]">
                      {curation.overviewParagraphs.map((text, i) => (
                        <p key={i} className={i === 0 ? "scripture-dropcap" : ""}>
                          {text}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.6rem] bg-white/8 p-6 text-[var(--parchment)] ring-1 ring-[rgba(240,217,138,0.14)]">
                    <p className="editorial-eyebrow mb-4">{text.chapters}</p>
                    <h3 className="text-4xl text-[var(--parchment)]">{bookInfo.c} {text.chapters}</h3>
                    <p className="mt-3 text-lg text-[rgba(245,240,232,0.82)]">
                      {text.startWithIntroduction}
                    </p>
                    <div className="mt-6 grid grid-cols-4 gap-2">
                      {Array.from({ length: Math.min(bookInfo.c, 12) }, (_, i) => i + 1).map((chapterNumber) => (
                        <Button
                          key={chapterNumber}
                          variant="outline"
                          size="sm"
                          className="border-none bg-[rgba(255,255,255,0.9)] text-[var(--navy-deep)] shadow-none ring-1 ring-[rgba(255,255,255,0.12)] hover:bg-[var(--gold-pale)] hover:text-[var(--navy-deep)]"
                          asChild
                        >
                          <Link href={`/${version}/${book}/${chapterNumber}`}>{chapterNumber}</Link>
                        </Button>
                      ))}
                    </div>
                    {bookInfo.c > 12 ? (
                      <p className="mt-4 text-base text-[rgba(245,240,232,0.72)]">{text.fullChapterGridContinues}</p>
                    ) : null}
                  </div>
                </div>
              </section>

              <section className="section-shell section-light rounded-[1.75rem] p-6 sm:p-8">
                <p className="editorial-eyebrow mb-3">{text.sections}</p>
                <h2 className="text-4xl text-[var(--ink)] sm:text-5xl">{text.majorMovementsIn} {bookInfo.n}</h2>
                <div className="editorial-divider my-6" />
                <div className="grid gap-4 md:grid-cols-2">
                  {curation.sections.map((group) => (
                    <Link
                      key={group.title}
                      href={`/${version}/${book}/${group.fromChapter}`}
                      className="rounded-[1.3rem] bg-white/56 p-5 ring-1 ring-[rgba(122,110,90,0.16)] transition-all duration-200 hover:scale-[1.01] hover:bg-[rgba(240,217,138,0.14)] hover:ring-[var(--gold)]"
                    >
                      <p className="font-display text-3xl leading-none text-[var(--ink)]">{group.title}</p>
                      <p className="mt-2 text-base uppercase tracking-[0.16em] text-[var(--text-muted)]">
                        {group.fromChapter === group.toChapter ? `${text.chapterLabel} ${group.fromChapter}` : `${text.chapters} ${group.fromChapter}-${group.toChapter}`}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="section-shell rounded-[1.75rem] p-6 sm:p-8">
                <p className="editorial-eyebrow mb-3">{text.chapters}</p>
                <h2 className="text-4xl text-foreground sm:text-5xl">{text.enterTheText}</h2>
                <div className="editorial-divider my-6" />
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
                  {Array.from({ length: bookInfo.c }, (_, i) => i + 1).map((chapterNumber) => (
                    <Button
                      key={chapterNumber}
                      variant="outline"
                      className="h-12 rounded-[1.1rem] border-none bg-background/26 text-base shadow-none ring-1 ring-border/26 hover:bg-[rgba(200,150,58,0.14)] hover:text-accent"
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
