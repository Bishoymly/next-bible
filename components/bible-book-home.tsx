"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function BibleBookHome() {
  // This would typically come from a data source
  const bookInfo = {
    title: "Genesis",
    introText: [
      "Genesis, the first book of the Bible, serves as the foundational text of both the Old Testament and the entire biblical narrative. Its title, derived from the Greek word “Genesis,” means “origin” or “beginning,” which perfectly captures the essence of the book as it lays the groundwork for the rest of Scripture.",
      "Traditionally attributed to Moses, Genesis is part of the Pentateuch (the first five books of the Bible), which he is believed to have authored during Israel’s wilderness journey around the 15th or 13th century BC. Though some modern scholars debate the exact dating and authorship, the book has been historically recognized as divinely inspired and foundational to the Jewish, Christian, and Islamic faiths.",
    ],
    chapterCount: 50,
    previousBook: "Malachi", // Circular navigation: last book of Old Testament
    nextBook: "Exodus",
  };

  const chapterGroups = [
    { title: "Creation and Early History", startChapter: 1 },
    { title: "Noah and the Flood", startChapter: 6 },
    { title: "Abraham and Isaac", startChapter: 12 },
    { title: "Jacob and Esau", startChapter: 26 },
    { title: "Joseph and his Brothers", startChapter: 37 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" asChild>
          <Link href={`/books/${bookInfo.previousBook.toLowerCase()}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {bookInfo.previousBook}
          </Link>
        </Button>
        <h1 className="text-4xl font-bold text-center">{bookInfo.title}</h1>
        <Button variant="ghost" asChild>
          <Link href={`/books/${bookInfo.nextBook.toLowerCase()}`}>
            {bookInfo.nextBook}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="max-w-5xl mx-auto p-4">
        <div className="float-right ml-4 mb-4 max-w-xs">
          <Image src="/img/genesis.webp" alt="Descriptive Alt Text" width={300} height={300} className="rounded shadow-md mb-6" />
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
        {bookInfo.introText.map((text, i) => (
          <p key={i} className="text-lg sub leading-relaxed mb-6">
            {text}
          </p>
        ))}

        <h2 className="text-xl font-semibold my-4">Sections</h2>
        {chapterGroups.map((group) => (
          <Button key={group.title} variant="outline" className="mr-2 mb-2" size="lg" asChild>
            <Link href={`/asv/genesis/${group.startChapter}`}>{group.title}</Link>
          </Button>
        ))}

        <h2 className="text-xl font-semibold my-4">Chapters</h2>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: bookInfo.chapterCount }, (_, i) => i + 1).map((chapter) => (
            <Button key={chapter} variant="outline" size="sm" asChild>
              <Link href={`/asv/genesis/${chapter}`}>{chapter}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
