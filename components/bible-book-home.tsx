"use client";
import localFont from "next/font/local";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight, Home, Menu, Search } from "lucide-react";
import Link from "next/link";
import { BibleBooksList } from "@/components/bible-books-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Amiri, Inter } from "next/font/google";
import { uiText } from "@/lib/uiText";
import versionsDropDown from "./versions-drop-down";

const titleFont = localFont({
  src: "./../public/game-of-thrones.ttf",
  display: "swap",
});

const inter = Inter({ subsets: ["latin"] });
const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export function BibleBookHome({ language, versions, version, book, curation, bookInfo, booksCategorized }) {
  return (
    <div className={`flex h-screen bg-background ${language == "Arabic" ? `text-2xl leading-loose [direction:rtl] ${amiri.className}` : `text-lg leading-relaxed [direction:ltr] ${inter.className}`}`}>
      {/* Collapsible Sidebar */}
      <aside className={`hidden md:flex flex-col ${language == "Arabic" ? "border-l" : "border-r"} transition-all duration-300 w-64`}>
        <ScrollArea className={`flex-1 ${language == "Arabic" ? `text-2xl leading-loose [direction:rtl] ${amiri.className}` : `text-lg leading-relaxed [direction:ltr] ${inter.className}`}`}>
          <div className="p-4 space-y-2">
            <BibleBooksList language={language} versions={versions} version={version} booksCategorized={booksCategorized} aside={true} />
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className={`flex-1 ${language == "Arabic" ? `text-2xl leading-loose [direction:rtl] ${amiri.className}` : `text-lg leading-relaxed [direction:ltr] ${inter.className}`}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side={`${language == "English" ? "left" : "right"}`}>
                  <ScrollArea
                    className={`flex-1  h-full mt-4 ${
                      language == "Arabic" ? `text-2xl leading-loose [direction:rtl] ${amiri.className}` : `text-lg leading-relaxed [direction:ltr] ${inter.className}`
                    }`}
                  >
                    <div className="space-y-2">
                      <BibleBooksList language={language} versions={versions} version={version} booksCategorized={booksCategorized} aside={true} />
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link href={`/${version}/${bookInfo.previousBook?.slug}`}>
                  {language == "English" ? <ChevronLeft /> : <ChevronRight />}
                  {bookInfo.previousBook?.n}
                </Link>
              </Button>

              <div className="flex">
                <h1 className={`text-4xl font-bold text-center align-middle ${titleFont.className}`}>{bookInfo.n.replace(/1/g, "I ").replace(/2/g, "II ")}</h1>
                <span className="mx-3">{versionsDropDown(versions, version, book, null, null, false)}</span>
              </div>
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link href={`/${version}/${bookInfo.nextBook?.slug}`}>
                  {bookInfo.nextBook?.n}
                  {language == "English" ? <ChevronRight /> : <ChevronLeft />}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="invisible md:hidden">
                <Link href={`/asv`}>
                  <Search />
                </Link>
              </Button>
            </div>

            <div className="max-w-5xl mx-auto p-4">
              {curation.overviewParagraphs.map((text, i) => (
                <p key={i} className={`${language == "Arabic" ? "text-xl" : "text-lg"} sub leading-relaxed mb-6`}>
                  {text}
                </p>
              ))}

              <h2 className={`${language == "Arabic" ? "text-2xl" : "text-xl"} font-semibold my-6`}>{uiText[language].sections}</h2>
              {curation.sections.map((group) => (
                <Button key={group.title} variant="outline" className={`${language == "Arabic" ? "text-lg" : "text-base"} mr-2 mb-2 text-wrap h-auto py-2`} asChild>
                  <Link href={`/${version}/${book}/${group.fromChapter}`}>
                    {group.fromChapter ? (group.fromChapter === group.toChapter ? `${group.title} (${group.fromChapter})` : `${group.title} (${group.fromChapter}-${group.toChapter})`) : group.title}
                  </Link>
                </Button>
              ))}

              <h2 className={`${language == "Arabic" ? "text-2xl" : "text-xl"} font-semibold my-6`}>{uiText[language].chapters}</h2>
              <div className={`grid grid-cols-5 sm:grid-cols-10 gap-2 ${inter.className}`}>
                {Array.from({ length: bookInfo.c }, (_, i) => i + 1).map((chapter) => (
                  <Button key={chapter} variant="outline" size="sm" asChild>
                    <Link href={`/${version}/${book}/${chapter}`}>{chapter}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
