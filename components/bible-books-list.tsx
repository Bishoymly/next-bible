"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
import { Amiri } from "next/font/google";
import { uiText } from "@/lib/uiText";
import versionsDropDown from "./versions-drop-down";
import { useState } from "react";
import ChaptersList from "./chapters-list";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export function BibleBooksList({ language, versions, version, book, chapter, booksCategorized, aside }) {
  const [openBook, setOpenBook] = useState(book);
  let v = null;
  if (versions) v = versions.filter((v) => v.id === version)[0];

  return (
    <div className={`container mx-auto py-4 ${language == "Arabic" ? "[direction:rtl]" : ""}`}>
      {aside ? (
        <></>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-center mb-2">{versionsDropDown(versions, version, null, null, null, false)}</h1>
          <h1 className="text-xl font-bold text-center mb-4">{v.name}</h1>
          <p className="text-left mb-8">{v.desc}</p>
        </>
      )}
      <div className={`grid gap-8 ${aside ? "" : "md:grid-cols-2"}`}>
        <div>
          <h2 className="text-2xl font-semibold mb-4">{uiText[language].oldTestament}</h2>
          <div className={aside ? "" : "rounded-md border p-4"}>
            {booksCategorized.oldTestament.map((group, index) => (
              <div key={index} className="mb-6">
                {!aside && <h3 className="font-medium mb-2 text-muted-foreground">{group.category}</h3>}
                <ul className="space-y-0">
                  {group.books.map((bookInfo, bookIndex) => (
                    <li key={bookIndex}>
                      <Button
                        variant="ghost"
                        className={language == "Arabic" ? `${amiri.className} text-xl leading-loose` : "text-sm leading-relaxed"}
                        onClick={() => setOpenBook(bookInfo.slug === openBook ? null : bookInfo.slug)}
                      >
                        {bookInfo.n}
                      </Button>
                      <div key={bookIndex + "c"} className={`overflow-hidden transition-all duration-300 ${bookInfo.slug === openBook ? "max-h-[1300px]" : "max-h-0"}`}>
                        <ChaptersList language={language} version={version} book={bookInfo.slug} chaptersCount={bookInfo.c} chapter={bookInfo.slug === book ? chapter : null} aside={aside} />
                      </div>
                    </li>
                  ))}
                </ul>
                {index < booksCategorized.oldTestament.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">{uiText[language].newTestament}</h2>
          <div className={aside ? "" : "rounded-md border p-4"}>
            {booksCategorized.newTestament.map((group, index) => (
              <div key={index} className="mb-6">
                {!aside && <h3 className="font-medium mb-2 text-muted-foreground">{group.category}</h3>}
                <ul className="space-y-1">
                  {group.books.map((bookInfo, bookIndex) => (
                    <li key={bookIndex}>
                      <Button
                        variant="ghost"
                        className={language == "Arabic" ? `${amiri.className} text-xl leading-loose` : "text-sm leading-relaxed"}
                        onClick={() => setOpenBook(bookInfo.slug === openBook ? null : bookInfo.slug)}
                      >
                        {bookInfo.n}
                      </Button>
                      <div key={bookIndex + "c"} className={`overflow-hidden transition-all duration-300 ${bookInfo.slug === openBook ? "max-h-[1300px]" : "max-h-0"}`}>
                        <ChaptersList language={language} version={version} book={bookInfo.slug} chaptersCount={bookInfo.c} chapter={bookInfo.slug === book ? chapter : null} aside={aside} />
                      </div>
                    </li>
                  ))}
                </ul>
                {index < booksCategorized.newTestament.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
