"Use Server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { kv } from "@vercel/kv";
import { z } from "zod";

export default async function curateBook(book) {
  const key = book;

  // Check if we have a cached response
  const cached = (await kv.get(key)) as { overviewParagraphs?: string[] };
  if (cached && cached.overviewParagraphs) {
    return cached;
  }

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      overviewParagraphs: z.array(z.string()),
      sections: z.array(z.object({ title: z.string(), startChapter: z.number() })),
      sketchPrompt: z.string(),
    }),
    prompt: `As a reformed baptist scholar talking to an average bible student. Give me an introduction to the book of ${book} that will help me understand the book, the writer, the setting and how to split its chapters into useful sections. Don't included chapter numbers in section titles. Also please give me a prompt that will generate a drawing sketch that represents this book.`,
  });

  await kv.set(key, object);
  return object;
}
