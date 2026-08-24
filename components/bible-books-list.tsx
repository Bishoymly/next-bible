"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import ChaptersList from "@/components/chapters-list";
import { ReaderPageFooter } from "@/components/reader-page";
import { UtilityHeader } from "@/components/utility-header";
import versionsDropDown from "@/components/versions-drop-down";
import { uiText } from "@/lib/uiText";

type BookInfo = { slug: string; n: string; c: number };
type BookGroup = { category: string; books: BookInfo[] };
type CategorizedBooks = {
  oldTestament: BookGroup[];
  newTestament: BookGroup[];
};
type VersionInfo = {
  id: string;
  name: string;
  lang: keyof typeof uiText;
  desc?: string;
  year?: string | number;
};

function summarizeDescription(description?: string) {
  if (!description) return "Choose a book, then open its introduction or a chapter.";
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
}: {
  title: string;
  groups: BookGroup[];
  language: keyof typeof uiText;
  version: string;
  book: string | null;
  chapter: string | number | null;
  aside: boolean;
  openBook: string | null;
  setOpenBook: (book: string | null) => void;
}) {
  return (
    <section className={aside ? "reader-book-nav-testament" : "reader-testament"}>
      <h2>{title}</h2>
      <div className="reader-book-groups">
        {groups.map((group) => (
          <section key={`${title}-${group.category}`} className="reader-book-group">
            <h3>{group.category}</h3>
            <div>
              {group.books.map((bookInfo) => {
                const isOpen = bookInfo.slug === openBook;
                const isActive = bookInfo.slug === book;
                return (
                  <div
                    key={bookInfo.slug}
                    className={`reader-book-entry ${isActive ? "reader-book-entry-active" : ""}`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenBook(isOpen ? null : bookInfo.slug)}
                    >
                      <span>{bookInfo.n}</span>
                      {isOpen ? (
                        <ChevronDown aria-hidden="true" />
                      ) : (
                        <ChevronRight aria-hidden="true" />
                      )}
                    </button>
                    {isOpen ? (
                      <ChaptersList
                        language={language}
                        version={version}
                        book={bookInfo.slug}
                        chaptersCount={bookInfo.c}
                        chapter={bookInfo.slug === book ? chapter : null}
                        aside={aside}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

export function BibleBooksList({
  language,
  versions,
  version,
  book,
  chapter,
  booksCategorized,
  aside,
}: {
  language: keyof typeof uiText;
  versions: VersionInfo[];
  version: string;
  book: string | null;
  chapter: string | number | null;
  booksCategorized: CategorizedBooks;
  aside: boolean;
}) {
  const [openBook, setOpenBook] = useState<string | null>(book);
  const versionInfo = versions.find((entry) => entry.id === version);
  const text = uiText[language];

  if (aside) {
    return (
      <nav className="reader-book-nav" aria-label="Books and chapters">
        <TestamentColumn
          title={text.oldTestament}
          groups={booksCategorized.oldTestament}
          language={language}
          version={version}
          book={book}
          chapter={chapter}
          aside
          openBook={openBook}
          setOpenBook={setOpenBook}
        />
        <TestamentColumn
          title={text.newTestament}
          groups={booksCategorized.newTestament}
          language={language}
          version={version}
          book={book}
          chapter={chapter}
          aside
          openBook={openBook}
          setOpenBook={setOpenBook}
        />
      </nav>
    );
  }

  return (
    <div
      className="bible-reader-app reader-site-page reader-library-page"
      dir={language === "Arabic" ? "rtl" : "ltr"}
    >
      <UtilityHeader />
      <main className="reader-library-main">
        <header className="reader-library-intro">
          <div>
            <p>{versionInfo?.name}</p>
            <h1>Choose a book.</h1>
            <span>{summarizeDescription(versionInfo?.desc)}</span>
          </div>
          <div className="reader-library-edition">
            <span>Current translation</span>
            {versionsDropDown(versions, version, null, null, null, false)}
            <strong>{versionInfo?.name}</strong>
            {versionInfo?.year ? <small>Published {versionInfo.year}</small> : null}
          </div>
        </header>

        <div className="reader-testament-grid">
          <TestamentColumn
            title={text.oldTestament}
            groups={booksCategorized.oldTestament}
            language={language}
            version={version}
            book={book}
            chapter={chapter}
            aside={false}
            openBook={openBook}
            setOpenBook={setOpenBook}
          />
          <TestamentColumn
            title={text.newTestament}
            groups={booksCategorized.newTestament}
            language={language}
            version={version}
            book={book}
            chapter={chapter}
            aside={false}
            openBook={openBook}
            setOpenBook={setOpenBook}
          />
        </div>
      </main>
      <ReaderPageFooter />
    </div>
  );
}
