"use server";
import { BibleBooksList } from "@/components/bible-books-list";
import getBooksCategorized from "@/lib/getBooksCategorized";

export default async function VersionPage({ params }) {
  const booksCategorized = getBooksCategorized();
  return <BibleBooksList booksCategorized={booksCategorized} aside={false} />;
}
