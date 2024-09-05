"Use Server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { kv } from "@vercel/kv";
import { z } from "zod";
import GenerateImage from "./generateImage";

export default async function curateBook(book) {
  const key = book;

  // Check if we have a cached response
  const cached = (await kv.get(key)) as { overviewParagraphs?: string[]; sections?: { title: string; fromChapter: number; toChapter: number }[]; imageUrl?: string };
  if (cached && cached.overviewParagraphs && cached.imageUrl) {
    return cached;
  }

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      overviewParagraphs: z.array(z.string()),
      sections: z.array(z.object({ title: z.string(), fromChapter: z.number(), toChapter: z.number() })),
      imageUrl: z.string(),
    }),
    prompt: `As a reformed baptist scholar talking to an average bible student. Give me an introduction to the book of ${book} that will help me understand the book, the writer, the setting and how to split its chapters into useful sections. Don't included chapter numbers in section titles.`,
  });

  //object.imageUrl = `/img/${book}.webp`;
  object.imageUrl = await GenerateImage({ key: book, prompt: `generate a sketch drawing for the book of ${book}` });

  await kv.set(key, object);
  return object;
}
