"use server";
import { BibleBooksList } from "@/components/bible-books-list";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";

export default async function VersionPage({ params }) {
  const book = params.book;
  const booksCategorized = getBooksCategorized();
  return <BibleBooksList booksCategorized={booksCategorized} />;
}
