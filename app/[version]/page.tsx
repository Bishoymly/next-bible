"use server";
import { BibleBooksList } from "@/components/bible-books-list";
import getBooksCategorized from "@/lib/getBooksCategorized";

export default async function VersionPage({ params }) {
  const booksCategorized = getBooksCategorized();
  const version = params.version;
  return <BibleBooksList version={version} booksCategorized={booksCategorized} aside={false} />;
}
