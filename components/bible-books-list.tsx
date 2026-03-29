"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ScrollText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { uiText } from "@/lib/uiText";
import versionsDropDown from "./versions-drop-down";
import ChaptersList from "./chapters-list";
import { ThemeToggle } from "./theme-toggle";
import { SiteHeader } from "./site-header";

function summarizeDescription(description?: string) {
  if (!description) return "";
  const sentences = description.match(/[^.!?]+[.!?]+/g);
  if (!sentences) return description;
  return sentences.slice(0, 2).join(" ").trim();
}

function TestamentColumn({
  title,
  groups,
  language,
  version,
  book,
  chapter,
  aside,
  openBook,
  setOpenBook,
}) {
  return (
    <section className={`${aside ? "" : `section-shell section-light rounded-[1.75rem] p-5 sm:p-6`}`}>
      {aside ? null : (
        <>
      <p className="editorial-eyebrow mb-3">{title}</p>
      <div className="editorial-divider mb-6" />
        </>
      )}
      <div className="space-y-6">
        {groups.map((group, index) => (
          <div key={`${title}-${group.category}`}>
            {aside ? (
              <p className="mb-3 font-label text-[0.82rem] uppercase tracking-[0.24em] text-muted-foreground">
                {group.category}
              </p>
            ) : (
              <p className="mb-3 font-label text-[0.82rem] uppercase tracking-[0.24em] text-muted-foreground">
                {group.category}
              </p>
            )}
            <div className="space-y-2">
              {group.books.map((bookInfo) => {
                const isOpen = bookInfo.slug === openBook;
                const isActive = bookInfo.slug === book;

                return (
                  <div
                    key={bookInfo.slug}
                    className={`rounded-[1.2rem] ${
                      aside
                        ? isActive
                          ? "bg-accent/10 ring-1 ring-accent/28"
                          : "bg-transparent"
                        : `${isActive ? "border-accent/50" : "border-border/60"} border bg-background/40`
                    } px-3 py-3`}
                  >
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between gap-3 text-left ${language == "Arabic" ? "text-xl" : "text-base"}`}
                      onClick={() => setOpenBook(isOpen ? null : bookInfo.slug)}
                    >
                      <span className="font-display text-2xl text-foreground">{bookInfo.n}</span>
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 text-accent" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1400px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <ChaptersList
                        language={language}
                        version={version}
                        book={bookInfo.slug}
                        chaptersCount={bookInfo.c}
                        chapter={bookInfo.slug === book ? chapter : null}
                        aside={aside}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {index < groups.length - 1 && <Separator className="mt-5 bg-border/70" />}
          </div>
        ))}
      </div>
    </section>
  );
}

export function BibleBooksList({ language, versions, version, book, chapter, booksCategorized, aside }) {
  const [openBook, setOpenBook] = useState(book);
  const versionInfo = versions?.find((entry) => entry.id === version);
  const text = uiText[language];
  const shortDescription = summarizeDescription(versionInfo?.desc);
  const siblingVersions = versions?.filter((entry) => entry.id !== "study" && entry.id !== version) ?? [];

  if (aside) {
    return (
      <div className={`${language == "Arabic" ? "[direction:rtl]" : ""} space-y-6`}>
        <TestamentColumn
          title={uiText[language].oldTestament}
          groups={booksCategorized.oldTestament}
          language={language}
          version={version}
          book={book}
          chapter={chapter}
          aside={aside}
          openBook={openBook}
          setOpenBook={setOpenBook}
        />
        <TestamentColumn
          title={uiText[language].newTestament}
          groups={booksCategorized.newTestament}
          language={language}
          version={version}
          book={book}
          chapter={chapter}
          aside={aside}
          openBook={openBook}
          setOpenBook={setOpenBook}
        />
      </div>
    );
  }

  return (
    <div className={`page-shell px-4 py-8 sm:px-6 lg:px-8 ${language == "Arabic" ? "[direction:rtl]" : ""}`}>
      <div className="mx-auto max-w-7xl space-y-8">
        <SiteHeader
          language={language}
          className="px-0 pt-0 sm:px-0"
          maxWidthClassName="max-w-7xl"
          title={
            <div>
              <p className="editorial-eyebrow">{text.translationLibrary}</p>
              <p className="font-display text-2xl leading-none text-foreground">{versionInfo?.name}</p>
            </div>
          }
          rightContent={
            <>
              <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
                <Link href={`/${version}`}>{text.library}</Link>
              </Button>
              <ThemeToggle />
            </>
          }
        />
        <section className="hero-panel rounded-[2rem] px-6 py-10 sm:px-10">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div>
              <p className="editorial-eyebrow mb-4">{text.translationLibrary}</p>
              <h1 className="max-w-3xl text-5xl leading-[0.95] text-[var(--parchment)] sm:text-6xl">
                {text.browseScripture} <em className="text-[var(--gold-pale)] not-italic">{text.testamentBookChapter}</em>.
              </h1>
              <div className="editorial-divider my-6" />
              <p className="max-w-3xl text-xl italic text-[rgba(245,240,232,0.72)]">
                {text.translationLibraryDesc}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {siblingVersions.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/${entry.id}`}
                    className="rounded-full border border-[rgba(240,217,138,0.22)] bg-white/6 px-4 py-2 font-label text-[0.82rem] uppercase tracking-[0.2em] text-[var(--gold-pale)] transition-all duration-200 hover:scale-[1.02] hover:bg-[rgba(240,217,138,0.12)] hover:text-[var(--parchment)]"
                  >
                    {entry.id}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-[1.6rem] bg-[rgba(245,240,232,0.92)] p-6 text-[var(--ink)] ring-1 ring-[rgba(240,217,138,0.18)] shadow-[0_24px_60px_rgba(6,16,35,0.18)]">
              <p className="editorial-eyebrow mb-3">{text.currentEdition}</p>
              <div>{versionsDropDown(versions, version, null, null, null, false)}</div>
              <h2 className="mt-5 text-3xl text-[var(--ink)]">{versionInfo?.name}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {versionInfo?.year ? (
                  <span className="rounded-full bg-[rgba(200,150,58,0.12)] px-3 py-1 font-label text-[0.78rem] uppercase tracking-[0.18em] text-accent">
                    {text.published} {versionInfo.year}
                  </span>
                ) : null}
                {versionInfo?.lang ? (
                  <span className="rounded-full bg-[rgba(122,110,90,0.08)] px-3 py-1 font-label text-[0.78rem] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {versionInfo.lang}
                  </span>
                ) : null}
              </div>
              {shortDescription ? <p className="mt-4 text-base leading-7 text-[var(--text-body)]">{shortDescription}</p> : null}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <TestamentColumn
            title={uiText[language].oldTestament}
            groups={booksCategorized.oldTestament}
            language={language}
            version={version}
            book={book}
            chapter={chapter}
            aside={aside}
            openBook={openBook}
            setOpenBook={setOpenBook}
          />
          <TestamentColumn
            title={uiText[language].newTestament}
            groups={booksCategorized.newTestament}
            language={language}
            version={version}
            book={book}
            chapter={chapter}
            aside={aside}
            openBook={openBook}
            setOpenBook={setOpenBook}
          />
        </section>

        {versionInfo?.copyright ? (
          <section className="section-shell rounded-[1.5rem] p-5">
            <div className="flex items-start gap-3">
              <ScrollText className="mt-1 h-4 w-4 text-accent" />
              <p className="text-sm italic text-muted-foreground">{versionInfo.copyright}</p>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
