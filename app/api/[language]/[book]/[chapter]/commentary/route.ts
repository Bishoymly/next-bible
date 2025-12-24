import curateChapter from "@/lib/curateChapter";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ language: string; book: string; chapter: string }> }
) {
  const { language, book, chapter } = await params;
  const result = await curateChapter(language, book, chapter);
  return NextResponse.json(result);
}
