"Use Server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { kv } from "@vercel/kv";
import { z } from "zod";

export default async function curateBook(language, book) {
  const key = `${language}/${book}`;

  // Check if we have a cached response
  const cached = (await kv.get(key)) as { overviewParagraphs?: string[]; sections?: { title: string; fromChapter: number; toChapter: number }[] };
  if (cached && cached.overviewParagraphs && cached.sections && cached.sections[0].fromChapter) {
    return cached;
  }

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      overviewParagraphs: z.array(z.string()),
      sections: z.array(z.object({ title: z.string(), fromChapter: z.number(), toChapter: z.number() })),
    }),
    prompt:
      language === "Arabic"
        ? `كعالم دين معمداني إصلاحي يتحدث إلى طالب الكتاب المقدس المتوسط. أعطني مقدمة لكتاب ${book} تساعدني على فهم الكتاب، الكاتب، السياق وكيفية تقسيم الفصول إلى أقسام مفيدة. لا تتضمن أرقام الفصول في عناوين الأقسام.`
        : `As a reformed baptist scholar talking to an average bible student. Give me an introduction to the book of ${book} that will help me understand the book, the writer, the setting and how to split its chapters into useful sections. Don't included chapter numbers in section titles.`,
  });

  await kv.set(key, object);
  return object;
}
