"use server";
import { BibleBookHome } from "@/components/bible-book-home";
import { BibleBooksList } from "@/components/bible-books-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import curateBook from "@/lib/curateBook";
import GenerateImage, { GetCachedImage } from "@/lib/generateImage";
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

  return (
    <div className="flex h-screen bg-background">
      {/* Collapsible Sidebar */}
      <aside className={`hidden md:flex flex-col border-r transition-all duration-300 w-64`}>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            <BibleBooksList booksCategorized={booksCategorized} aside={true} />
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <BibleBookHome book={book} curation={curation} bookInfo={bookInfo} imageUrl={imageUrl} />
        </ScrollArea>
      </main>
    </div>
  );
}
