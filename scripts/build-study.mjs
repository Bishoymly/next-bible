import fs from "node:fs";
import path from "node:path";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const [version = "bsb", book, chapter] = process.argv.slice(2);
if (!book || !chapter || !/^\d+$/.test(chapter)) throw new Error("Usage: npm run study:build -- bsb genesis 1");
if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required. It is never printed by this command.");
const root = process.cwd();
const input = JSON.parse(fs.readFileSync(path.join(root, "public", "generated", "scripture", version, `${book}.json`), "utf8"));
const verses = input.chapters[chapter];
if (!Array.isArray(verses) || !verses.length) throw new Error("Canonical passage artifact is missing.");
const passage = verses.map(({ verse, text }) => `${verse}. ${text}`).join("\n");
const verseNumbers = new Set(verses.map(({ verse }) => verse));
const schema = z.object({
  sections: z.array(z.object({ title: z.string(), fromVerse: z.number().int(), toVerse: z.number().int(), observations: z.array(z.string()).min(1) })).min(1),
  importantVerses: z.array(z.object({ verse: z.number().int(), commentary: z.string(), crossReferences: z.array(z.object({ book: z.string(), chapter: z.number().int(), verse: z.number().int() })) })),
  questions: z.array(z.string()).min(2),
  alternateViews: z.array(z.object({ summary: z.string(), citedVerses: z.array(z.number().int()) })).optional(),
});
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { object } = await generateObject({
  model: openai("gpt-5.6-terra"),
  schema,
  providerOptions: { openai: { reasoningEffort: "medium" } },
  prompt: `Prepare a careful guided study of ${input.book.name} ${chapter} in ${version}. Use a quiet historic Protestant and Reformed interpretive posture without naming a tradition. Include alternate Christian views only when the passage is genuinely disputed and state them fairly. Every cited verse range must stay within this chapter. Do not invent text.\n\nCANONICAL PASSAGE\n${passage}`,
});
for (const section of object.sections) if (!verseNumbers.has(section.fromVerse) || !verseNumbers.has(section.toVerse) || section.fromVerse > section.toVerse) throw new Error("Model returned an invalid section citation.");
for (const item of object.importantVerses) if (!verseNumbers.has(item.verse)) throw new Error("Model returned an invalid important verse citation.");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "public", "generated", "scripture", "catalog.json"), "utf8"));
const catalogVersion = catalog.versions.find((item) => item.id === version);
for (const item of object.importantVerses) for (const reference of item.crossReferences) {
  const target = catalogVersion?.books.find((candidate) => candidate.name.toLowerCase() === reference.book.toLowerCase() || candidate.slug === reference.book.toLowerCase().replace(/\s+/g, "-"));
  if (!target) throw new Error(`Model returned an unknown cross-reference book: ${reference.book}`);
  const targetBook = JSON.parse(fs.readFileSync(path.join(root, "public", "generated", "scripture", version, `${target.slug}.json`), "utf8"));
  if (!targetBook.chapters?.[reference.chapter]?.some((verse) => verse.verse === reference.verse)) throw new Error(`Model returned an invalid cross-reference: ${reference.book} ${reference.chapter}:${reference.verse}`);
}
for (const view of object.alternateViews ?? []) if (view.citedVerses.some((verse) => !verseNumbers.has(verse))) throw new Error("Model returned an invalid alternate-view citation.");
const artifact = { schemaVersion: 1, provenance: { method: "Offline structured study generated with gpt-5.6-terra, medium reasoning", translation: version.toUpperCase(), passage: `${input.book.name} ${chapter}` }, ...object };
const target = path.join(root, "public", "generated", "study", version, book, `${chapter}.json`);
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, `${JSON.stringify(artifact)}\n`);
console.log(`Wrote static study artifact for ${version} ${book} ${chapter}.`);
