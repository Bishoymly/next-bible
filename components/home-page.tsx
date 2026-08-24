import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Columns2,
  NotebookPen,
  Search,
} from "lucide-react";

import { RecentReadingList } from "@/components/recent-reading";
import { UtilityHeader } from "@/components/utility-header";

type HomeLanguage = "English" | "Spanish" | "Arabic";

const mainBooks = [
  {
    reference: "John",
    title: "Meet Jesus through his signs, teaching, death, and resurrection",
    href: "/bsb/john/1",
  },
  {
    reference: "Genesis",
    title: "Begin with creation, promise, covenant, and the family of Abraham",
    href: "/bsb/genesis/1",
  },
  {
    reference: "Psalms",
    title: "Pray through praise, grief, trust, repentance, and hope",
    href: "/bsb/psalms/1",
  },
  {
    reference: "Romans",
    title: "Follow Paul's explanation of sin, grace, faith, and new life",
    href: "/bsb/romans/1",
  },
];

const studyFeatures = [
  {
    title: "Compare translations",
    description: "Keep another translation beside the chapter.",
    icon: Columns2,
  },
  {
    title: "Follow the passage",
    description: "Use section headings and study notes as a guide.",
    icon: BookOpenText,
  },
  {
    title: "Keep it private",
    description: "Bookmarks and notes stay in this browser.",
    icon: NotebookPen,
  },
];

const translations = [
  {
    label: "Berean Standard Bible",
    note: "Modern English",
    href: "/bsb",
  },
  {
    label: "American Standard Version",
    note: "Formal English",
    href: "/asv",
  },
  {
    label: "King James Version",
    note: "Historic English",
    href: "/kjv",
  },
  {
    label: "Arabic Van Dyck",
    note: "Classic Arabic",
    href: "/avd",
  },
];

export function HomePageComponent({
  language = "English",
}: {
  language?: HomeLanguage;
}) {
  const primaryTranslation = language === "Arabic" ? "avd" : "bsb";
  const primaryChapterHref = `/${primaryTranslation}/john/1`;

  return (
    <div
      className="bible-reader-app home-reader-app"
      dir={language === "Arabic" ? "rtl" : "ltr"}
    >
      <UtilityHeader />

      <main className="home-reader-main">
        <section className="home-reader-hero" aria-labelledby="home-title">
          <div className="home-reader-hero-copy">
            <h1 id="home-title">The Bible, with room to read.</h1>
            <p>
              Read Scripture first. Bring translations, context, and study
              notes alongside only when you need them.
            </p>
            <div className="home-reader-actions">
              <Link href={`/${primaryTranslation}`} className="home-reader-primary">
                Browse all books
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link href={primaryChapterHref} className="home-reader-secondary">
                Start with John
              </Link>
            </div>
          </div>

          <Link className="home-reader-passage-preview" href="/bsb/john/1">
            <span className="home-reader-passage-label">John 1:1</span>
            <blockquote>
              In the beginning was the Word, and the Word was with God, and the
              Word was God.
            </blockquote>
            <span className="home-reader-passage-link">
              Read John 1
              <ArrowRight aria-hidden="true" />
            </span>
          </Link>
        </section>

        <section className="home-reader-search" aria-labelledby="search-title">
          <div>
            <h2 id="search-title">Search Scripture</h2>
            <p>Find a word, phrase, or passage in the biblical text.</p>
          </div>
          <form action="/search" method="get">
            <Search aria-hidden="true" />
            <label className="sr-only" htmlFor="home-scripture-search">
              Search Scripture
            </label>
            <input
              id="home-scripture-search"
              name="q"
              dir="auto"
              type="search"
              placeholder="Try “grace and truth”"
            />
            <button type="submit" aria-label="Search Scripture">
              <ArrowRight aria-hidden="true" />
            </button>
          </form>
        </section>

        <RecentReadingList />

        <section className="home-reader-guide" aria-label="Reading and study">
          <div className="home-reader-section">
            <div className="home-reader-section-heading">
              <p>Choose a starting point</p>
              <h2>Begin with a main book</h2>
            </div>
            <div className="home-reader-list">
              {mainBooks.map((passage) => (
                <Link
                  key={passage.reference}
                  href={passage.href}
                  className="home-reader-row"
                >
                  <span>
                    <strong>{passage.reference}</strong>
                    <small>{passage.title}</small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
            <Link className="home-reader-inline-link" href={`/${primaryTranslation}`}>
              Browse all 66 books
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="home-reader-section">
            <div className="home-reader-section-heading">
              <p>When you want context</p>
              <h2>Study without leaving the text</h2>
            </div>
            <div className="home-reader-list">
              {studyFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div className="home-reader-feature" key={feature.title}>
                    <Icon aria-hidden="true" />
                    <span>
                      <strong>{feature.title}</strong>
                      <small>{feature.description}</small>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="home-reader-gospel" aria-labelledby="gospel-title">
          <div className="home-reader-section-heading">
            <p>The heart of the Christian message</p>
            <h2 id="gospel-title">The Gospel</h2>
          </div>
          <div>
            <p>
              God made us for himself, but sin separates us from him. Jesus
              Christ lived without sin, died for sinners, and rose again. God
              freely forgives and gives new life to everyone who turns to
              Christ and trusts in him.
            </p>
            <div className="home-reader-gospel-actions">
              <Link href="/gospel">
                Read the Gospel guide
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="/bsb/john/3">Read John 3</Link>
            </div>
          </div>
        </section>

        <section
          className="home-reader-translations"
          aria-labelledby="translations-title"
        >
          <div className="home-reader-section-heading">
            <p>Read in your language</p>
            <h2 id="translations-title">Choose a translation</h2>
          </div>
          <div className="home-reader-translation-grid">
            {translations.map((translation) => (
              <Link
                key={translation.label}
                href={translation.href}
                className="home-reader-translation"
              >
                <span>
                  <strong>{translation.label}</strong>
                  <small>{translation.note}</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </div>
          <Link className="home-reader-source-link" href="/translations">
            View text sources and licenses
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>

      <footer className="home-reader-footer">
        <p>Bible reading and study, without an account.</p>
        <nav aria-label="Footer navigation">
          <Link href="/start">Start here</Link>
          <Link href="/topics">Topics</Link>
          <Link href="/gospel">The gospel</Link>
        </nav>
      </footer>
    </div>
  );
}
