"use server";
import { BibleBooksList } from "@/components/bible-books-list";
import getBooksCategorized from "@/lib/getBooksCategorized";
import getVersions from "@/lib/getVersions";

export default async function VersionPage({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  const versions = getVersions();
  const versionInfo = versions.find((v) => v.id === version);
  if (!versionInfo) {
    throw new Error(`Version ${version} not found`);
  }
  const language = versionInfo.lang;
  const booksCategorized = getBooksCategorized(language);

  return <BibleBooksList language={language} versions={versions} version={version} book={null} chapter={null} booksCategorized={booksCategorized} aside={false} />;
}
