import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const usfm = require("usfm-js");
const root = process.cwd();
const dataDir = path.join(root, "public", "data");
const outputDir = path.join(root, "public", "generated", "scripture");
const versions = JSON.parse(fs.readFileSync(path.join(dataDir, "versions.json"), "utf8"));
const sourceMetadata = JSON.parse(fs.readFileSync(path.join(dataDir, "sources.json"), "utf8"));

function cleanText(value) {
  return String(value ?? "").replace(/¶\s*/g, "").replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
}

function verseText(objects) {
  return cleanText((objects ?? []).map((object) => {
    const tag = object.tag ?? "";
    if (tag === "f" || object.type === "footnote" || tag === "ref" || tag === "ref*") return "";
    const lexical = /^\+?w$/.test(tag) ? String(object.content ?? "").split("|")[0] : "";
    const own = typeof object.text === "string" ? object.text : lexical;
    const children = Array.isArray(object.children) ? verseText(object.children) : "";
    return `${own}${children ? ` ${children}` : ""}`;
  }).join(" "));
}

function writeJson(filename, value) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, `${JSON.stringify(value)}\n`);
}

const catalog = { schemaVersion: 1, versions: [] };
for (const version of versions.filter((version) => version.id !== "study")) {
  const source = sourceMetadata.versions[version.id];
  if (!source) throw new Error(`Missing source metadata for ${version.id}`);
  const language = version.lang;
  const books = JSON.parse(fs.readFileSync(path.join(dataDir, `key_${language}.json`), "utf8")).resultset.keys;
  const catalogVersion = {
    id: version.id,
    name: version.name,
    language,
    direction: version.direction,
    source,
    books: books.map(({ b, c, n, slug, short }) => ({ id: b, chapters: c, name: n, slug, short })),
  };
  const index = [];
  for (const book of books) {
    const usfmPath = path.join(dataDir, version.id, `${book.b}.usfm`);
    const parsed = usfm.toJSON(fs.readFileSync(usfmPath, "utf8"));
    const chapters = {};
    for (const [chapter, verses] of Object.entries(parsed.chapters ?? {})) {
      const normalizedVerses = Object.entries(verses)
        .filter(([verse]) => /^\d+$/.test(verse))
        .map(([verse, body]) => ({ verse: Number(verse), text: verseText(body.verseObjects) }))
        .filter((item) => item.text);
      if (!normalizedVerses.length) throw new Error(`${version.id}/${book.slug}/${chapter} has no verse text`);
      chapters[chapter] = normalizedVerses;
      for (const item of normalizedVerses) {
        index.push({ version: version.id, book: book.n, bookSlug: book.slug, chapter: Number(chapter), verse: item.verse, text: item.text });
      }
    }
    if (Object.keys(chapters).length !== book.c) throw new Error(`${version.id}/${book.slug} chapter mismatch`);
    writeJson(path.join(outputDir, version.id, `${book.slug}.json`), {
      schemaVersion: 1,
      version: version.id,
      book: { id: book.b, name: book.n, slug: book.slug },
      chapters,
    });
  }
  writeJson(path.join(outputDir, "search", `${version.id}.json`), { schemaVersion: 1, version: version.id, entries: index });
  catalog.versions.push(catalogVersion);
}
writeJson(path.join(outputDir, "catalog.json"), catalog);
const kjvJohn = JSON.parse(fs.readFileSync(path.join(outputDir, "kjv", "john.json"), "utf8"));
if (!kjvJohn.chapters[3].find((verse) => verse.verse === 16)?.text.startsWith("For God so loved")) throw new Error("KJV John 3:16 normalization lost its opening words");
const bsbJohn = JSON.parse(fs.readFileSync(path.join(outputDir, "bsb", "john.json"), "utf8"));
for (const number of [13, 18]) if (/[;)][;)]*$/.test(bsbJohn.chapters[1].find((verse) => verse.verse === number)?.text ?? "")) throw new Error(`BSB John 1:${number} contains reference residue`);
console.log(`Built ${catalog.versions.length} translations and ${catalog.versions.reduce((count, version) => count + version.books.length, 0)} normalized books.`);
