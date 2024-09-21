import { BibleReader } from "@/components/bible-reader";
import { getBibleJson, swapSectionAndParagraph } from "@/lib/getBibleText";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";

export default async function Read({ params }) {
  const { version, book, chapter } = params;
  const language = version == "avd" ? "ar" : "en";
  const books = getBooks(language);
  const bookInfo = books.filter((b) => b.slug === book)[0];

  const version2 = version === "avd" ? "asv" : "avd";
  const language2 = language === "ar" ? "en" : "ar";

  let json = getBibleJson(bookInfo.b, version)["chapters"][parseInt(chapter)];
  if (json["front"]) {
    json["0"] = json["front"];
    delete json.front;
  }
  json = swapSectionAndParagraph(json);

  let json2 = getBibleJson(bookInfo.b, version2)["chapters"][parseInt(chapter)];
  if (json2["front"]) {
    json2["0"] = json2["front"];
    delete json2.front;
  }
  json2 = swapSectionAndParagraph(json2);

  const booksCategorized = getBooksCategorized(language);

  return <BibleReader language={language} book={book} bookInfo={bookInfo} chapter={chapter} version={version} json={json} json2={json2} language2={language2} booksCategorized={booksCategorized} />;
}
