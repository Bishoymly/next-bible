import Link from "next/link";
import { uiText } from "@/lib/uiText";

export default function ChaptersList({ language, version, book, chaptersCount, chapter, aside }) {
  return (
    <div className={`reader-chapter-picker ${aside ? "reader-chapter-picker-compact" : ""}`}>
      <Link className="reader-chapter-introduction" href={`/${version}/${book}`}>
        {uiText[language].introduction}
      </Link>
      {Array.from({ length: chaptersCount }, (_, i) => i + 1).map((c) => (
        <Link
          key={c}
          aria-current={chapter == c ? "page" : undefined}
          className={chapter == c ? "reader-chapter-current" : ""}
          href={`/${version}/${book}/${c}`}
        >
          {c}
        </Link>
      ))}
    </div>
  );
}
