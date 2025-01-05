import fs from "fs";
import path from "path";
import getBooks from "./getBooks";

export default function getBooksCategorized(language) {
  const filePath = path.join(process.cwd(), "public", "data", `key_genre_${language.toLowerCase()}.json`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const groups = JSON.parse(fileContents);

  const books = getBooks(language);
  const results = {
    oldTestament: groups
      .filter((group) => group.testament === (language === "Arabic" ? "العهد القديم" : "Old Testament"))
      .map((group) => {
        return {
          category: group.n,
          books: books.filter((book) => book.g === group.g),
        };
      }),
    newTestament: groups
      .filter((group) => group.testament === (language === "Arabic" ? "العهد الجديد" : "New Testament"))
      .map((group) => {
        return {
          category: group.n,
          books: books.filter((book) => book.g === group.g),
        };
      }),
  };

  return results;
}
