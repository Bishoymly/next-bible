"use server";
import { BibleBooksList } from "@/components/bible-books-list";
import getBooksCategorized from "@/lib/getBooksCategorized";
import getVersions from "@/lib/getVersions";

export default async function VersionPage({ params }) {
  const version = params.version;
  const versions = getVersions();
  const language = versions.filter((v) => v.id === version)[0].lang;
  const booksCategorized = getBooksCategorized(language);

  return <BibleBooksList language={language} versions={versions} version={version} book={null} chapter={null} booksCategorized={booksCategorized} aside={false} />;
}
