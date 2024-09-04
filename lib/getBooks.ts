import fs from "fs";
import path from "path";

export default function getBooks() {
  const filePath = path.join(process.cwd(), "public", "data", "key_english.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const books = JSON.parse(fileContents).resultset.keys;
  return books;
}
