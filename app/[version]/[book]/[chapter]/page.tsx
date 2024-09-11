import { BibleReader } from "@/components/bible-reader";
import { getBibleJson } from "@/lib/getBibleText";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";

export default async function Read({ params }) {
  const { version, book, chapter } = params;
  const books = getBooks();
  const bookInfo = books.filter((b) => b.n.toLowerCase() === book.replace(/-/g, " "))[0];
  const json = getBibleJson(bookInfo.b, version)["chapters"][parseInt(chapter)];
  const booksCategorized = getBooksCategorized();
  return <BibleReader book={book} bookInfo={bookInfo} chapter={chapter} version={version} json={json} booksCategorized={booksCategorized} />;
}
