import { BibleReader } from "@/components/bible-reader";
import { getBibleJson, swapSectionAndParagraph } from "@/lib/getBibleText";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";
import getEsvBibleText from "@/lib/getEsvBibleText";
import getVersions from "@/lib/getVersions";
import groupChildrenByTags from "@/lib/groupChildrenByTag";

export default async function Read({ params, searchParams }) {
  const { version, book, chapter } = params;
  const versions = getVersions();
  const language = versions.filter((v) => v.id === version)[0].lang;
  const books = getBooks(language);
  const bookInfo = books.filter((b) => b.slug === book)[0];

  const version2 = searchParams.side || "study";
  const language2 = versions.filter((v) => v.id === version2)[0].lang;

  let json = null;
  if (version === "esv") {
    json = await getEsvBibleText(book + "+" + chapter);
  } else {
    json = getBibleJson(bookInfo.b, version)["chapters"][parseInt(chapter)];
    if (json["front"]) {
      json["0"] = json["front"];
      delete json.front;
    }
    json = swapSectionAndParagraph(json);
    json = groupChildrenByTags(json);
  }

  let json2 = null;
  if (version2 != "study") {
    if (version2 === "esv") {
      json2 = await getEsvBibleText(book + "+" + chapter);
    } else {
      json2 = getBibleJson(bookInfo.b, version2)["chapters"][parseInt(chapter)];
      if (json2["front"]) {
        json2["0"] = json2["front"];
        delete json2.front;
      }
      json2 = swapSectionAndParagraph(json2);
      json2 = groupChildrenByTags(json2);
    }
  }

  const booksCategorized = getBooksCategorized(language);

  return (
    <BibleReader
      language={language}
      book={book}
      bookInfo={bookInfo}
      chapter={chapter}
      version={version}
      version2={version2}
      versions={versions}
      json={json}
      json2={json2}
      language2={language2}
      booksCategorized={booksCategorized}
      books={books}
    />
  );
}
