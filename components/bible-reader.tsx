"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  BookCopy,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  Menu,
  MessageSquareMore,
  MessageCircleQuestion,
  FlipHorizontal,
} from "lucide-react";
import Link from "next/link";
import { BibleBooksList } from "./bible-books-list";
import { Amiri, Inter } from "next/font/google";
import { uiText } from "@/lib/uiText";
import SocialShareButtons from "./social-share-buttons";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerHeader } from "@/components/ui/drawer";
import useStickyState from "@/lib/useStickyState";
import parseFootnote from "@/lib/parseFootnote";
import parseWord from "@/lib/parseWord";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Toggle } from "./ui/toggle";
import { getBookSlug } from "@/lib/getBookSlug";
import { Skeleton } from "./ui/skeleton";
import versionsDropDown from "./versions-drop-down";
import ChaptersList from "./chapters-list";
import strongsHebrewDictionary from "@/lib/strongs-hebrew-dictionary.js";
import strongsGreekDictionary from "@/lib/strongs-greek-dictionary.js";
import { getByBC } from "@texttree/bible-crossref";
import { ThemeToggle } from "./theme-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });
const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export function BibleReader({
  language,
  book,
  chapter,
  version,
  version2,
  versions,
  bookInfo,
  json,
  json2,
  language2,
  booksCategorized,
  books,
}) {
  const text = uiText[language];
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useStickyState(
    "sidebarExpanded",
    true
  );
  const [verseByVerse, setVerseByVerse] = useStickyState("verseByVerse", false);
  const [question, setQuestion] = useState(null);
  const [commentary, setCommentary] = useState(null);
  const [sideBySide, setSideBySide] = useStickyState("sideBySide", false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const showSplitView = sideBySide;
  const showStudyCompanion = !sideBySide && version != "study" && commentary?.questions?.length > 0;

  // scroll spy
  const [activeId, setActiveId] = useState<string | undefined>();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // handling scroll spy
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      if (scrollContainer && commentary) {
        const sectionElements = commentary.sections.map(({ fromVerse }) =>
          document.getElementById(`s${fromVerse}`)
        );

        const sectionInView = sectionElements.find((section) => {
          if (section) {
            const rect = section.getBoundingClientRect();
            return rect.top <= 150 && rect.bottom >= 150;
          }
          return false;
        });

        if (sectionInView) {
          setActiveId(sectionInView.id);
        }
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    // Cleanup the event listener on unmount
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [commentary]);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setSelectedVerse({
        key: hash,
        text: json[hash]?.verseObjects.map((vo) => vo.text).join(" "),
      });
    }
  }, [json]);

  useEffect(() => {
    const fetchCommentary = async () => {
      try {
        const response = await fetch(
          `/api/${language}/${book}/${chapter}/commentary`
        );
        const data = await response.json();
        setCommentary(data);
      } catch (error) {
        console.error("Error fetching commentary:", error);
      }
    };
    fetchCommentary();
  }, [book, chapter]);

  const handleSelectVerse = (verse) => {
    if (selectedVerse?.key != verse.key) {
      setSelectedVerse(verse);
      history.replaceState(
        {},
        "",
        window.location.href.split("#")[0] + "#" + verse.key
      );
    } else {
      setSelectedVerse(null);
      history.replaceState({}, "", window.location.href.split("#")[0]);
    }
  };

  function Sidebar(
    bookInfo: any,
    chapter: any,
    book: any,
    booksCategorized: any,
    setIsSheetOpen: any
  ) {
    return (
      <ScrollArea
        className={`h-full ${
          language == "Arabic"
            ? `[direction:rtl] ${amiri.className} text-2xl leading-loose`
            : `text-lg leading-relaxed ${inter.className}`
        }`}
      >
        <div className="space-y-6 px-4 pb-8">
        <div className="md:hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start cursor-pointer rounded-2xl"
                asChild
                onClick={() => {
                  if (setIsSheetOpen) setIsSheetOpen(false);
                }}
              >
                <Link href="/" className="flex items-center">
                  <BookOpen className={language == "Arabic" ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                  {uiText[language].home}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{uiText[language].home}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="rounded-[1.35rem] bg-background/28 p-4 ring-1 ring-border/22">
          <p className="editorial-eyebrow mb-2">{uiText[language].books}</p>
          <h2 className="text-3xl text-foreground">{bookInfo.n}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {text.chapterLabel} {chapter} {text.ofLabel} {bookInfo.c}
          </p>
        </div>
        {commentary && (
          <div className="rounded-[1.35rem] bg-background/28 p-4 ring-1 ring-border/22">
            <p className="editorial-eyebrow mb-2">{uiText[language].onThisPage}</p>
            <h2 className="text-3xl text-foreground">
              {uiText[language].onThisPage}
            </h2>
            <ul className="mt-3 space-y-1">
              {commentary?.sections.map((section, index) => (
                <li key={index} className="block cursor-pointer">
                  <Link
                    className={`${
                      language == "Arabic" ? "text-xl" : "text-base"
                    } block rounded-2xl px-3 py-2 transition-all duration-200 ${
                      activeId === `s${section.fromVerse}`
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-[rgba(200,150,58,0.12)] hover:text-accent"
                    }`}
                    href={`#s${section.fromVerse}`}
                    onClick={() => {
                      setActiveId(`s${section.fromVerse}`);
                      if (setIsSheetOpen) setIsSheetOpen(false);
                    }}
                  >
                    {section.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-[1.35rem] bg-background/28 p-4 ring-1 ring-border/22">
          <p className="editorial-eyebrow mb-2">{uiText[language].chapters}</p>
          <ChaptersList
            language={language}
            version={version}
            book={bookInfo.slug}
            chaptersCount={bookInfo.c}
            chapter={chapter}
            aside={true}
          />
        </div>
        <div className="rounded-[1.35rem] bg-background/28 p-4 ring-1 ring-border/22">
          <p className="editorial-eyebrow mb-4">{uiText[language].books}</p>
          <BibleBooksList
            language={language}
            versions={versions}
            version={version}
            book={null}
            chapter={chapter}
            booksCategorized={booksCategorized}
            aside={true}
          />
        </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <TooltipProvider>
    <div
      suppressHydrationWarning
      className={`flex min-h-screen bg-background transition-all overflow-hidden ${
        language == "Arabic"
          ? `[direction:rtl] ${amiri.className}`
          : `[direction:ltr] ${inter.className}`
      }`}
    >
      {/* Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col ${
          language == "Arabic" ? "border-l" : "border-r"
        } border-border/80 bg-background/60 backdrop-blur transition-all duration-300 ease-in-out ${
          sidebarExpanded 
            ? "w-80 translate-x-0" 
            : "w-0 " + (language == "Arabic" 
              ? "translate-x-full" 
              : "-translate-x-full")
        } overflow-hidden`}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border/70 p-4">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer rounded-2xl"
            asChild
          >
            <Link href="/" className="flex items-center">
              <BookOpen className={language == "Arabic" ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
              {uiText[language].home}
            </Link>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-0 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
              >
                {language == "English" ? (
                  <ChevronLeft className="h-5 text-accent transition-transform duration-200" />
                ) : (
                  <ChevronRight className="text-accent transition-transform duration-200" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{sidebarExpanded ? text.collapseSidebar : text.expandSidebar}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          {Sidebar(bookInfo, chapter, book, booksCategorized, null)}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="border-b border-border/80 bg-background/72 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5">
          <div className="flex items-center">
            <div className="md:hidden flex items-center">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95">
                        <Menu className="transition-transform duration-200" />
                      </Button>
                    </SheetTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{text.menu}</p>
                  </TooltipContent>
                </Tooltip>
                <h1 className="mx-3 flex flex-row space-x-2 font-display text-3xl text-foreground">
                  {bookInfo.n} {chapter}
                </h1>
                <SheetContent side={language === "Arabic" ? "right" : "left"} className="flex h-full flex-col border-border bg-background p-0" suppressHydrationWarning>
                  <SheetTitle className="sr-only">{text.navigationMenu}</SheetTitle>
                  <div className="flex-1 min-h-0 overflow-hidden pt-4">
                    {Sidebar(
                      bookInfo,
                      chapter,
                      book,
                      booksCategorized,
                      setIsSheetOpen
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`cursor-pointer text-foreground transition-all duration-200 hover:scale-110 hover:text-accent active:scale-95 ${sidebarExpanded ? "hidden" : ""}`}
                  onClick={() => setSidebarExpanded(true)}
                >
                  {language == "Arabic" ? (
                    <ChevronLeft className="h-5 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="transition-transform duration-200" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{text.showSidebar}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:block cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
                  asChild
                >
                  <Link href="/" className="transition-transform duration-200">
                    <BookOpen className="mx-1 mt-2 text-accent transition-transform duration-200" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{uiText[language].home}</p>
              </TooltipContent>
            </Tooltip>
            <h1
              className="mx-3 hidden flex-row space-x-2 font-display text-4xl text-foreground md:flex"
              onClick={() => setSidebarExpanded(true)}
            >
              {bookInfo.n} {chapter}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={parseInt(chapter) === 1}
                  className="cursor-pointer text-foreground transition-all duration-200 hover:scale-110 hover:text-accent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Link href={`/${version}/${book}/${parseInt(chapter) - 1}`} className="transition-transform duration-200">
                      {language == "English" ? <ChevronLeft className="transition-transform duration-200" /> : <ChevronRight className="transition-transform duration-200" />}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{text.previousChapter}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={parseInt(chapter) === bookInfo.c}
                  className="cursor-pointer text-foreground transition-all duration-200 hover:scale-110 hover:text-accent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Link href={`/${version}/${book}/${parseInt(chapter) + 1}`} className="transition-transform duration-200">
                    {language == "English" ? <ChevronRight className="transition-transform duration-200" /> : <ChevronLeft className="transition-transform duration-200" />}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{text.nextChapter}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          </div>
        </header>

        {/* Bible Content */}
        <div
          className="flex-1 scroll-smooth overflow-y-scroll scrollbar-thin"
          ref={scrollContainerRef}
        >
          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <section className="hero-panel rounded-[1.8rem] px-5 py-6 sm:px-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="editorial-eyebrow mb-3">{text.chapterReading}</p>
                  <h2 className="text-5xl leading-[0.95] text-[var(--parchment)] sm:text-6xl">
                    {bookInfo.n} {chapter}
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg italic text-[rgba(245,240,232,0.72)]">
                    {text.chapterReadingDesc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {versionsDropDown(
                    versions,
                    version,
                    book,
                    chapter,
                    version2,
                    false
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Toggle
                        aria-label={text.sideBySide}
                        size="sm"
                        onClick={() => setSideBySide(!sideBySide)}
                        value={sideBySide}
                        className="cursor-pointer rounded-full border border-[rgba(240,217,138,0.22)] bg-white/6 px-3 text-[var(--parchment)] transition-all duration-200 hover:scale-[1.03] hover:bg-[rgba(240,217,138,0.14)] hover:text-[var(--gold-pale)] active:scale-[0.98] data-[state=on]:border-[var(--gold)] data-[state=on]:bg-[var(--gold-pale)] data-[state=on]:text-[var(--navy-deep)]"
                      >
                        <FlipHorizontal className="transition-transform duration-200" />
                      </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{text.sideBySide}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Toggle
                        aria-label={text.verseByVerse}
                        size="sm"
                        onClick={() => setVerseByVerse(!verseByVerse)}
                        value={verseByVerse}
                        className="cursor-pointer rounded-full border border-[rgba(240,217,138,0.22)] bg-white/6 px-3 text-[var(--parchment)] transition-all duration-200 hover:scale-[1.03] hover:bg-[rgba(240,217,138,0.14)] hover:text-[var(--gold-pale)] active:scale-[0.98] data-[state=on]:border-[var(--gold)] data-[state=on]:bg-[var(--gold-pale)] data-[state=on]:text-[var(--navy-deep)]"
                      >
                        <ListOrdered className="transition-transform duration-200" />
                      </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{text.verseByVerse}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </section>

          <div className={`mt-6 ${showSplitView ? "flex gap-4 md:gap-8" : "space-y-6"}`}>
            <div className={`section-shell rounded-[1.75rem] p-5 sm:p-7 ${showSplitView ? "max-w-3xl flex-1" : "w-full max-w-4xl"}`}>
              {version == "study"
                ? studyContent(
                    language,
                    version,
                    commentary,
                    json,
                    bookInfo,
                    chapter,
                    books,
                    setQuestion
                  )
                : bibleContent.call(
                    this,
                    language,
                    json,
                    commentary,
                    selectedVerse,
                    handleSelectVerse,
                    bookInfo,
                    chapter,
                    version,
                    books,
                    versions,
                    verseByVerse
                  )}
            </div>

            {showSplitView && (
              <div className={`section-shell max-w-3xl flex-1 rounded-[1.75rem] p-5 sm:p-7`}>
                <div className={inter.className}>
                  {versionsDropDown(
                    versions,
                    version,
                    book,
                    chapter,
                    version2,
                    true
                  )}
                </div>
                {version2 == "study"
                  ? studyContent(
                      language,
                      version,
                      commentary,
                      json,
                      bookInfo,
                      chapter,
                      books,
                      setQuestion
                    )
                  : bibleContent.call(
                      this,
                      language2,
                      json2,
                      commentary,
                      selectedVerse,
                      handleSelectVerse,
                      bookInfo,
                      chapter,
                      version2,
                      books,
                      versions,
                      verseByVerse
                  )}
              </div>
            )}
            {showStudyCompanion && (
              <div className="section-shell w-full max-w-4xl rounded-[1.75rem] p-6 sm:p-8">
                <p className="editorial-eyebrow mb-2">{uiText[language].study}</p>
                <h2 className="mb-3 text-4xl text-foreground">
                  {uiText[language].study}
                </h2>
                {studyContent(
                  language,
                  version,
                  commentary,
                  json,
                  bookInfo,
                  chapter,
                  books,
                  setQuestion
                )}
              </div>
            )}
          </div>
          <div className="mb-16" />
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="https://ask.holybiblereader.com"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-5 right-5 z-50"
            >
              <Button
                variant="default"
                className="flex h-14 w-14 items-center justify-center rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-black/30"
              >
                <MessageCircleQuestion className="h-6 w-6" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{text.askBibleQuestion}</p>
          </TooltipContent>
        </Tooltip>
      </main>
    </div>
    </TooltipProvider>
  );
}

function studyContent(
  language: any,
  version: any,
  commentary: any,
  json: any,
  bookInfo: any,
  chapter: any,
  books: any,
  setQuestion
) {
  const text = uiText[language];
  return commentary ? (
    <div className="space-y-8">
      {commentary?.sections.map((section) => (
        <div
          id={`ss${section.fromVerse}`}
          key={`ss${section.fromVerse}`}
          className="snap-y scroll-my-10 rounded-[1.35rem] bg-background/18 p-2"
        >
          <div className="rounded-[1.15rem] bg-background/26 p-4">
            <p className="editorial-eyebrow mb-2">{text.sectionLabel} {section.fromVerse}-{section.toVerse}</p>
            <Link href={`#s${section.fromVerse}`} className="hover:text-primary">
              <h4
                className={`mb-4 cursor-pointer font-semibold text-accent ${
                  language == "Arabic" ? "text-2xl" : "text-3xl"
                }`}
              >
                {section.title}
              </h4>
            </Link>
            <div className="space-y-4 text-base leading-8 text-muted-foreground">
              {section.commentary.map((l, index) => (
                <p key={index}>{l}</p>
              ))}
            </div>
          </div>
          {commentary?.importantVerses
            .filter(
              (v) => v.verse >= section.fromVerse && v.verse <= section.toVerse
            )
            .map((important, index) => (
              <figure
                key={index}
                className="mt-4 rounded-[1.2rem] bg-background/24 p-5 md:ml-8"
              >
                <div className="space-y-4 text-center md:text-start">
                  <Link
                    href={`#${important.verse}`}
                    className="hover:text-primary transition-colors"
                  >
                    <span className="text-xl font-medium text-foreground">
                      {language == "Arabic" ? <>&rdquo;</> : <>&ldquo;</>}
                      {renderVerse(json[important.verse], language, true, true)}
                      {language == "Arabic" ? <>&ldquo;</> : <>&rdquo;</>}
                    </span>{" "}
                    -{" "}
                    <span className="text-accent">
                      {bookInfo.n} {chapter}:{important.verse}
                    </span>
                  </Link>
                  <div>
                    <span className="block pb-2 text-start text-muted-foreground">
                      {important.commentary}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {important.crossReferences?.map((ref, index) => (
                      <Button key={index} variant="outline" size="sm" className="rounded-full">
                        <Link
                          href={`/${version}/${getBookSlug(
                            books,
                            language,
                            ref.book
                          )}/${ref.chapter}#${ref.verse}`}
                        >{`${ref.book} ${ref.chapter}:${ref.verse}`}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </figure>
            ))}
        </div>
      ))}

      <div>
      <p className="editorial-eyebrow mb-2">{uiText[language].questions}</p>
      <h3 className="mb-4 text-4xl text-foreground">
        {uiText[language].questions}
      </h3>
      <ul className="grid gap-2">
        {commentary?.questions?.map((question) => {
          // Prepend book and chapter to the question
          const questionPrefix = language === "Arabic" 
            ? `في ${bookInfo.n} ${chapter}: `
            : `In ${bookInfo.n} ${chapter}: `;
          const questionWithContext = `${questionPrefix}${question}`;
          
          // For Arabic, use URL encoding; for English, create a slug
          const questionUrl = language === "Arabic"
            ? `https://ask.holybiblereader.com/study?q=${encodeURIComponent(questionWithContext)}`
            : (() => {
                const questionSlug = questionWithContext
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .trim();
                return `https://ask.holybiblereader.com/study/${questionSlug}`;
              })();
          
          return (
            <li key={question} className="cursor-pointer">
              <Button
                variant="outline"
                className="block h-auto whitespace-normal rounded-[1.15rem] border-none bg-background/24 px-4 py-3 text-start text-lg font-normal cursor-pointer shadow-none ring-1 ring-border/22"
                asChild
              >
                <Link href={questionUrl} target="_blank" rel="noopener noreferrer" className="whitespace-normal break-words">
                  {question}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
      </div>
    </div>
  ) : (
    <div className="flex flex-col space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function renderVerse(
  verse: any,
  language: any,
  singleVerse: boolean = false,
  verseByVerse: boolean
) {
  return (
    verse as {
      verseObjects: {
        text: string;
        tag: string;
        type: string;
        content: string;
        strong: string;
        nextChar: string;
        children: any[];
      }[];
    }
  ).verseObjects.map((verseObject, index, array) => (
    <React.Fragment key={`verse-obj-${index}`}>
      {verseObject.strong && singleVerse ? (
        renderWord(verseObject.text, verseObject.strong, index, language)
      ) : verseObject.text == "\n" && !verseByVerse ? (
        <br />
      ) : verseObject.type == "text" || verseObject.tag == "d" ? (
        <>{verseObject.text.replace("¶ ", "")}</>
      ) : verseObject.type == "word" ? (
        <>{verseObject.text}</>
      ) : verseObject.tag == "cl" || verseObject.tag == "ms1" ? (
        <>{verseObject.content}</>
      ) : verseObject.tag == "wj*" || verseObject.tag == "nd*" ? (
        <>{parseWord(verseObject.content).text}</>
      ) : verseObject.tag == "wj" ? (
        <span className="text-red-600">
          {renderVerse(
            { verseObjects: verseObject.children },
            language,
            singleVerse,
            verseByVerse
          )}
        </span>
      ) : verseObject.tag == "nd" ? (
        <span className="font-bold">
          {renderVerse(
            { verseObjects: verseObject.children },
            language,
            singleVerse,
            verseByVerse
          )}
        </span>
      ) : verseObject.tag == "+w" ? (
        parseWord(verseObject.content).text
      ) : verseObject.tag == "+w*" ? (
        verseObject.content
      ) : verseObject.type == "paragraph" ? (
        singleVerse || verseByVerse ? (
          <></>
        ) : (
          <>
            <br />
          </>
        )
      ) : verseObject.tag == "add" ? (
        <span className="italic">{verseObject.text}</span>
      ) : verseObject.tag == "+add" ? (
        <span className="italic text-red-600">{verseObject.text}</span>
      ) : verseObject.tag == "s1" ? (
        <>
          {/*<h3 className="text-3xl font-semibold mt-2 mb-4">{verseObject.content}</h3>*/}
        </>
      ) : verseObject.tag == "f" ? (
        singleVerse ? (
          <></>
        ) : (
          <MessageSquareMore className="text-accent text-sm w-4 inline" />
        )
      ) : verseObject.tag == "q1" || verseObject.tag == "q2" ? (
        <br />
      ) : verseObject.tag == "qs" && !verseByVerse ? (
        <>
          <span className="italic float-end">{verseObject.text}</span>
          <br />
        </>
      ) : (
        <>{JSON.stringify(verseObject)}</>
      )}
      {verseObject.nextChar == "\n" && !verseByVerse ? (
        <br />
      ) : (
        verseObject.nextChar
      )}
    </React.Fragment>
  ));
}

function renderWord(word: any, strongNumber: any, index: any, language: any) {
  if (!strongNumber) return word;
  if (strongNumber.startsWith("H")) {
    const strongWord = strongsHebrewDictionary[strongNumber];
    if (strongWord == undefined) return word;
    return (
      <Popover key={index}>
        <PopoverTrigger asChild>
          <span className="cursor-pointer border-b border-dotted border-primary">
            {word}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex">
                <h4 className="flex-1 font-medium leading-none">{word}</h4>
                <p className="flex-1 text-sm text-muted-foreground leading-none text-center">
                  {strongNumber}
                </p>
                <p className="flex-1 text-sm text-muted-foreground leading-none text-end">
                  {strongWord.lemma}
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">Pronounced: </span>
                  {strongWord.pron}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Definition: </span>
                  {strongWord.strongs_def}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  if (strongNumber.startsWith("G")) {
    const strongWord = strongsGreekDictionary[strongNumber];
    if (strongWord == undefined) return word;
    return (
      <Popover key={index}>
        <PopoverTrigger asChild>
          <span className="cursor-pointer border-b border-dotted border-primary">
            {word}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex">
                <h4 className="flex-1 font-medium leading-none">{word}</h4>
                <p className="flex-1 text-sm text-muted-foreground leading-none text-center">
                  {strongNumber}
                </p>
                <p className="flex-1 text-sm text-muted-foreground leading-none text-end">
                  {strongWord.lemma}
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">Definition: </span>
                  {strongWord.strongs_def}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
}

function renderFootnotes(verse: any, language: any) {
  return (
    verse as {
      verseObjects: {
        text: string;
        tag: string;
        type: string;
        content: string;
        nextChar: string;
        children: any[];
      }[];
    }
  ).verseObjects.map((verseObject, index, array) =>
    verseObject.tag == "f" ? (
      <p key={index} className="italic text-muted-foreground text-sm">
        <MessageSquareMore className="w-4 inline mx-1 text-accent" />
        {parseFootnote(verseObject.content).text}
      </p>
    ) : (
      <React.Fragment key={index}></React.Fragment>
    )
  );
}
function bibleContent(
  this,
  language: any,
  json: any,
  commentary: any,
  selectedVerse: any,
  handleSelectVerse: (verse: any) => void,
  bookInfo: any,
  chapter: any,
  version: any,
  books: any,
  versions: any,
  verseByVerse: boolean
) {
  const crossRef = getByBC({ book: bookInfo.short, chapter });

  return (
    <div
      className={`space-y-3 ${
        language == "Arabic"
          ? `text-2xl leading-loose [direction:rtl] ${amiri.className}`
          : `text-lg leading-relaxed [direction:ltr] ${inter.className}`
      }`}
    >
      {Object.entries(json).map(([key, verse]) => (
        <React.Fragment key={key}>
          {commentary?.sections
            .filter((s) => s.fromVerse == key)
            .map((section) => (
              <div
                id={`s${section.fromVerse}`}
                key={`s${section.fromVerse}`}
                className={`snap-y scroll-my-10 ${
                  section.fromVerse == 1 ? "" : "mt-10"
                }`}
              >
                <Link href={`#ss${section.fromVerse}`}>
                  <h3
                    className={`mb-3 ${section.fromVerse == 1 ? "mt-0 pb-1" : "mt-6 border-b border-border/60 pb-3"} cursor-pointer font-semibold text-accent hover:text-accent/80 transition-colors ${
                      language == "Arabic" ? "text-3xl" : "text-4xl"
                    }`}
                  >
                    {section.title}
                  </h3>
                </Link>
              </div>
            ))}
          <Drawer key={key}>
            <DrawerTrigger asChild>
              <span
                key={key}
                className={
                  (selectedVerse?.key == key
                    ? "rounded-lg bg-[rgba(200,150,58,0.18)] text-[var(--color-black)] dark:text-[var(--parchment)] -my-1 py-1 cursor-pointer shadow-md"
                    : "") + (verseByVerse ? "mb-3 block border-b border-border/35 pb-3" : "")
                }
                onClick={handleSelectVerse.bind(this, {
                  key: key,
                  text: (
                    verse as {
                      verseObjects: {
                        text: string;
                        tag: string;
                        type: string;
                      }[];
                    }
                  ).verseObjects
                    .map((vo) => vo.text)
                    .join(" "),
                })}
              >
                {key != "0" && (
                  <sup
                    id={key}
                    className={`scroll-my-4 ${
                      language == "Arabic" ? "text-xl" : "text-sm"
                    } mr-1 font-label font-semibold uppercase tracking-[0.14em] text-primary`}
                  >
                    {key}
                  </sup>
                )}
                {renderVerse(verse, language, false, verseByVerse)}
              </span>
            </DrawerTrigger>
            <DrawerContent
              className={`md:flex border-border bg-background p-8 ${
                language == "Arabic" && `[direction:rtl] ${amiri.className}`
              }`}
            >
              <DrawerTitle className="sr-only">
                {bookInfo.n} {chapter}:{key}
              </DrawerTitle>
              <div className="mb-2 space-y-4 pt-6 text-center md:text-start">
                <span className="text-xl font-medium text-foreground">
                  {language == "Arabic" ? <>&rdquo;</> : <>&ldquo;</>}
                  {renderVerse(verse, language, true, verseByVerse)}
                  {language == "Arabic" ? <>&ldquo;</> : <>&rdquo;</>}
                </span>{" "}
                -{" "}
                <span className="text-accent">
                  {bookInfo.n} {chapter}:{key}
                </span>
              </div>
              {renderFootnotes(verse, language)}
              {commentary?.importantVerses
                .filter((v) => v.verse == key)
                .map((important, index) => (
                  <div key={index} className="rounded-[1.15rem] border border-border/70 bg-background/45 p-4">
                    <h3 className="mb-2 mt-2 font-semibold text-accent">
                      {uiText[language].commentary}
                    </h3>
                    <span className="pb-4 block">{important.commentary}</span>
                  </div>
                ))}
              <div className="mt-4 flex flex-wrap gap-1">
                {crossRef[key]?.map((ref, index) => (
                  <Button key={index} variant="outline" size="sm" className="rounded-full">
                    <Link
                      href={`/${version}/${getBookSlug(
                        books,
                        language,
                        ref.split(" ")[0]
                      )}/${ref.split(" ")[1].split(":")[0]}#${
                        ref.split(" ")[1].split(":")[1]
                      }`}
                    >{`${ref}`}</Link>
                  </Button>
                ))}
              </div>
              {
                <SocialShareButtons
                  language={language}
                  version={version}
                  book={bookInfo.n}
                  chapter={chapter}
                  verse={key}
                  verseText={selectedVerse?.text}
                />
              }
            </DrawerContent>
          </Drawer>
        </React.Fragment>
      ))}
      <p className="mt-8 pt-2 text-left text-sm italic text-muted-foreground">
        {versions.find((v) => v.id === version).copyright}
      </p>
    </div>
  );
}
