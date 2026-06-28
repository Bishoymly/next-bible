"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ScrollText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "./ui/button";
import { uiText } from "@/lib/uiText";
import versionsDropDown from "./versions-drop-down";
import ChaptersList from "./chapters-list";
import { SiteHeader } from "./site-header";
import { cn } from "@/lib/utils";

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
                          ? "bg-muted ring-1 ring-border"
                          : "bg-transparent"
                        : `${isActive ? "border-foreground/30" : "border-border"} border bg-card`
                    } px-3 py-3`}
                  >
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between gap-3 text-left ${language == "Arabic" ? "text-lg" : "text-sm"}`}
                      onClick={() => setOpenBook(isOpen ? null : bookInfo.slug)}
                    >
                      <span className="text-base font-medium text-foreground">{bookInfo.n}</span>
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
      <div className="space-y-6" dir={language == "Arabic" ? "rtl" : "ltr"}>
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
    <div
      className="page-shell px-4 py-8 sm:px-6 lg:px-8"
      dir={language == "Arabic" ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <SiteHeader
          language={language}
          className="px-0 pt-0 sm:px-0"
          maxWidthClassName="max-w-7xl"
          libraryHref={`/${version}`}
          libraryLabel={text.library}
          title={
            <div>
              <p className="editorial-eyebrow">{text.translationLibrary}</p>
              <p className="font-display text-lg leading-none text-foreground">{versionInfo?.name}</p>
            </div>
          }
        />
        <section className="hero-panel rounded-xl px-6 py-10 sm:px-10">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div>
              <p className="editorial-eyebrow mb-3">{text.translationLibrary}</p>
              <h1 className="max-w-3xl text-2xl font-semibold leading-tight sm:text-3xl">
                {text.browseScripture} <span className="opacity-70">{text.testamentBookChapter}</span>.
              </h1>
              <div className="editorial-divider my-5" />
              <p className="max-w-3xl text-lg" style={{ color: "var(--hero-muted)" }}>
                {text.translationLibraryDesc}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {siblingVersions.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/${entry.id}`}
                    className="rounded-md border border-[var(--hero-muted)]/30 px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-[var(--hero-fg)]/10"
                  >
                    {entry.id}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-5 text-foreground">
              <p className="editorial-eyebrow mb-3">{text.currentEdition}</p>
              <div>{versionsDropDown(versions, version, null, null, null, false)}</div>
              <h2 className="mt-4 text-xl font-semibold">{versionInfo?.name}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {versionInfo?.year ? (
                  <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium uppercase tracking-wide">
                    {text.published} {versionInfo.year}
                  </span>
                ) : null}
                {versionInfo?.lang ? (
                  <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {versionInfo.lang}
                  </span>
                ) : null}
              </div>
              {shortDescription ? <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{shortDescription}</p> : null}
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
              <ScrollText className="mt-1 h-4 w-4 text-muted-foreground" />
              <p className="text-sm italic text-muted-foreground">{versionInfo.copyright}</p>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
