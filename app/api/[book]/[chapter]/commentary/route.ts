import curateChapter from "@/lib/curateChapter";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }) {
  const result = await curateChapter(params.book, params.chapter);
  return NextResponse.json(result);
}
