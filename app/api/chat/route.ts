import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // get book and chapter from query params
  const url = new URL(req.url);
  const book = url.searchParams.get("book");
  const chapter = url.searchParams.get("chapter");
  console.log(book, chapter);

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a reformed baptist scholar talking to an average bible student.${book ? ` You are discussing the book of ${book} chapter ${chapter}.` : ""}`,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
