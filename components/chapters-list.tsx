import Link from "next/link";
import { Button } from "./ui/button";
import { uiText } from "@/lib/uiText";

export default function ChaptersList({ language, version, book, chaptersCount, chapter, aside }) {
  return (
    <div className={`grid grid-cols-5 gap-2 transition-all ${aside ? "my-3" : "my-5 lg:grid-cols-10"}`}>
      <Button
        variant="outline"
        size="sm"
        className={`${language == "Arabic" ? "text-lg" : "text-base"} col-span-5 ${!aside ? "lg:col-span-10" : ""} rounded-2xl ${aside ? "border-none bg-background/24 shadow-none ring-1 ring-border/20" : ""}`}
        asChild
      >
        <Link href={`/${version}/${book}`}>{uiText[language].introduction}</Link>
      </Button>
      {Array.from({ length: chaptersCount }, (_, i) => i + 1).map((c) => (
        <Button
          key={c}
          variant={chapter == c ? "default" : "outline"}
          size="sm"
          className={`${language == "Arabic" ? "text-lg" : "text-base"} rounded-2xl ${aside && chapter != c ? "border-none bg-background/24 shadow-none ring-1 ring-border/20" : ""}`}
          asChild
        >
          <Link href={`/${version}/${book}/${c}`}>{c}</Link>
        </Button>
      ))}
    </div>
  );
}
