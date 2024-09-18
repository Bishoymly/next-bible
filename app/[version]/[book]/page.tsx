"use server";
import { BibleBookHome } from "@/components/bible-book-home";
import curateBook from "@/lib/curateBook";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";

export default async function BookPage({ params }) {
  const { version, book } = params;
  const language = version == "asv" ? "en" : "ar";
  const books = getBooks(language);
  const booksCategorized = getBooksCategorized(language);
  let bookInfo = books.filter((b) => b.slug === book)[0];
  bookInfo.previousBook = bookInfo.b === 1 ? books[books.length - 1] : books[books.indexOf(bookInfo) - 1];
  bookInfo.nextBook = bookInfo.b === books.length ? books[0] : books[books.indexOf(bookInfo) + 1];
  const curation = await curateBook(book);

  return <BibleBookHome language={language} version={version} book={book} curation={curation} bookInfo={bookInfo} booksCategorized={booksCategorized} />;
}
