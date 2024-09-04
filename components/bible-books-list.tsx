"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";

export function BibleBooksList({ booksCategorized }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">ASV</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Old Testament</h2>
          <div className="rounded-md border p-4">
            {booksCategorized.oldTestament.map((group, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-medium mb-2">{group.category}</h3>
                <ul className="space-y-1">
                  {group.books.map((book, bookIndex) => (
                    <li key={bookIndex} className="text-sm">
                      <Button key={book} variant="ghost" asChild>
                        <Link href={`/asv/${book.toLowerCase().replace(/ /g, "-")}`}>{book}</Link>
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
          <h2 className="text-2xl font-semibold mb-4">New Testament</h2>
          <div className="rounded-md border p-4">
            {booksCategorized.newTestament.map((group, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-medium mb-2">{group.category}</h3>
                <ul className="space-y-1">
                  {group.books.map((book, bookIndex) => (
                    <li key={bookIndex} className="text-sm">
                      <Button key={book} variant="ghost" asChild>
                        <Link href={`/asv/${book.toLowerCase().replace(/ /g, "-")}`}>{book}</Link>
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
