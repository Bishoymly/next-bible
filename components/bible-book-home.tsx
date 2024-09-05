"use client";
import localFont from "next/font/local";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BookImage } from "./generated-image";

const titleFont = localFont({
  src: "./../public/game-of-thrones.ttf",
  display: "swap",
});

export function BibleBookHome({ book, curation, bookInfo }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" asChild>
          <Link href={`/asv/${bookInfo.previousBook?.toLowerCase().replace(/ /g, "-")}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {bookInfo.previousBook}
          </Link>
        </Button>
        <h1 className={`text-4xl font-bold text-center ${titleFont.className}`}>{bookInfo.n.replace(/1/g, "I ").replace(/2/g, "II ")}</h1>
        <Button variant="ghost" asChild>
          <Link href={`/asv/${bookInfo.nextBook?.toLowerCase()}.replace(/ /g, "-")`}>
            {bookInfo.nextBook}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="max-w-5xl mx-auto p-4">
        <div className="float-right ml-4 mb-4 max-w-xs">
          <div className="hidden aspect-w-16 aspect-h-9 mb-6">
            <iframe
              src="https://www.youtube.com/embed/GQI72THyO5I"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
          <div className="hidden aspect-w-16 aspect-h-9 mb-6">
            <iframe
              src="https://www.youtube.com/embed/F4isSyennFo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
        {curation.overviewParagraphs.map((text, i) => (
          <p key={i} className="text-lg sub leading-relaxed mb-6">
            {text}
          </p>
        ))}

        <h2 className="text-xl font-semibold my-6">Sections</h2>
        {curation.sections.map((group) => (
          <Button key={group.title} variant="outline" className="mr-2 mb-2" size="lg" asChild>
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
  );
}
