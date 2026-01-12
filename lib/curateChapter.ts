"use server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { kv } from "@vercel/kv";
import { z } from "zod";

export default async function curateChapter(language, book, chapter) {
  const key = `${language}/${book}/${chapter}`;

  // Check if we have a cached response
  const cached = await kv.get(key);
  if (cached) {
    return cached;
  }

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      sections: z.array(z.object({ title: z.string(), commentary: z.array(z.string()), fromVerse: z.number(), toVerse: z.number() })),
      importantVerses: z.array(
        z.object({
          verse: z.number(),
          commentary: z.string(),
          crossReferences: z.array(
            z.object({
              book: z.string(),
              chapter: z.number(),
              verse: z.number(),
            })
          ),
        })
      ),
      questions: z.array(z.string()),
    }),
    messages: [
      {
        role: "user",
        content:
          language === "English"
          ? `As a reformed baptist scholar talking to an average bible student. Give me a curated commentary for book ${book} chapter ${chapter}, splitting it into sections with commentaries and don't include verse numbers in section titles. Also highlight the important verses and important questions that arise from the chapter.`
          : `كعالم دين معمداني إصلاحي يتحدث إلى طالب الكتاب المقدس المتوسط. أعطني تعليقًا مرتبًا لكتاب ${book} الفصل ${chapter}، مقسمًا إلى أقسام مع التعليقات ولا تتضمن أرقام الآيات في عناوين الأقسام. كما أبرز الآيات المهمة والأسئلة المهمة التي تنشأ من الفصل.`,
      },
    ],
  });

  await kv.set(key, object);
  return object;
}
