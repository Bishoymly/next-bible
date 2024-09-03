"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Book, ChevronLeft, ChevronRight, Globe, Menu, Search, Share2, Facebook, Twitter, Linkedin, ChevronFirst, ChevronLast } from "lucide-react";
import Image from "next/image";

const translations = {
  en: {
    KJV: {
      "Genesis 1:1": "In the beginning God created the heaven and the earth.",
      "Genesis 1:2": "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
      "Genesis 1:3": "And God said, Let there be light: and there was light.",
      "Genesis 1:4": "And God saw the light, that it was good: and God divided the light from the darkness.",
      "Genesis 1:5": "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
    },
    NIV: {
      "Genesis 1:1": "In the beginning God created the heavens and the earth.",
      "Genesis 1:2": "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
      "Genesis 1:3": 'And God said, "Let there be light," and there was light.',
      "Genesis 1:4": "God saw that the light was good, and he separated the light from the darkness.",
      "Genesis 1:5": 'God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.',
    },
  },
  es: {
    RVR1960: {
      "Génesis 1:1": "En el principio creó Dios los cielos y la tierra.",
      "Génesis 1:2": "Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.",
      "Génesis 1:3": "Y dijo Dios: Sea la luz; y fue la luz.",
      "Génesis 1:4": "Y vio Dios que la luz era buena; y separó Dios la luz de las tinieblas.",
      "Génesis 1:5": "Y llamó Dios a la luz Día, y a las tinieblas llamó Noche. Y fue la tarde y la mañana un día.",
    },
  },
};

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

const SocialShareButtons = ({ language, verseKey, verseText }) => {
  const [linkCopied, setLinkCopied] = useState(false);

  const shareUrl = `https://biblestudy.com/verse/${verseKey}`;
  const shareText = `${verseKey}: ${verseText}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <div className="flex space-x-2 mt-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")}>
              <Facebook className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Facebook</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank")}>
              <Twitter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Twitter</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, "_blank")}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on LinkedIn</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              {linkCopied ? <span className="text-xs">{uiText[language].linkCopied}</span> : <Share2 className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{uiText[language].copyLink}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export function BibleReader() {
  const [showCommentary, setShowCommentary] = useState(false);
  const [language, setLanguage] = useState("en");
  const [selectedTranslations, setSelectedTranslations] = useState(["KJV", "NIV"]);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/t_asv.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  //const translations = data.translations;
  //const uiText = data.uiText;

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setSelectedTranslations(Object.keys(translations[newLanguage]).slice(0, 2));
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Collapsible Sidebar */}
      <aside className={`hidden md:flex flex-col border-r transition-all duration-300 ${sidebarExpanded ? "w-64" : "w-16"}`}>
        <div className={`p-4 border-b flex items-center ${sidebarExpanded ? "justify-between" : "justify-center"}`}>
          {sidebarExpanded && (
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={uiText[language].selectBook} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="genesis">Genesis</SelectItem>
                <SelectItem value="exodus">Exodus</SelectItem>
                <SelectItem value="leviticus">Leviticus</SelectItem>
                {/* Add more books here */}
              </SelectContent>
            </Select>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSidebarExpanded(!sidebarExpanded)} aria-label={sidebarExpanded ? uiText[language].collapseSidebar : uiText[language].expandSidebar}>
            {sidebarExpanded ? <ChevronFirst /> : <ChevronLast />}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className={`p-4 space-y-2 ${sidebarExpanded ? "" : "flex flex-col items-center"}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className={`w-full justify-start ${sidebarExpanded ? "" : "px-2"}`}>
                    <Book className="h-4 w-4" />
                    {sidebarExpanded && <span className="ml-2">{uiText[language].selectChapter} 1</span>}
                  </Button>
                </TooltipTrigger>
                {!sidebarExpanded && <TooltipContent side="right">{uiText[language].selectChapter} 1</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className={`w-full justify-start ${sidebarExpanded ? "" : "px-2"}`}>
                    <Book className="h-4 w-4" />
                    {sidebarExpanded && <span className="ml-2">{uiText[language].selectChapter} 2</span>}
                  </Button>
                </TooltipTrigger>
                {!sidebarExpanded && <TooltipContent side="right">{uiText[language].selectChapter} 2</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className={`w-full justify-start ${sidebarExpanded ? "" : "px-2"}`}>
                    <Book className="h-4 w-4" />
                    {sidebarExpanded && <span className="ml-2">{uiText[language].selectChapter} 3</span>}
                  </Button>
                </TooltipTrigger>
                {!sidebarExpanded && <TooltipContent side="right">{uiText[language].selectChapter} 3</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
            {/* Add more chapters here */}
          </div>
        </ScrollArea>
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
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>{uiText[language].bibleNavigation}</SheetTitle>
                  <SheetDescription>{uiText[language].selectBookOrChapter}</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={uiText[language].selectBook} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="genesis">Genesis</SelectItem>
                      <SelectItem value="exodus">Exodus</SelectItem>
                      <SelectItem value="leviticus">Leviticus</SelectItem>
                      {/* Add more books here */}
                    </SelectContent>
                  </Select>
                </div>
                <ScrollArea className="h-[calc(100vh-10rem)]">
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Book className="mr-2 h-4 w-4" />
                      {uiText[language].selectChapter} 1
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Book className="mr-2 h-4 w-4" />
                      {uiText[language].selectChapter} 2
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Book className="mr-2 h-4 w-4" />
                      {uiText[language].selectChapter} 3
                    </Button>
                    {/* Add more chapters here */}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <h1 className="text-2xl font-bold ml-4">Genesis 1</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[130px]">
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
              <ChevronLeft />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight />
            </Button>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder={uiText[language].search} />
            </div>
          </div>
        </header>

        {/* Bible Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <Tabs value={selectedTranslations[0]} onValueChange={(value) => setSelectedTranslations([value, ...selectedTranslations.slice(1)])}>
              <TabsList>
                {Object.keys(translations[language]).map((translation) => (
                  <TabsTrigger key={translation} value={translation}>
                    {translation}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(translations[language]).map(([translation, verses]) => (
                <TabsContent key={translation} value={translation}>
                  <div className="text-lg leading-relaxed">
                    {data?.resultset.row
                      .filter((row) => row.field[1] === 1 && row.field[2] === 1)
                      .map((row, index, array) => (
                        <span
                          key={row.field[1]}
                          className={`inline ${row.field[1] === "Genesis 1:3" ? "bg-primary/10 px-1 rounded cursor-pointer" : ""}`}
                          onClick={() => {
                            if (row.field[1] === "Genesis 1:3") setShowCommentary(true);
                            setSelectedVerse({ key: row.field[1], text: row.field[4] });
                          }}
                        >
                          <sup className="text-xs font-semibold text-muted-foreground mr-1">{row.field[3]}</sup>
                          {row.field[4]}
                          {index < array.length - 1 && " "}
                        </span>
                      ))}
                  </div>
                  {selectedVerse && <SocialShareButtons language={language} verseKey={selectedVerse.key} verseText={selectedVerse.text} />}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="mt-8">
            <Image src="/placeholder.svg?height=400&width=600" alt="Illustration of Creation" className="rounded-lg mx-auto" width={600} height={400}></Image>
            <p className="text-center text-sm text-muted-foreground mt-2">Illustration: The Creation of Light</p>
          </div>
        </ScrollArea>
      </main>

      {/* Commentary Sidebar */}
      <Sheet open={showCommentary} onOpenChange={setShowCommentary}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{uiText[language].commentary} Genesis 1:3</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
            <div className="space-y-4">
              <p>
                &quot;Let there be light&quot; - This phrase marks the beginning of God&apos;s creative work in forming the universe. The command demonstrates God&apos;s power to bring order out of
                chaos through His spoken word.
              </p>
              <p>
                The nature of this light has been debated, as the sun and stars are not created until the fourth day. Some interpret this as the creation of energy itself, while others see it as
                God&apos;s presence illuminating the darkness.
              </p>
              <p>This verse is often seen as a metaphor for spiritual illumination, with God&apos;s light piercing the darkness of human understanding and sin.</p>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
