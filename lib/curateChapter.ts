"Use Server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { kv } from "@vercel/kv";
import { z } from "zod";

export default async function curateChapter(book, chapter) {
  const key = `${book}/${chapter}`;

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
    prompt: `As a reformed baptist scholar talking to an average bible student. Give me a curated commentary for book ${book} chapter ${chapter}, splitting it into sections with commentaries and don't include verse numbers in section titles. Also highlight the important verses and important questions that arise from the chapter.`,
  });

  await kv.set(key, object);
  return object;
}
