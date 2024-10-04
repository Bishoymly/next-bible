import Link from "next/link";
import { Button } from "./ui/button";
import { uiText } from "@/lib/uiText";

export default function ChaptersList({ language, version, book, chaptersCount, chapter, aside }) {
  return (
    <div className={`grid grid-cols-5 ${!aside ? "lg:grid-cols-10" : ""} gap-2 my-4 ms-2 transition-all`}>
      <Button variant="outline" size="sm" className={`${language == "Arabic" ? "text-base" : "text-sm"} col-span-5 ${!aside ? "lg:col-span-10" : ""}`} asChild>
        <Link href={`/${version}/${book}`}>{uiText[language].introduction}</Link>
      </Button>
      {Array.from({ length: chaptersCount }, (_, i) => i + 1).map((c) => (
        <Button key={c} variant={chapter == c ? "default" : "outline"} size="sm" className={language == "Arabic" ? "text-base" : "text-sm"} asChild>
          <Link href={`/${version}/${book}/${c}`}>{c}</Link>
        </Button>
      ))}
    </div>
  );
}
