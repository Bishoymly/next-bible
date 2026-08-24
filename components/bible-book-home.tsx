"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Menu } from "lucide-react";
import { Amiri } from "next/font/google";

import { BibleBooksList } from "@/components/bible-books-list";
import { ReaderPageFooter } from "@/components/reader-page";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UtilityHeader } from "@/components/utility-header";
import versionsDropDown from "@/components/versions-drop-down";
import { uiText } from "@/lib/uiText";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export function BibleBookHome({
  language,
  versions,
  version,
  book,
  curation,
  bookInfo,
  booksCategorized,
}) {
  const isArabic = language === "Arabic";
  const text = uiText[language];

  return (
    <div
      className={`bible-reader-app reader-site-page reader-book-page ${isArabic ? amiri.className : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <UtilityHeader />
      <div className="reader-book-layout">
        <aside className="reader-book-sidebar">
          <ScrollArea className="reader-book-sidebar-scroll">
            <BibleBooksList
              language={language}
              versions={versions}
              version={version}
              book={book}
              chapter={null}
              booksCategorized={booksCategorized}
              aside
            />
          </ScrollArea>
        </aside>

        <main className="reader-book-main">
          <header className="reader-book-intro">
            <div className="reader-book-context">
              <div>
                <span>{text.bookIntroduction}</span>
                <strong>{versions.find((item) => item.id === version)?.name}</strong>
              </div>
              <div className="reader-book-context-actions">
                <Sheet>
                  <SheetTrigger asChild>
                    <button type="button" className="reader-book-menu-button">
                      <Menu aria-hidden="true" />
                      Books
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side={isArabic ? "right" : "left"}
                    className="w-[92vw] max-w-md border-border bg-background p-0"
                  >
                    <SheetTitle className="sr-only">{text.bibleNavigation}</SheetTitle>
                    <ScrollArea className="h-full px-5 py-7">
                      <BibleBooksList
                        language={language}
                        versions={versions}
                        version={version}
                        book={book}
                        chapter={null}
                        booksCategorized={booksCategorized}
                        aside
                      />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
                {versionsDropDown(
                  versions,
                  version,
                  book,
                  null,
                  null,
                  false,
                  Object.fromEntries(
                    versions.map((item) => [
                      item.id,
                      bookInfo.translationSlugs?.[item.id] ?? book,
                    ])
                  )
                )}
              </div>
            </div>

            <h1>{bookInfo.n}</h1>
            <div className="reader-book-overview">
              {curation.overviewParagraphs.slice(0, 1).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="reader-page-actions">
              <Link
                className="reader-button reader-button-primary"
                href={`/${version}/${book}/1`}
              >
                Read chapter 1
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </header>

          {curation.overviewParagraphs.length > 1 ? (
            <section className="reader-book-section" aria-labelledby="book-context-title">
              <div className="reader-page-section-heading">
                <h2 id="book-context-title">Context for reading</h2>
              </div>
              <div className="reader-book-overview reader-book-context-copy">
                {curation.overviewParagraphs.slice(1).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ) : null}

          <section className="reader-book-section" aria-labelledby="movements-title">
            <div className="reader-page-section-heading">
              <h2 id="movements-title">Major movements</h2>
              <p>Follow the structure of {bookInfo.n} from beginning to end.</p>
            </div>
            <div className="reader-book-movements">
              {curation.sections.map((group) => (
                <Link
                  key={group.title}
                  href={`/${version}/${book}/${group.fromChapter}`}
                >
                  <span>
                    <strong>{group.title}</strong>
                    <small>
                      {group.fromChapter === group.toChapter
                        ? `${text.chapterLabel} ${group.fromChapter}`
                        : `${text.chapters} ${group.fromChapter}-${group.toChapter}`}
                    </small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          <section className="reader-book-section" aria-labelledby="chapters-title">
            <div className="reader-page-section-heading">
              <h2 id="chapters-title">Choose a chapter</h2>
              <p>Open the biblical text with study and comparison tools close by.</p>
            </div>
            <div className="reader-book-chapters">
              {Array.from({ length: bookInfo.c }, (_, index) => index + 1).map(
                (chapterNumber) => (
                  <Link
                    key={chapterNumber}
                    href={`/${version}/${book}/${chapterNumber}`}
                  >
                    {chapterNumber}
                  </Link>
                )
              )}
            </div>
          </section>

          <nav className="reader-book-neighbors" aria-label="Adjacent books">
            <Link href={`/${version}/${bookInfo.previousBook?.slug}`}>
              {isArabic ? (
                <ArrowRight aria-hidden="true" />
              ) : (
                <ArrowLeft aria-hidden="true" />
              )}
              <span>
                <small>Previous book</small>
                <strong>{bookInfo.previousBook?.n}</strong>
              </span>
            </Link>
            <Link href={`/${version}/${bookInfo.nextBook?.slug}`}>
              <span>
                <small>Next book</small>
                <strong>{bookInfo.nextBook?.n}</strong>
              </span>
              {isArabic ? (
                <ArrowLeft aria-hidden="true" />
              ) : (
                <ArrowRight aria-hidden="true" />
              )}
            </Link>
          </nav>
        </main>
      </div>
      <ReaderPageFooter />
    </div>
  );
}
