import fs from "node:fs";
import path from "node:path";

export type StudyChapter = {
  schemaVersion: 1;
  provenance: { method: string; translation: string; passage: string };
  sections: { title: string; fromVerse: number; toVerse: number; observations: string[] }[];
  importantVerses: { verse: number; commentary: string; crossReferences: { book: string; chapter: number; verse: number }[] }[];
  questions: string[];
  alternateViews?: { summary: string; citedVerses: number[] }[];
};

const chapterTitlesCache = new Map<string, Record<number, string>>();

export function getChapterTitles(language: string, book: string): Record<number, string> {
  const cacheLanguage = language === "Arabic" ? "Arabic" : "English";
  const cacheKey = `${cacheLanguage}/${book}`;
  const cached = chapterTitlesCache.get(cacheKey);
  if (cached) return cached;
  const directory = path.join(process.cwd(), "public", "generated", "study-cache", cacheLanguage, "chapters", book);
  const titles: Record<number, string> = {};
  try {
    for (const file of fs.readdirSync(directory)) {
      const chapter = Number(path.basename(file, ".json"));
      if (!Number.isFinite(chapter)) continue;
      const title = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"))?.sections?.[0]?.title;
      if (typeof title === "string" && title !== "Study this chapter") titles[chapter] = title;
    }
  } catch { /* Missing cache entries retain the plain chapter label. */ }
  chapterTitlesCache.set(cacheKey, titles);
  return titles;
}

function fallback(version: string, language: string, book: string, chapter: string, lastVerse: number): StudyChapter {
  const isArabic = language === "Arabic";
  return {
    schemaVersion: 1,
    provenance: { method: "Deterministic local study outline. Full offline study has not been generated for this passage.", translation: version.toUpperCase(), passage: `${book} ${chapter}` },
    sections: [{ title: isArabic ? "دراسة هذا الفصل" : "Study this chapter", fromVerse: 1, toVerse: lastVerse, observations: [isArabic ? "اقرأ الفصل كله. لاحظ الكلمات المتكررة، المتكلم، والاستجابة المطلوبة." : "Read the whole chapter. Notice repeated words, the speaker, and the response the passage calls for."] }],
    importantVerses: [],
    questions: [isArabic ? "ماذا يكشف هذا الفصل عن الله؟" : "What does this chapter reveal about God?", isArabic ? "ما الذي يحتاج إلى استجابة بالإيمان والطاعة؟" : "What calls for faith and obedience today?"],
  };
}

export default async function curateChapter(version: string, language: string, book: string, chapter: string, lastVerse: number): Promise<StudyChapter> {
  const cacheLanguage = language === "Arabic" ? "Arabic" : "English";
  const file = path.join(process.cwd(), "public", "generated", "study-cache", cacheLanguage, "chapters", book, `${chapter}.json`);
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    if (parsed?.schemaVersion === 1 && Array.isArray(parsed.sections) && Array.isArray(parsed.questions)) return parsed;
  } catch { /* The static fallback is intentional when no artifact exists. */ }
  return fallback(version, language, book, chapter, lastVerse);
}
