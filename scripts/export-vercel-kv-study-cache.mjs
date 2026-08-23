import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const restUrl = process.env.KV_REST_API_URL;
const restToken = process.env.KV_REST_API_TOKEN;

if (!restUrl || !restToken) {
  throw new Error("KV_REST_API_URL and KV_REST_API_TOKEN are required to export the legacy study cache.");
}

const outputRoot = path.join(process.cwd(), "public", "generated", "study-cache");
const allowedSlug = /^[a-z0-9-]+$/;

async function command(commandPath) {
  const response = await fetch(`${restUrl}/${commandPath}`, {
    headers: { Authorization: `Bearer ${restToken}` },
  });
  if (!response.ok) throw new Error(`KV request failed with ${response.status}.`);
  const body = await response.json();
  if (body.error) throw new Error(body.error);
  return body.result;
}

function parseValue(value) {
  if (typeof value === "string") return JSON.parse(value);
  return value;
}

function cacheLocation(key) {
  const parts = key.split("/");
  const isExplicitLanguage = parts[0] === "English" || parts[0] === "Arabic";
  const language = isExplicitLanguage ? parts.shift() : "English";
  if (!parts.length || !parts.every((part) => allowedSlug.test(part))) return null;
  const sourcePriority = isExplicitLanguage ? 2 : 1;
  if (parts.length === 1) return { language, type: "book", book: parts[0], sourcePriority };
  if (parts.length === 2 && /^\d+$/.test(parts[1])) return { language, type: "chapter", book: parts[0], chapter: parts[1], sourcePriority };
  return null;
}

function normalizeChapter(content, language, book, chapter) {
  if (!Array.isArray(content?.sections) || !Array.isArray(content?.questions)) return null;
  const sections = content.sections
    .filter((section) => typeof section?.title === "string")
    .map((section) => ({
      title: section.title,
      fromVerse: Number(section.fromVerse) || 1,
      toVerse: Number(section.toVerse) || Number(section.fromVerse) || 1,
      observations: Array.isArray(section.commentary) ? section.commentary : Array.isArray(section.observations) ? section.observations : [],
    }));
  if (!sections.length) return null;
  return {
    schemaVersion: 1,
    provenance: { method: "Restored pre-generated study cache.", translation: language, passage: `${book} ${chapter}` },
    sections,
    importantVerses: Array.isArray(content.importantVerses) ? content.importantVerses : [],
    questions: content.questions,
    alternateViews: Array.isArray(content.alternateViews) ? content.alternateViews : undefined,
  };
}

function normalizeBook(content) {
  if (!Array.isArray(content?.overviewParagraphs)) return null;
  return {
    overviewParagraphs: content.overviewParagraphs.filter((paragraph) => typeof paragraph === "string"),
    sections: Array.isArray(content.sections)
      ? content.sections
        .filter((section) => typeof section?.title === "string")
        .map((section) => ({
          title: section.title,
          fromChapter: Number(section.fromChapter ?? section.startChapter) || 1,
          toChapter: Number(section.toChapter ?? section.endChapter ?? section.fromChapter ?? section.startChapter) || 1,
        }))
      : [],
  };
}

async function exportEntry(key) {
  const location = cacheLocation(key);
  if (!location) return null;
  const encodedKey = encodeURIComponent(key);
  const cached = await command(`get/${encodedKey}`);
  if (!cached) return null;
  const content = parseValue(cached);
  const normalized = location.type === "chapter"
    ? normalizeChapter(content, location.language, location.book, location.chapter)
    : normalizeBook(content);
  if (!normalized) return null;
  const file = location.type === "chapter"
    ? path.join(outputRoot, location.language, "chapters", location.book, `${location.chapter}.json`)
    : path.join(outputRoot, location.language, "books", `${location.book}.json`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(normalized)}\n`);
  return location.type;
}

const keys = await command("keys/%2A");
const preferredEntries = new Map();
for (const key of keys) {
  const location = cacheLocation(key);
  if (!location) continue;
  const identifier = `${location.language}/${location.type}/${location.book}/${location.chapter ?? ""}`;
  const current = preferredEntries.get(identifier);
  if (!current || location.sourcePriority > current.sourcePriority) preferredEntries.set(identifier, location);
}
const entries = [...preferredEntries.values()].map((location) => location.type === "chapter"
  ? `${location.language}/${location.book}/${location.chapter}`
  : `${location.language}/${location.book}`);
const counts = { book: 0, chapter: 0, skipped: 0 };
const concurrency = 24;

for (let index = 0; index < entries.length; index += concurrency) {
  const results = await Promise.all(entries.slice(index, index + concurrency).map(exportEntry));
  for (const result of results) {
    if (result === "book") counts.book += 1;
    else if (result === "chapter") counts.chapter += 1;
    else counts.skipped += 1;
  }
}

console.log(`Exported ${counts.chapter} chapter studies and ${counts.book} book overviews. Skipped ${counts.skipped} invalid cache entries.`);
