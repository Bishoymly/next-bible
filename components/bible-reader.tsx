"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookCopy, ChevronLeft, ChevronRight, Columns2Icon, Menu } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import ChatSupport from "./chat-support";
import { BibleBooksList } from "./bible-books-list";
import { Amiri, Inter } from "next/font/google";
import { uiText } from "@/lib/uiText";
import SocialShareButtons from "./social-share-buttons";

const inter = Inter({ subsets: ["latin"] });
const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export function BibleReader({ language, book, chapter, version, bookInfo, json, json2, language2, booksCategorized }) {
  const [showCommentary, setShowCommentary] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [question, setQuestion] = useState(null);
  const [commentary, setCommentary] = useState(null);
  const [sideBySide, setSideBySide] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem("sideBySide") || "false";
    setSideBySide(value === "true");
  }, []);

  const saveSideBySide = (value) => {
    localStorage.setItem("sideBySide", value);
    setSideBySide(value);
  };

  // scroll spy
  const [activeId, setActiveId] = useState<string | undefined>();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // handling scroll spy
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      if (scrollContainer && commentary) {
        const sectionElements = commentary.sections.map(({ fromVerse }) => document.getElementById(`s${fromVerse}`));

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
      setSelectedVerse({ key: hash, text: json[hash]?.verseObjects.map((vo) => vo.text).join(" ") });
    }
  }, [json]);

  useEffect(() => {
    const fetchCommentary = async () => {
      try {
        const response = await fetch(`/api/${book}/${chapter}/commentary`);
        const data = await response.json();
        setCommentary(data);
      } catch (error) {
        console.error("Error fetching commentary:", error);
      }
    };

    if (language == "en") {
      fetchCommentary();
    }
  }, [book, chapter]);

  const handleSelectVerse = (verse) => {
    if (selectedVerse?.key != verse.key) {
      setSelectedVerse(verse);
      history.replaceState({}, "", window.location.href.split("#")[0] + "#" + verse.key);
    } else {
      setSelectedVerse(null);
      history.replaceState({}, "", window.location.href.split("#")[0]);
    }
  };

  function Sidebar(bookInfo: any, chapter: any, book: any, booksCategorized: any) {
    return (
      <ScrollArea className={`h-full mt-4 pr-3 ${language == "ar" ? `[direction:rtl] ${amiri.className} text-2xl leading-loose` : `text-lg leading-relaxed ${inter.className}`}`}>
        {commentary && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-2">On this page</h2>
            <ul className="space-y-1">
              {commentary?.sections.map((section, index) => (
                <li key={index} className="block">
                  <Link
                    className={`text-sm hover:text-blue-600 ${activeId === `s${section.fromVerse}` ? "text-blue-600 font-bold" : "text-gray-500"}`}
                    href={`#s${section.fromVerse}`}
                    onClick={() => setActiveId(`s${section.fromVerse}`)}
                  >
                    {section.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">{uiText[language].chapters}</h2>
        <div className="grid grid-cols-5 gap-2 mb-8">
          {Array.from({ length: bookInfo.c }, (_, i) => i + 1).map((c) => (
            <Button key={c} variant={chapter == c ? "default" : "outline"} size="sm" className={language == "ar" ? "text-base" : "text-sm"} asChild>
              <Link href={`/${version}/${book}/${c}`}>{c}</Link>
            </Button>
          ))}
        </div>
        <h2 className="text-xl font-semibold mt-6">{uiText[language].books}</h2>
        <BibleBooksList language={language} version={version} booksCategorized={booksCategorized} aside={true} />
      </ScrollArea>
    );
  }

  return (
    <div className={`flex h-screen bg-background transition-all ${language == "ar" ? `[direction:rtl] ${amiri.className}` : `[direction:ltr] ${inter.className}`}`}>
      {/* Collapsible Sidebar */}
      <aside className={`hidden md:flex flex-col ${language == "ar" ? "border-l" : "border-r"} p-4 transition-all duration-300 ${sidebarExpanded ? "w-72" : "w-16"}`}>
        {Sidebar(bookInfo, chapter, book, booksCategorized)}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">{Sidebar(bookInfo, chapter, book, booksCategorized)}</SheetContent>
            </Sheet>
            <h1 className="text-2xl font-bold ml-4 flex flex-row space-x-2">
              {bookInfo.n} {chapter}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => saveSideBySide(!sideBySide)}>
              <BookCopy />
            </Button>
            <Button variant="ghost" size="icon" disabled={parseInt(chapter) === 1}>
              <Link href={`/${version}/${book}/${parseInt(chapter) - 1}`}>{language == "en" ? <ChevronLeft /> : <ChevronRight />}</Link>
            </Button>
            <Button variant="ghost" size="icon" disabled={parseInt(chapter) === bookInfo.c}>
              <Link href={`/${version}/${book}/${parseInt(chapter) + 1}`}>{language == "en" ? <ChevronRight /> : <ChevronLeft />}</Link>
            </Button>
          </div>
        </header>

        {/* Bible Content */}
        <div className={`flex-1 scroll-smooth overflow-y-scroll`} ref={scrollContainerRef}>
          <div className="p-6 flex">
            <div className="max-w-3xl mx-auto space-y-4 mb-20 flex-1">
              <div className={` ${language == "ar" ? "text-2xl leading-loose" : "text-lg leading-relaxed"}`}>
                {Object.entries(json).map(([key, verse]) => (
                  <>
                    {language != "ar" &&
                      commentary?.sections
                        .filter((s) => s.fromVerse == key)
                        .map((section) => (
                          <div id={`s${section.fromVerse}`} key={`s${section.fromVerse}`} className="snap-y scroll-my-10 mt-10">
                            <Popover key={key}>
                              <PopoverTrigger asChild>
                                <h3 className={` font-semibold mb-2 mt-4 cursor-pointer ${language == "ar" ? "text-2xl" : "text-xl"}`}>{section.title}</h3>
                              </PopoverTrigger>
                              <PopoverContent className="max-w-2xl space-y-2 flex flex-wrap text-sm">
                                {section.commentary.map((l, index) => (
                                  <p key={index} className="text-sm">
                                    {l}
                                  </p>
                                ))}
                              </PopoverContent>
                            </Popover>
                          </div>
                        ))}
                    <Popover key={key}>
                      <PopoverTrigger asChild>
                        <span
                          className={
                            selectedVerse?.key == key
                              ? "bg-yellow-200 -m-1 p-1 cursor-pointer"
                              : commentary?.importantVerses.filter((v) => v.verse == key).length > 0
                              ? "bg-blue-100 -m-1 p-1 cursor-pointer"
                              : ""
                          }
                          onClick={handleSelectVerse.bind(this, {
                            key: key,
                            text: (verse as { verseObjects: { text: string; tag: string; type: string }[] }).verseObjects.map((vo) => vo.text).join(" "),
                          })}
                        >
                          {key != "0" && (
                            <sup id={key} className={`scroll-my-4 ${language == "ar" ? "text-lg" : "text-xs"} font-semibold text-blue-600 mr-1`}>
                              {key}
                            </sup>
                          )}
                          {(verse as { verseObjects: { text: string; tag: string; type: string; content: string }[] }).verseObjects.map((verseObject, index, array) =>
                            verseObject.type == "text" || verseObject.type == "word" ? (
                              <>{verseObject.text}</>
                            ) : verseObject.type == "paragraph" ? (
                              <>
                                <br />
                                <br />
                              </>
                            ) : verseObject.tag == "add" ? (
                              <span className="italic">{verseObject.text}</span>
                            ) : verseObject.tag == "s1" ? (
                              <h3 className="text-3xl font-semibold mt-2 mb-4">{verseObject.content}</h3>
                            ) : verseObject.tag == "f" ? (
                              <span className="italic text-muted-foreground">{verseObject.content.replace(/\+\s\\fr\s*\d+:\d+\s*\\ft|[^a-zA-Z0-9\s]/g, "").replace(/fqa/g, ":")}</span>
                            ) : verseObject.tag == "q1" ? (
                              <br />
                            ) : verseObject.tag == "qs" ? (
                              <>
                                <span className="italic float-end">{verseObject.text}</span>
                                <br />
                              </>
                            ) : (
                              <>{JSON.stringify(verseObject)}</>
                            )
                          )}
                        </span>
                      </PopoverTrigger>

                      <PopoverContent className="max-w-2xl space-y-2 flex flex-wrap text-sm">
                        <h3 className="text-lg font-semibold">
                          {bookInfo.n} {chapter}:{key}
                        </h3>
                        <span className="pb-4 block">&ldquo;{(verse as { verseObjects: { text: string; tag: string; type: string }[] }).verseObjects.map((vo) => vo.text).join(" ")}&rdquo;</span>
                        {commentary?.importantVerses
                          .filter((v) => v.verse == key)
                          .map((important, index) => (
                            <div key={index}>
                              <h3 className="font-semibold mb-2">Commentary</h3>
                              <span className="pb-4 block">{important.commentary}</span>
                              {important.crossReferences?.map((ref, index) => (
                                <Button key={index} variant="outline" className="mr-1 mb-1">
                                  <Link href={`/${version}/${ref.book.slug}/${ref.chapter}#${ref.verse}`}>{`${ref.book} ${ref.chapter}:${ref.verse}`}</Link>
                                </Button>
                              ))}
                            </div>
                          ))}
                        {selectedVerse && <SocialShareButtons language={language} version={version} book={bookInfo.n} chapter={chapter} verse={selectedVerse.key} verseText={selectedVerse.text} />}
                      </PopoverContent>
                    </Popover>
                  </>
                ))}
              </div>
            </div>

            {sideBySide && (
              <div className="max-w-3xl mx-auto space-y-4 mb-20 flex-1">
                <div className={` ${language2 == "ar" ? `text-2xl leading-loose [direction:rtl] ${amiri.className}` : `text-lg leading-relaxed [direction:ltr] ${inter.className}`}`}>
                  {Object.entries(json2).map(([key, verse]) => (
                    <>
                      {language2 != "ar" &&
                        commentary?.sections
                          .filter((s) => s.fromVerse == key)
                          .map((section) => (
                            <div id={`s${section.fromVerse}`} key={`s${section.fromVerse}`} className="snap-y scroll-my-10 mt-10">
                              <Popover key={key}>
                                <PopoverTrigger asChild>
                                  <h3 className={` font-semibold mb-2 mt-4 cursor-pointer ${language2 == "ar" ? "text-2xl" : "text-xl"}`}>{section.title}</h3>
                                </PopoverTrigger>
                                <PopoverContent className="max-w-2xl space-y-2 flex flex-wrap text-sm">
                                  {section.commentary.map((l, index) => (
                                    <p key={index} className="text-sm">
                                      {l}
                                    </p>
                                  ))}
                                </PopoverContent>
                              </Popover>
                            </div>
                          ))}
                      <Popover key={key}>
                        <PopoverTrigger asChild>
                          <span
                            className={
                              selectedVerse?.key == key
                                ? "bg-yellow-200 -m-1 p-1 cursor-pointer"
                                : commentary?.importantVerses.filter((v) => v.verse == key).length > 0
                                ? "bg-blue-100 -m-1 p-1 cursor-pointer"
                                : ""
                            }
                            onClick={handleSelectVerse.bind(this, {
                              key: key,
                              text: (verse as { verseObjects: { text: string; tag: string; type: string }[] }).verseObjects.map((vo) => vo.text).join(" "),
                            })}
                          >
                            {key != "0" && (
                              <sup id={key} className={`scroll-my-4 ${language2 == "ar" ? "text-lg" : "text-xs"} font-semibold text-blue-600 mr-1`}>
                                {key}
                              </sup>
                            )}
                            {(verse as { verseObjects: { text: string; tag: string; type: string; content: string }[] }).verseObjects.map((verseObject, index, array) =>
                              verseObject.type == "text" || verseObject.type == "word" ? (
                                <>{verseObject.text}</>
                              ) : verseObject.type == "paragraph" ? (
                                <>
                                  <br />
                                  <br />
                                </>
                              ) : verseObject.tag == "add" ? (
                                <span className="italic">{verseObject.text}</span>
                              ) : verseObject.tag == "s1" ? (
                                <h3 className="text-3xl font-semibold mt-2 mb-4">{verseObject.content}</h3>
                              ) : verseObject.tag == "f" ? (
                                <span className="italic text-muted-foreground">{verseObject.content.replace(/\+\s\\fr\s*\d+:\d+\s*\\ft|[^a-zA-Z0-9\s]/g, "").replace(/fqa/g, ":")}</span>
                              ) : verseObject.tag == "q1" ? (
                                <br />
                              ) : verseObject.tag == "qs" ? (
                                <>
                                  <span className="italic float-end">{verseObject.text}</span>
                                  <br />
                                </>
                              ) : (
                                <>{JSON.stringify(verseObject)}</>
                              )
                            )}
                          </span>
                        </PopoverTrigger>

                        <PopoverContent className="max-w-2xl space-y-2 flex flex-wrap text-sm">
                          <h3 className="text-lg font-semibold">
                            {bookInfo.n} {chapter}:{key}
                          </h3>
                          <span className="pb-4 block">&ldquo;{(verse as { verseObjects: { text: string; tag: string; type: string }[] }).verseObjects.map((vo) => vo.text).join(" ")}&rdquo;</span>
                          {commentary?.importantVerses
                            .filter((v) => v.verse == key)
                            .map((important, index) => (
                              <div key={index}>
                                <h3 className="font-semibold mb-2">Commentary</h3>
                                <span className="pb-4 block">{important.commentary}</span>
                                {important.crossReferences?.map((ref, index) => (
                                  <Button key={index} variant="outline" className="mr-1 mb-1">
                                    <Link href={`/${version}/${ref.book.slug}/${ref.chapter}#${ref.verse}`}>{`${ref.book} ${ref.chapter}:${ref.verse}`}</Link>
                                  </Button>
                                ))}
                              </div>
                            ))}
                          {selectedVerse && <SocialShareButtons language={language2} version={version} book={bookInfo.n} chapter={chapter} verse={selectedVerse.key} verseText={selectedVerse.text} />}
                        </PopoverContent>
                      </Popover>
                    </>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-6">
            {commentary?.questions?.length > 0 && (
              <div className="max-w-4xl mx-auto mt-8">
                <h3 className="text-xl font-semibold mb-2">Questions</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {commentary?.questions?.map((question) => (
                    <Button key={question} variant="outline" className="mr-2 mb-2 text-wrap h-auto py-2 text-left" onClick={() => setQuestion(question)}>
                      {question}
                    </Button>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <ChatSupport version={version} book={book} chapter={chapter} question={question} />
      </main>
    </div>
  );
}
