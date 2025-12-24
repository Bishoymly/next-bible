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
            ? `[direction:rtl] ${amiri.className} text-2xl leading-loose pr-3`
            : `text-lg leading-relaxed ${inter.className} pr-3`
        }`}
      >
        <div className="px-4 mb-6 md:hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start cursor-pointer text-accent hover:bg-accent hover:text-white transition-colors"
                asChild
                onClick={() => {
                  if (setIsSheetOpen) setIsSheetOpen(false);
                }}
              >
                <Link href="/">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {commentary && (
          <div className="mb-10 px-4">
            <h2 className="text-xl font-semibold mb-2 text-accent">
              {uiText[language].onThisPage}
            </h2>
            <ul className="space-y-1">
              {commentary?.sections.map((section, index) => (
                <li key={index} className="block cursor-pointer">
                  <Link
                    className={`${
                      language == "Arabic" ? "text-xl" : "text-sm"
                    } hover:text-primary transition-all duration-200 hover:translate-x-1 ${
                      activeId === `s${section.fromVerse}`
                        ? "text-primary font-bold"
                        : "text-muted-foreground"
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

        <div className="px-4">
          <h2 className="text-xl font-semibold mb-4 text-accent">{bookInfo.n}</h2>
          <ChaptersList
            language={language}
            version={version}
            book={bookInfo.slug}
            chaptersCount={bookInfo.c}
            chapter={chapter}
            aside={true}
          />
          <h2 className="text-xl font-semibold mt-6 text-accent">{uiText[language].books}</h2>
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
      </ScrollArea>
    );
  }

  return (
    <TooltipProvider>
    <div
      suppressHydrationWarning
      className={`flex h-screen bg-background transition-all overflow-hidden ${
        language == "Arabic"
          ? `[direction:rtl] ${amiri.className}`
          : `[direction:ltr] ${inter.className}`
      }`}
    >
      {/* Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col ${
          language == "Arabic" ? "border-l" : "border-r"
        } transition-all duration-300 ease-in-out ${
          sidebarExpanded 
            ? "w-72 translate-x-0" 
            : "w-0 " + (language == "Arabic" 
              ? "translate-x-full" 
              : "-translate-x-full")
        } overflow-hidden`}
      >
        <div className="p-4 flex-shrink-0 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer text-accent hover:bg-accent hover:text-white transition-colors"
            asChild
          >
            <Link href="/">
              <BookOpen className="mr-2 h-4 w-4" />
              Home
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
              <p>{sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}</p>
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
        <header className="flex items-center justify-between p-3 border-b bg-primary text-white leather-texture">
          <div className="flex items-center">
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <div
                    className="flex row"
                    onClick={() => setIsSheetOpen(!isSheetOpen)}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95">
                          <Menu className="transition-transform duration-200" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Menu</p>
                      </TooltipContent>
                    </Tooltip>
                    <h1 className="text-2xl font-bold mx-2 flex flex-row space-x-2 text-white">
                      {bookInfo.n} {chapter}
                    </h1>
                  </div>
                </SheetTrigger>
                <SheetContent side={language === "Arabic" ? "right" : "left"} className="flex flex-col p-0 h-full">
                  <SheetTitle className="sr-only">
                    Navigation Menu
                  </SheetTitle>
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
                  variant="ghost"
                  size="icon"
                  className={`p-0 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${sidebarExpanded ? "hidden" : ""}`}
                  onClick={() => setSidebarExpanded(true)}
                >
                  {language == "Arabic" ? (
                    <ChevronLeft className="h-5 text-white transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="text-white transition-transform duration-200" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show sidebar</p>
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
                    <BookOpen className="mt-2 mx-1 text-white transition-transform duration-200" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
            <h1
              className="text-2xl font-bold mx-2 flex-row space-x-2 hidden md:flex text-white"
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
                  variant="ghost"
                  size="icon"
                  disabled={parseInt(chapter) === 1}
                  className="cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Link href={`/${version}/${book}/${parseInt(chapter) - 1}`} className="transition-transform duration-200">
                      {language == "English" ? <ChevronLeft className="text-white transition-transform duration-200" /> : <ChevronRight className="text-white transition-transform duration-200" />}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous chapter</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={parseInt(chapter) === bookInfo.c}
                  className="cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Link href={`/${version}/${book}/${parseInt(chapter) + 1}`} className="transition-transform duration-200">
                    {language == "English" ? <ChevronRight className="text-white transition-transform duration-200" /> : <ChevronLeft className="text-white transition-transform duration-200" />}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next chapter</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Bible Content */}
        <div
          className="flex-1 scroll-smooth overflow-y-scroll"
          ref={scrollContainerRef}
        >
          <div className="p-6 flex gap-4 md:gap-8">
            <div className="max-w-3xl mx-auto space-y-4 mb-20 flex-1">
              <div className={inter.className}>
                <div className="flex gap-2">
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
                        aria-label="Side by side"
                        size="sm"
                        onClick={() => setSideBySide(!sideBySide)}
                        value={sideBySide}
                        className="cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <FlipHorizontal className="transition-transform duration-200" />
                      </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Side by side</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Toggle
                        aria-label="Verse by verse"
                        size="sm"
                        onClick={() => setVerseByVerse(!verseByVerse)}
                        value={verseByVerse}
                        className="cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <ListOrdered className="transition-transform duration-200" />
                      </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verse by verse</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
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

            {sideBySide && (
              <div className={`max-w-3xl mx-auto space-y-4 mb-20 flex-1`}>
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
          </div>
          <div className="p-6 mb-16">
            {(version2 != "study" || !sideBySide) &&
              commentary?.questions?.length > 0 && (
                <div className="max-w-3xl mx-auto mt-8">
                  <h2 className="text-2xl font-semibold mb-2 text-accent">
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
                className="w-14 h-14 rounded-full shadow-md flex items-center justify-center hover:shadow-lg hover:shadow-black/30 transition-all duration-300"
              >
                <MessageCircleQuestion className="h-6 w-6" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ask a Bible question</p>
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
  return commentary ? (
    <div>
      {commentary?.sections.map((section) => (
        <div
          id={`ss${section.fromVerse}`}
          key={`ss${section.fromVerse}`}
          className={`snap-y scroll-my-10 mb-6`}
        >
          <Link href={`#s${section.fromVerse}`} className="hover:text-primary">
            <h4
              className={` font-semibold mb-2 mt-4 cursor-pointer text-accent ${
                language == "Arabic" ? "text-xl" : "text-lg"
              }`}
            >
              {section.fromVerse} - {section.toVerse} : {section.title}
            </h4>
          </Link>
          {section.commentary.map((l, index) => (
            <span key={index}>{l}</span>
          ))}
          {commentary?.importantVerses
            .filter(
              (v) => v.verse >= section.fromVerse && v.verse <= section.toVerse
            )
            .map((important, index) => (
              <figure
                key={index}
                className="md:flex bg-muted rounded-xl p-8 md:p-0 mt-6 md:ml-20"
              >
                <div className="pt-6 md:p-8 text-center md:text-start space-y-4">
                  <Link
                    href={`#${important.verse}`}
                    className="hover:text-primary transition-colors"
                  >
                    <span className="text-lg font-medium text-foreground">
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
                    <span className="pb-2 block text-muted-foreground text-start">
                      {important.commentary}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {important.crossReferences?.map((ref, index) => (
                      <Button key={index} variant="outline">
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

      <h3 className="text-xl font-semibold mt-10 mb-2 text-accent">
        {uiText[language].questions}
      </h3>
      <ul className={`gap-2`}>
        {commentary?.questions?.map((question) => {
          // Convert question to URL slug: lowercase, replace spaces with hyphens, remove special chars
          const questionSlug = question
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
          
          return (
            <li key={question} className="cursor-pointer">
              <Button
                variant="outline"
                className="block mr-2 mb-2 text-wrap h-auto py-2 text-start text-lg font-normal cursor-pointer whitespace-normal"
                asChild
              >
                <Link href={`https://ask.holybiblereader.com/study/${questionSlug}`} target="_blank" rel="noopener noreferrer" className="whitespace-normal break-words">
                  {question}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
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
      className={` ${
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
                    className={` font-semibold mb-2 mt-4 cursor-pointer text-accent hover:text-accent/80 transition-colors ${
                      language == "Arabic" ? "text-2xl" : "text-xl"
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
                    ? "bg-yellow-200 dark:bg-yellow-800/50 text-[var(--color-black)] dark:text-gray-900 -my-1 py-1 cursor-pointer shadow-md"
                    : "") + (verseByVerse && "inline-block")
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
                {key == "1" && (
                  <span
                    className={`text-7xl font-bold text-accent ${
                      language == "Arabic" ? "ml-4" : "mr-4"
                    } float-start`}
                  >
                    {chapter}
                  </span>
                )}
                {key != "0" && (
                  <sup
                    id={key}
                    className={`scroll-my-4 ${
                      language == "Arabic" ? "text-lg" : "text-xs"
                    } font-semibold text-primary mr-1`}
                  >
                    {key}
                  </sup>
                )}
                {renderVerse(verse, language, false, verseByVerse)}
              </span>
            </DrawerTrigger>
            <DrawerContent
              className={`md:flex bg-muted rounded-xl p-8 ${
                language == "Arabic" && `[direction:rtl] ${amiri.className}`
              }`}
            >
              <DrawerTitle className="sr-only">
                {bookInfo.n} {chapter}:{key}
              </DrawerTitle>
              <div className="pt-6 text-center md:text-start space-y-4 mb-2">
                <span className="text-lg font-medium text-foreground">
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
                  <div key={index}>
                    <h3 className="font-semibold mb-2 mt-2 text-accent">
                      {uiText[language].commentary}
                    </h3>
                    <span className="pb-4 block">{important.commentary}</span>
                  </div>
                ))}
              <div className="flex flex-wrap gap-1 mt-4">
                {crossRef[key]?.map((ref, index) => (
                  <Button key={index} variant="outline" size="sm">
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
      <p className="text-left mt-8 text-sm italic">
        {versions.find((v) => v.id === version).copyright}
      </p>
    </div>
  );
}
