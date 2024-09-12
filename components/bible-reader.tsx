"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Menu, Share2, Facebook, Twitter, Linkedin, ChevronFirst, ChevronLast, Home, BookIcon } from "lucide-react";
import Link from "next/link";
import { Card } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import ChatSupport from "./chat-support";
import { BibleBooksList } from "./bible-books-list";

const uiText = {
  en: {
    selectBook: "Select Book",
    selectChapter: "Select Chapter",
    search: "Search",
    bibleNavigation: "Bible Navigation",
    selectBookOrChapter: "Select a book or chapter to read",
    commentary: "Commentary on",
    share: "Share",
    shareVerse: "Share this verse",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    expandSidebar: "Expand sidebar",
    collapseSidebar: "Collapse sidebar",
  },
  es: {
    selectBook: "Seleccionar Libro",
    selectChapter: "Seleccionar Capítulo",
    search: "Buscar",
    bibleNavigation: "Navegación de la Biblia",
    selectBookOrChapter: "Seleccione un libro o capítulo para leer",
    commentary: "Comentario sobre",
    share: "Compartir",
    shareVerse: "Compartir este versículo",
    copyLink: "Copiar enlace",
    linkCopied: "¡Enlace copiado!",
    expandSidebar: "Expandir barra lateral",
    collapseSidebar: "Contraer barra lateral",
  },
};

const commentaries = {
  3: [
    "\"Let there be light\" - This phrase marks the beginning of God's creative work in forming the universe. The command demonstrates God's power to bring order out of chaos through His spoken word.",
    "The nature of this light has been debated, as the sun and stars are not created until the fourth day. Some interpret this as the creation of energy itself, while others see it as God's presence illuminating the darkness.",
    "This verse is often seen as a metaphor for spiritual illumination, with God's light piercing the darkness of human understanding and sin.",
  ],
};

const SocialShareButtons = ({ language, version, book, chapter, verse, verseText }) => {
  const [linkCopied, setLinkCopied] = useState(false);

  const shareUrl = window.location.href;
  const shareText = `${book} ${chapter}:${verse} ${verseText}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <div className="flex space-x-2">
        <Button variant="outline" size="icon" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")}>
          <Facebook className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank")}>
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, "_blank")}
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleCopyLink}>
          {linkCopied ? <span className="text-xs">{uiText[language].linkCopied}</span> : <Share2 className="h-4 w-4" />}
        </Button>
      </div>
    </TooltipProvider>
  );
};

export function BibleReader({ book, chapter, version, bookInfo, json, booksCategorized }) {
  const [showCommentary, setShowCommentary] = useState(false);
  const [language, setLanguage] = useState("en");
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [question, setQuestion] = useState(null);
  const [commentary, setCommentary] = useState(null);

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

    fetchCommentary();
  }, [book, chapter]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleSelectVerse = (verse) => {
    if (selectedVerse?.key != verse.key) {
      setSelectedVerse(verse);
      history.replaceState({}, "", window.location.href.split("#")[0] + "#" + verse.key);
    } else {
      setSelectedVerse(null);
      history.replaceState({}, "", window.location.href.split("#")[0]);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Collapsible Sidebar */}
      <aside className={`hidden md:flex flex-col border-r p-4 transition-all duration-300 ${sidebarExpanded ? "w-72" : "w-16"}`}>{Sidebar(bookInfo, chapter, book, booksCategorized)}</aside>

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
            <Button variant="ghost" size="icon" disabled={parseInt(chapter) === 1}>
              <Link href={`/asv/${book}/${parseInt(chapter) - 1}`}>
                <ChevronLeft />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" disabled={parseInt(chapter) === bookInfo.c}>
              <Link href={`/asv/${book}/${parseInt(chapter) + 1}`}>
                <ChevronRight />
              </Link>
            </Button>
          </div>
        </header>

        {/* Bible Content */}
        <ScrollArea className="flex-1 scroll-smooth">
          <div className="p-6">
            <div className="max-w-3xl mx-auto space-y-4 mb-20">
              <div className="text-lg leading-relaxed">
                {Object.entries(json).map(([key, verse]) =>
                  key != "front" ? (
                    <>
                      {commentary?.sections
                        .filter((s) => s.fromVerse == key)
                        .map((section) => (
                          <div key={`s${section.fromVerse}`} className="mt-20">
                            <div className="border-l-gray-200 border-b-2 mb-4">
                              <div className="p-4 space-y-2 ml-20 bg-slate-100 rounded-2xl rounded-b-none">
                                {section.commentary.map((l, index) => (
                                  <p key={index} className="text-sm">
                                    {l}
                                  </p>
                                ))}
                              </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 mt-4">{section.title}</h3>
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
                              key,
                              text: (verse as { verseObjects: { text: string; tag: string; type: string }[] }).verseObjects.map((vo) => vo.text).join(" "),
                            })}
                          >
                            <sup id={key} className="scroll-my-2 text-xs font-semibold text-blue-600 mr-1">
                              {key}
                            </sup>
                            {(verse as { verseObjects: { text: string; tag: string; type: string }[] }).verseObjects.map((verseObject, index, array) =>
                              verseObject.tag == "p" ? (
                                <>
                                  <br />
                                  <br />
                                </>
                              ) : (
                                <>{verseObject.text}</>
                              )
                            )}
                          </span>
                        </PopoverTrigger>

                        <PopoverContent className="max-w-2xl space-y-2 flex flex-wrap text-sm">
                          <h3 className="text-lg font-semibold mb-2">
                            {bookInfo.n} {chapter}:{key}
                          </h3>
                          {commentary?.importantVerses
                            .filter((v) => v.verse == key)
                            .map((important, index) => (
                              <div key={index}>
                                <h3 className="font-semibold mb-2">Commentary</h3>
                                <span className="pb-4 block">{important.commentary}</span>
                                {important.crossReferences?.map((ref, index) => (
                                  <Button key={index} variant="outline" className="mr-1 mb-1">
                                    <Link href={`/asv/${ref.book.toLowerCase().replace(/ /g, "-")}/${ref.chapter}#${ref.verse}`}>{`${ref.book} ${ref.chapter}:${ref.verse}`}</Link>
                                  </Button>
                                ))}
                              </div>
                            ))}
                          {selectedVerse && <SocialShareButtons language={language} version={version} book={bookInfo.n} chapter={chapter} verse={selectedVerse.key} verseText={selectedVerse.text} />}
                        </PopoverContent>
                      </Popover>
                    </>
                  ) : (
                    <></>
                  )
                )}
              </div>
            </div>

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
        </ScrollArea>
        <ChatSupport book={book} chapter={chapter} question={question} />
      </main>
    </div>
  );
}
function Sidebar(bookInfo: any, chapter: any, book: any, booksCategorized: any) {
  return (
    <ScrollArea className="h-full mt-4 pr-3">
      <h2 className="text-xl font-semibold mb-4">Chapters</h2>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: bookInfo.c }, (_, i) => i + 1).map((c) => (
          <Button key={c} variant={chapter == c ? "default" : "outline"} size="sm" asChild>
            <Link href={`/asv/${book}/${c}`}>{c}</Link>
          </Button>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-4 mt-6">Books</h2>
      <BibleBooksList booksCategorized={booksCategorized} aside={true} />
    </ScrollArea>
  );
}
