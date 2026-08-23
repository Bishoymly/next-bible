import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "public", "generated", "scripture");
const catalogPath = path.join(base, "catalog.json");
if (!fs.existsSync(catalogPath)) throw new Error("Generated catalog is missing. Run npm run data:build first.");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const expectedVerseCounts = { bsb: 31086, asv: 31086, kjv: 31102, avd: 31104 };
if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.versions)) throw new Error("Invalid catalog schema");
for (const version of catalog.versions) {
  if (!version.source?.license || !Array.isArray(version.source.urls) || !version.source.urls.every((url) => /^https:\/\//.test(url))) {
    throw new Error(`${version.id} has unsafe source metadata`);
  }
  if (version.books.length !== 66) throw new Error(`${version.id} has ${version.books.length} books`);
  let chapters = 0;
  let entries = 0;
  for (const book of version.books) {
    const file = JSON.parse(fs.readFileSync(path.join(base, version.id, `${book.slug}.json`), "utf8"));
    const bookChapters = Object.values(file.chapters);
    chapters += bookChapters.length;
    for (const verses of bookChapters) {
      if (!Array.isArray(verses) || !verses.length || verses.some((verse) => !verse.text?.trim())) throw new Error(`${version.id}/${book.slug} has empty verse content`);
      entries += verses.length;
    }
  }
  if (chapters !== 1189) throw new Error(`${version.id} has ${chapters} chapters`);
  const search = JSON.parse(fs.readFileSync(path.join(base, "search", `${version.id}.json`), "utf8"));
  if (!Array.isArray(search.entries) || search.entries.length !== entries || search.entries.some((entry) => entry.version !== version.id || !entry.book || !entry.bookSlug || !entry.chapter || !entry.verse || !entry.text?.trim())) throw new Error(`${version.id} search index is invalid`);
  if (entries !== expectedVerseCounts[version.id]) throw new Error(`${version.id} has ${entries} verses; expected ${expectedVerseCounts[version.id]}`);
  console.log(`${version.id}: 66 books, 1189 chapters, ${entries} search entries`);
}
