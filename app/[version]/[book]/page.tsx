"use server";
import { BibleBookHome } from "@/components/bible-book-home";
import curateBook from "@/lib/curateBook";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";
import getVersions from "@/lib/getVersions";

export default async function BookPage({ params }: { params: Promise<{ version: string; book: string }> }) {
  const { version, book } = await params;
  const versions = getVersions();
  const versionInfo = versions.find((v) => v.id === version);
  if (!versionInfo) {
    throw new Error(`Version ${version} not found`);
  }
  const language = versionInfo.lang;
  const books = getBooks(language);
  const booksCategorized = getBooksCategorized(language);
  const bookInfo = books.find((b) => b.slug === book);
  if (!bookInfo) {
    throw new Error(`Book ${book} not found`);
  }
  bookInfo.previousBook = bookInfo.b === 1 ? books[books.length - 1] : books[books.indexOf(bookInfo) - 1];
  bookInfo.nextBook = bookInfo.b === books.length ? books[0] : books[books.indexOf(bookInfo) + 1];
  const curation = await curateBook(language, book);

  return <BibleBookHome language={language} versions={versions} version={version} book={book} curation={curation} bookInfo={bookInfo} booksCategorized={booksCategorized} />;
}
