import { BibleReader } from "@/components/bible-reader";
import { getBibleJson } from "@/lib/getBibleText";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";

export default async function Read({ params }) {
  const { version, book, chapter } = params;
  const books = getBooks();
  const bookInfo = books.filter((b) => b.n.toLowerCase() === book.replace(/-/g, " "))[0];
  const json = getBibleJson(bookInfo.b, version)["chapters"][parseInt(chapter)];
  if (json["front"]) {
    json["0"] = json["front"];
    delete json.front;
  }

  const booksCategorized = getBooksCategorized();
  const language = version == "asv" ? "en" : "ar";
  return <BibleReader language={language} book={book} bookInfo={bookInfo} chapter={chapter} version={version} json={json} booksCategorized={booksCategorized} />;
}
