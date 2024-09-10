"use server";
import { BibleBookHome } from "@/components/bible-book-home";
import curateBook from "@/lib/curateBook";
import { GetCachedImage } from "@/lib/generateImage";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";

export default async function BookPage({ params }) {
  const book = params.book;
  const booksCategorized = getBooksCategorized();
  const books = getBooks();
  let bookInfo = books.filter((b) => b.n.toLowerCase() === book.replace(/-/g, " "))[0];
  bookInfo.previousBook = bookInfo.b === 1 ? books[books.length - 1].n : books[books.indexOf(bookInfo) - 1].n;
  bookInfo.nextBook = bookInfo.b === books.length ? books[0].n : books[books.indexOf(bookInfo) + 1].n;

  const curation = await curateBook(book);
  const imageUrl = await GetCachedImage(book + "-intro");

  return <BibleBookHome book={book} curation={curation} bookInfo={bookInfo} imageUrl={imageUrl} booksCategorized={booksCategorized} />;
}
