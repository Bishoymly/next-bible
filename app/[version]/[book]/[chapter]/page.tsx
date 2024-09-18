import { BibleReader } from "@/components/bible-reader";
import { getBibleJson, swapSectionAndParagraph } from "@/lib/getBibleText";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";

export default async function Read({ params }) {
  const { version, book, chapter } = params;
  const language = version == "avd" ? "ar" : "en";
  const books = getBooks(language);
  const bookInfo = books.filter((b) => b.slug === book)[0];
  let json = getBibleJson(bookInfo.b, version)["chapters"][parseInt(chapter)];
  if (json["front"]) {
    json["0"] = json["front"];
    delete json.front;
  }
  json = swapSectionAndParagraph(json);

  const booksCategorized = getBooksCategorized(language);

  return <BibleReader language={language} book={book} bookInfo={bookInfo} chapter={chapter} version={version} json={json} booksCategorized={booksCategorized} />;
}
