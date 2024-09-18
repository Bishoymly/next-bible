"use server";
import { BibleBooksList } from "@/components/bible-books-list";
import getBooksCategorized from "@/lib/getBooksCategorized";

export default async function VersionPage({ params }) {
  const version = params.version;
  const language = version == "asv" ? "en" : "ar";
  const booksCategorized = getBooksCategorized(language);

  return <BibleBooksList language={language} version={version} booksCategorized={booksCategorized} aside={false} />;
}
