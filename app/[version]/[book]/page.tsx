"use server";
import { BibleBookHome } from "@/components/bible-book-home";
import curateBook from "@/lib/curateBook";
import getBooks from "@/lib/getBooks";

export default async function BookPage({ params }) {
  const book = params.book;
  const books = getBooks();
  const bookInfo = books.filter((b) => b.n.toLowerCase() === book.replace(/-/g, " "))[0];
  const curation = await curateBook(book);

  return <BibleBookHome book={book} curation={curation} bookInfo={bookInfo} />;
}
