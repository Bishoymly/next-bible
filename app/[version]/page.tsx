import { BibleBooksList } from "@/components/bible-books-list";
import getBooksCategorized from "@/lib/getBooksCategorized";
import getVersions from "@/lib/getVersions";
import type { Metadata } from "next";

export const dynamicParams = false;
export function generateStaticParams() {
  return getVersions().map((version) => ({ version: version.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ version: string }> }): Promise<Metadata> { const { version } = await params; const info = getVersions().find((item) => item.id === version); if (!info) return {}; const title = info.name; const description = `Browse every book in the ${info.name}.`; return { title, description, alternates: { canonical: `/${version}` }, openGraph: { title, description, url: `/${version}` } }; }

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
