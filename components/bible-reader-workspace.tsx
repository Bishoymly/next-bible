"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Columns2,
  LibraryBig,
  ListOrdered,
  Search,
  Settings2,
  Sparkles,
  Square,
  StickyNote,
  Volume2,
} from "lucide-react";

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { LocalVerseTools } from "@/components/local-verse-tools";
import SocialShareButtons from "@/components/social-share-buttons";
import { ThemeToggle } from "@/components/theme-toggle";
import versionsDropDown from "@/components/versions-drop-down";
import { getBookSlug } from "@/lib/getBookSlug";
import parseWord from "@/lib/parseWord";

type ReaderMode = "read" | "compare" | "study";

const hiddenTags = new Set(["f", "f*", "fr", "ft", "fqa", "fv", "fv*", "fq", "fta"]);
const sectionTags = new Set(["s1", "s2", "s3", "s4", "ms", "ms1", "mr", "d"]);

function walkObjects(objects: any[], visitor: (object: any) => void) {
  for (const object of objects ?? []) {
    visitor(object);
    if (Array.isArray(object?.children)) walkObjects(object.children, visitor);
  }
}

function verseText(verse: any): string {
  const parts: string[] = [];
  walkObjects(verse?.verseObjects ?? [], (object) => {
    if (hiddenTags.has(object?.tag) || object?.type === "footnote" || sectionTags.has(object?.tag)) return;
    if (typeof object?.text === "string") parts.push(object.text);
    else if (object?.tag === "+w" || object?.tag === "+w*" || object?.type === "word") {
      parts.push(parseWord(String(object?.content ?? "")).text);
    } else if (["wj", "wj*", "nd", "nd*", "add", "+add"].includes(object?.tag) && typeof object?.content === "string") {
      parts.push(parseWord(object.content).text);
    }
  });
  return parts.join(" ").replace(/¶/g, "").replace(/\s+/g, " ").trim();
}

function verseHeadings(verse: any): string[] {
  const headings: string[] = [];
  walkObjects(verse?.verseObjects ?? [], (object) => {
    if (!sectionTags.has(object?.tag)) return;
    const heading = String(object?.content ?? object?.text ?? "").replace(/\s+/g, " ").trim();
    if (heading && !headings.includes(heading)) headings.push(heading);
  });
  return headings;
}

function crossReferenceHref(ref: string, version: string, books: any[], language: string) {
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)/);
  if (!match) return "/search";
  const matchedBook = books.find((item) => item.short?.toLowerCase() === match[1].toLowerCase() || item.n?.toLowerCase() === match[1].toLowerCase());
  const slug = matchedBook?.slug ?? getBookSlug(books, language, match[1]);
  return `/${version}/${slug}/${match[2]}#${match[3]}`;
}

function crossReferenceLabel(ref: string, books: any[]) {
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)/);
  if (!match) return ref;
  const matchedBook = books.find((item) => item.short?.toLowerCase() === match[1].toLowerCase() || item.n?.toLowerCase() === match[1].toLowerCase());
  return `${matchedBook?.n ?? match[1]} ${match[2]}:${match[3]}`;
}

function ReaderNav({ mode, setMode }: { mode: ReaderMode; setMode: (mode: ReaderMode) => void }) {
  const items = [
    { id: "read" as const, label: "Read", icon: BookOpen },
    { id: "compare" as const, label: "Compare", icon: Columns2 },
    { id: "study" as const, label: "Study", icon: LibraryBig },
  ];
  return (
    <nav className="reader-primary-nav" aria-label="Bible tools">
      <div className="reader-nav-stack">
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className="reader-nav-button" data-active={mode === id} aria-pressed={mode === id} onClick={() => setMode(id)}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
        <Link className="reader-nav-button" href="/library#notes">
          <StickyNote aria-hidden="true" />
          <span>Notes</span>
        </Link>
        <Link className="reader-nav-button" href="/library#bookmarks">
          <Bookmark aria-hidden="true" />
          <span>Bookmarks</span>
        </Link>
      </div>
      <Link className="reader-nav-button reader-settings" href="/translations">
        <Settings2 aria-hidden="true" />
        <span>Settings</span>
      </Link>
    </nav>
  );
}

function ChapterRail({ version, bookInfo, chapter, commentary }: any) {
  const currentChapter = Number(chapter);
  const activeTitle = commentary?.sections?.[0]?.title;
  return (
    <aside className="reader-chapter-rail" aria-label={`${bookInfo.n} chapters`}>
      <div className="reader-rail-title">
        <Link href={`/${version}`} aria-label="Choose a book"><ChevronLeft aria-hidden="true" /></Link>
        <h2>{bookInfo.n}</h2>
      </div>
      <Link className="reader-overview-button" href={`/${version}/${bookInfo.slug}`}>
        <span>Book overview</span><ChevronRight aria-hidden="true" />
      </Link>
      <p className="reader-rail-label">Chapters</p>
      <div className="reader-chapter-list">
        {Array.from({ length: bookInfo.c }, (_, index) => index + 1).map((item) => (
          <Link key={item} href={`/${version}/${bookInfo.slug}/${item}`} data-active={item === currentChapter} aria-current={item === currentChapter ? "page" : undefined}>
            <span>{item}</span>
            <small>{item === currentChapter && activeTitle && activeTitle !== "Study this chapter" ? activeTitle : `Chapter ${item}`}</small>
          </Link>
        ))}
      </div>
    </aside>
  );
}

function ScriptureColumn({
  language,
  json,
  selectedVerse,
  setSelectedVerse,
  bookInfo,
  chapter,
  version,
  books,
  versions,
  chapterCrossReferences,
  verseByVerse,
}: any) {
  const verses = Object.entries(json).filter(([key]) => /^\d+$/.test(key));
  return (
    <div className={`reader-scripture ${language === "Arabic" ? "reader-scripture-arabic" : ""}`}>
      {verses.map(([key, verse]: [string, any]) => {
        const text = verseText(verse);
        const open = selectedVerse?.key === key && selectedVerse?.version === version;
        return (
          <React.Fragment key={key}>
            {verseHeadings(verse).map((heading) => <h2 key={heading}>{heading}</h2>)}
            <Drawer open={open} onOpenChange={(nextOpen) => { if (!nextOpen && open) setSelectedVerse(null); }}>
              <DrawerTrigger asChild>
                <span
                  role="button"
                  tabIndex={0}
                  id={`verse-${key}`}
                  className={`reader-verse ${verseByVerse ? "reader-verse-block" : ""}`}
                  data-selected={open}
                  onClick={() => setSelectedVerse(open ? null : { key, version, text })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedVerse(open ? null : { key, version, text });
                    }
                  }}
                >
                  <sup id={key}>{key}</sup>{text}{" "}
                </span>
              </DrawerTrigger>
              <DrawerContent className="border-border bg-background p-6 sm:p-8">
                <DrawerTitle className="reader-drawer-title">{bookInfo.n} {chapter}:{key}</DrawerTitle>
                <DrawerDescription className="reader-drawer-description">Verse details, references, bookmark, and a private note saved in this browser.</DrawerDescription>
                <blockquote className="reader-drawer-verse">“{text}”</blockquote>
                <LocalVerseTools reference={`${version}:${bookInfo.slug}:${chapter}:${key}`} label={`${bookInfo.n} ${chapter}:${key}`} text={text} />
                {chapterCrossReferences?.[key]?.length ? (
                  <div className="reader-drawer-references">
                    {chapterCrossReferences[key].slice(0, 8).map((ref: string) => <Link key={ref} href={crossReferenceHref(ref, version, books, language)}>{crossReferenceLabel(ref, books)}</Link>)}
                  </div>
                ) : null}
                <SocialShareButtons language={language} version={version} book={bookInfo.n} chapter={chapter} verse={key} verseText={text} />
              </DrawerContent>
            </Drawer>
          </React.Fragment>
        );
      })}
      <p className="reader-copyright">{versions.find((item: any) => item.id === version)?.copyright}</p>
    </div>
  );
}

function StudyPanel({ mode, language, version, bookInfo, chapter, commentary, chapterCrossReferences, books, comparisonVersion, comparisonState, comparisonJson, versions, comparisonBookSlugs }: any) {
  const section = commentary?.sections?.[0];
  const observations = section?.commentary ?? section?.observations ?? [];
  const references = useMemo(() => [...new Set(Object.values(chapterCrossReferences ?? {}).flat() as string[])].slice(0, 4), [chapterCrossReferences]);
  const comparisonInfo = versions.find((item: any) => item.id === comparisonVersion);

  if (mode === "compare") {
    return (
      <aside className="reader-study-panel reader-comparison-panel" aria-label="Translation comparison">
        <div className="reader-panel-heading"><h2>Compare translations</h2><Columns2 aria-hidden="true" /></div>
        <div className="reader-panel-translation">{versionsDropDown(versions, version, bookInfo.slug, chapter, comparisonVersion, true, comparisonBookSlugs)}</div>
        <p className="reader-panel-muted">{comparisonInfo?.name ?? comparisonVersion?.toUpperCase()}</p>
        {comparisonState === "same" ? <p>Choose a different translation to compare.</p> : comparisonState === "error" ? <p>Comparison could not load. Choose another translation or try again.</p> : !comparisonJson ? <p>Loading comparison translation...</p> : (
          <div className="reader-comparison-verses">
            {Object.entries(comparisonJson).filter(([key]) => /^\d+$/.test(key)).map(([key, verse]: [string, any]) => <p key={key}><sup>{key}</sup>{verseText(verse)}</p>)}
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside className={`reader-study-panel ${mode === "study" ? "reader-panel-mobile-open" : ""}`} aria-label="Study this passage">
      <div className="reader-panel-heading"><h2>Study this passage</h2><Sparkles aria-hidden="true" /></div>
      <section className="reader-insight-section">
        <h3><BookOpen aria-hidden="true" /> Insight</h3>
        <p><strong>{bookInfo.n} {chapter}:{section?.fromVerse ?? 1}{section?.toVerse ? `-${section.toVerse}` : ""}</strong></p>
        {observations.slice(0, mode === "study" ? 4 : 2).map((observation: string, index: number) => <p key={index}>{observation}</p>)}
      </section>
      {references.length ? (
        <section className="reader-references-section">
          <h3><Columns2 aria-hidden="true" /> Scripture references</h3>
          {references.map((ref) => <Link key={ref} href={crossReferenceHref(ref, version, books, language)}><span><u>{crossReferenceLabel(ref, books)}</u><small>Open this cross-reference in {version.toUpperCase()}.</small></span><ChevronRight aria-hidden="true" /></Link>)}
        </section>
      ) : null}
      {mode === "study" && commentary?.questions?.length ? (
        <section className="reader-questions-section"><h3>Questions for reflection</h3>{commentary.questions.slice(0, 4).map((question: string) => <p key={question}>{question}</p>)}</section>
      ) : null}
      <form className="reader-explore-form" action="/search" method="get">
        <label htmlFor="passage-search">Explore this passage</label>
        <div><input id="passage-search" name="q" placeholder={`Search Scripture alongside ${bookInfo.n} ${chapter}`} /><button type="submit" aria-label="Search Scripture"><ChevronRight aria-hidden="true" /></button></div>
        <small>Search runs locally in your browser. No question or reading history is sent to a server.</small>
      </form>
    </aside>
  );
}

export function BibleReaderWorkspace({
  language,
  book,
  chapter,
  version,
  version2,
  versions,
  bookInfo,
  json,
  language2,
  comparisonBookSlugs,
  comparisonBooksByVersion,
  comparisonBookInfoByVersion,
  chapterCrossReferences,
  books,
  initialCommentary,
}: any) {
  const currentChapter = Number(chapter);
  const [mode, setMode] = useState<ReaderMode>("read");
  const [requestedComparison, setRequestedComparison] = useState<string | null>(null);
  const [comparisonJson, setComparisonJson] = useState<any>(null);
  const [comparisonState, setComparisonState] = useState<"idle" | "loading" | "ready" | "error" | "same">("idle");
  const [selectedVerse, setSelectedVerse] = useState<any>(null);
  const [verseByVerse, setVerseByVerse] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => setRequestedComparison(new URLSearchParams(window.location.search).get("side")), []);
  const comparisonVersion = versions.some((item: any) => item.id === requestedComparison) ? requestedComparison! : version2;
  const comparisonLanguage = versions.find((item: any) => item.id === comparisonVersion)?.lang ?? language2;
  const comparisonBooks = comparisonBooksByVersion?.[comparisonVersion] ?? books;
  const comparisonBookInfo = comparisonBookInfoByVersion?.[comparisonVersion] ?? bookInfo;

  useEffect(() => {
    if (mode !== "compare") return;
    if (!comparisonVersion || comparisonVersion === version) { setComparisonJson(null); setComparisonState("same"); return; }
    const controller = new AbortController();
    setComparisonJson(null);
    setComparisonState("loading");
    fetch(`/generated/scripture/${comparisonVersion}/${comparisonBookSlugs?.[comparisonVersion] ?? book}.json`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Comparison translation unavailable")))
      .then((artifact) => {
        const verses = artifact?.chapters?.[chapter] ?? [];
        const normalized = Object.fromEntries(verses.map((item: any) => [String(item.verse), { verseObjects: [{ type: "text", text: item.text }] }]));
        if (!controller.signal.aborted) { setComparisonJson(normalized); setComparisonState("ready"); }
      })
      .catch(() => { if (!controller.signal.aborted) setComparisonState("error"); });
    return () => controller.abort();
  }, [book, chapter, comparisonBookSlugs, comparisonVersion, mode, version]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && json?.[hash]) setSelectedVerse({ key: hash, version, text: verseText(json[hash]) });
  }, [json, version]);

  useEffect(() => () => {
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      utteranceRef.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  function toggleChapterAudio() {
    if (!("speechSynthesis" in window)) return;
    if (isReading) {
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
        utteranceRef.current = null;
      }
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    window.speechSynthesis.cancel();
    const text = Object.entries(json).filter(([key]) => /^\d+$/.test(key)).map(([, verse]) => verseText(verse)).join(" ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "Arabic" ? "ar" : "en";
    utterance.onend = () => { utteranceRef.current = null; setIsReading(false); };
    utterance.onerror = () => { utteranceRef.current = null; setIsReading(false); };
    utteranceRef.current = utterance;
    setIsReading(true);
    window.speechSynthesis.speak(utterance);
  }

  const subtitle = initialCommentary?.sections?.[0]?.title;

  return (
    <div className="bible-reader-app" dir={language === "Arabic" ? "rtl" : "ltr"}>
      <header className="reader-topbar">
        <Link className="reader-wordmark" href="/" aria-label="Bible home">Bible</Link>
        <form className="reader-global-search" action="/search" method="get">
          <Search aria-hidden="true" />
          <input ref={searchRef} name="q" placeholder="Go to a passage, search Scripture, or explore a question" aria-label="Search Scripture" />
          <kbd>⌘ K</kbd>
        </form>
        <div className="reader-topbar-actions">
          {versionsDropDown(versions, version, book, chapter, comparisonVersion, false, comparisonBookSlugs)}
          <ThemeToggle />
        </div>
      </header>

      <div className="reader-workspace" data-mode={mode}>
        <ReaderNav mode={mode} setMode={setMode} />
        <ChapterRail version={version} bookInfo={bookInfo} chapter={chapter} commentary={initialCommentary} />
        <main className="reader-main" id="chapter-text">
          <div className="reader-main-heading">
            <div><h1>{bookInfo.n} {chapter}</h1>{subtitle && subtitle !== "Study this chapter" ? <p>{subtitle}</p> : null}</div>
            <div className="reader-main-tools">
              <button type="button" aria-label={isReading ? "Stop reading this chapter" : "Listen to this chapter"} title={isReading ? "Stop reading" : "Listen to chapter"} aria-pressed={isReading} onClick={toggleChapterAudio}>{isReading ? <Square aria-hidden="true" /> : <Volume2 aria-hidden="true" />}</button>
              <button type="button" aria-label="Toggle verse by verse layout" aria-pressed={verseByVerse} onClick={() => setVerseByVerse((value) => !value)}><ListOrdered aria-hidden="true" /></button>
            </div>
          </div>
          <ScriptureColumn language={language} json={json} selectedVerse={selectedVerse} setSelectedVerse={setSelectedVerse} bookInfo={bookInfo} chapter={chapter} version={version} books={books} versions={versions} chapterCrossReferences={chapterCrossReferences} verseByVerse={verseByVerse} />
          <nav className="reader-chapter-pagination" aria-label="Adjacent chapters">
            {currentChapter > 1 ? <Link href={`/${version}/${book}/${currentChapter - 1}`}><ChevronLeft aria-hidden="true" /> Previous</Link> : <span />}
            {currentChapter < bookInfo.c ? <Link href={`/${version}/${book}/${currentChapter + 1}`}>Next <ChevronRight aria-hidden="true" /></Link> : null}
          </nav>
        </main>
        <StudyPanel mode={mode} language={mode === "compare" ? comparisonLanguage : language} version={version} bookInfo={mode === "compare" ? comparisonBookInfo : bookInfo} chapter={chapter} commentary={initialCommentary} chapterCrossReferences={chapterCrossReferences} books={mode === "compare" ? comparisonBooks : books} comparisonVersion={comparisonVersion} comparisonState={comparisonState} comparisonJson={comparisonJson} versions={versions} comparisonBookSlugs={comparisonBookSlugs} />
      </div>
    </div>
  );
}
