import fs from "node:fs";
import path from "node:path";

type BookCuration = {
  overviewParagraphs: string[];
  sections: { title: string; fromChapter: number; toChapter: number }[];
};

export default async function curateBook(language: string, book: string): Promise<BookCuration> {
  const Arabic = language === "Arabic";
  const cacheLanguage = Arabic ? "Arabic" : "English";
  const file = path.join(process.cwd(), "public", "generated", "study-cache", cacheLanguage, "books", `${book}.json`);
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    if (Array.isArray(parsed?.overviewParagraphs) && Array.isArray(parsed?.sections)) return parsed;
  } catch { /* A concise local fallback keeps every translation and book available. */ }
  return {
    overviewParagraphs: [Arabic ? `تتوفر الدراسة الإرشادية لفصل من ${book} في صفحة الدراسة.` : `Guided study for each chapter of ${book} is available on the study page.`],
    sections: [],
  };
}
