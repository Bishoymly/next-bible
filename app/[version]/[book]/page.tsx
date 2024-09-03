"use server";
import { BibleBookHome } from "@/components/bible-book-home";
import curateBook from "@/lib/curateBook";
import fs from "fs";
import path from "path";

export default async function BookPage({ params }) {
  const book = params.book;
  const filePath = path.join(process.cwd(), "public", "data", "key_english.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const books = JSON.parse(fileContents);
  const bookInfo = books.resultset.keys.filter((b) => b.n.toLowerCase() === book.replace(/-/g, " "))[0];
  const curation = await curateBook(book);
  return <BibleBookHome book={book} curation={curation} bookInfo={bookInfo} />;
}
