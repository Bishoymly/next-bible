"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
import { Amiri } from "next/font/google";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export function BibleBooksList({ language, version, booksCategorized, aside }) {
  return (
    <div className="container mx-auto p-4">
      {aside ? <></> : <h1 className="text-2xl font-bold text-center mb-8">{version.toUpperCase()}</h1>}
      <div className={`grid gap-8 ${aside ? "" : "md:grid-cols-2"}`}>
        <div>
          <h2 className="text-2xl font-semibold mb-4">{language == "en" ? "Old Testament" : "العهد القديم"}</h2>
          <div className={aside ? "" : "rounded-md border p-4"}>
            {booksCategorized.oldTestament.map((group, index) => (
              <div key={index} className="mb-6">
                {/*<h3 className="font-medium mb-2 text-muted-foreground">{group.category}</h3>*/}
                <ul className="space-y-1">
                  {group.books.map((book, bookIndex) => (
                    <li key={bookIndex}>
                      <Button key={book} variant="ghost" className={language == "ar" ? `${amiri.className} text-xl leading-loose` : "text-sm leading-relaxed"} asChild>
                        <Link href={`/${version}/${book.slug}`}>{book.n}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
                {index < booksCategorized.oldTestament.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">{language == "en" ? "New Testament" : "العهد الجديد"}</h2>
          <div className={aside ? "" : "rounded-md border p-4"}>
            {booksCategorized.newTestament.map((group, index) => (
              <div key={index} className="mb-6">
                {/*<h3 className="font-medium mb-2 text-muted-foreground">{group.category}</h3>*/}
                <ul className="space-y-1">
                  {group.books.map((book, bookIndex) => (
                    <li key={bookIndex} className="text-sm">
                      <Button key={book} variant="ghost" className={language == "ar" ? `${amiri.className} text-xl leading-loose` : "text-sm leading-relaxed"} asChild>
                        <Link href={`/${version}/${book.slug}`}>{book.n}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
                {index < booksCategorized.newTestament.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
