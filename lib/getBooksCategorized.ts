import fs from "fs";
import path from "path";
import getBooks from "./getBooks";

export default function getBooksCategorized() {
  const filePath = path.join(process.cwd(), "public", "data", "key_genre_english.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const groups = JSON.parse(fileContents);

  const books = getBooks();
  const results = {
    oldTestament: groups
      .filter((group) => group.testament === "Old Testament")
      .map((group) => {
        return {
          category: group.n,
          books: books.filter((book) => book.g === group.g).map((book) => book.n),
        };
      }),
    newTestament: groups
      .filter((group) => group.testament === "New Testament")
      .map((group) => {
        return {
          category: group.n,
          books: books.filter((book) => book.g === group.g).map((book) => book.n),
        };
      }),
  };

  return results;
}
