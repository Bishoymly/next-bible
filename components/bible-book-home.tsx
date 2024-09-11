"use client";
import localFont from "next/font/local";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Menu, Search } from "lucide-react";
import Link from "next/link";
import { BibleBooksList } from "@/components/bible-books-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const titleFont = localFont({
  src: "./../public/game-of-thrones.ttf",
  display: "swap",
});

export function BibleBookHome({ book, curation, bookInfo, booksCategorized }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Collapsible Sidebar */}
      <aside className={`hidden md:flex flex-col border-r transition-all duration-300 w-64`}>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            <BibleBooksList booksCategorized={booksCategorized} aside={true} />
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <ScrollArea className="flex-1 h-full mt-4">
                    <div className="space-y-2">
                      <BibleBooksList booksCategorized={booksCategorized} aside={true} />
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link href={`/asv/${bookInfo.previousBook?.toLowerCase().replace(/ /g, "-")}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {bookInfo.previousBook}
                </Link>
              </Button>
              <h1 className={`text-4xl font-bold text-center ${titleFont.className}`}>{bookInfo.n.replace(/1/g, "I ").replace(/2/g, "II ")}</h1>
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link href={`/asv/${bookInfo.nextBook?.toLowerCase().replace(/ /g, "-")}`}>
                  {bookInfo.nextBook}
                  <ChevronRight className="ml-2 h-4 w-4" />
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
                <p key={i} className="text-lg sub leading-relaxed mb-6">
                  {text}
                </p>
              ))}

              <h2 className="text-xl font-semibold my-6">Sections</h2>
              {curation.sections.map((group) => (
                <Button key={group.title} variant="outline" className="mr-2 mb-2 text-wrap h-auto py-2" asChild>
                  <Link href={`/asv/${book}/${group.fromChapter}`}>
                    {group.fromChapter ? (group.fromChapter === group.toChapter ? `${group.title} (${group.fromChapter})` : `${group.title} (${group.fromChapter}-${group.toChapter})`) : group.title}
                  </Link>
                </Button>
              ))}

              <h2 className="text-xl font-semibold my-6">Chapters</h2>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {Array.from({ length: bookInfo.c }, (_, i) => i + 1).map((chapter) => (
                  <Button key={chapter} variant="outline" size="sm" asChild>
                    <Link href={`/asv/${book}/${chapter}`}>{chapter}</Link>
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
