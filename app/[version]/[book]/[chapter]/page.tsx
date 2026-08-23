import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { BibleReaderWorkspace } from "@/components/bible-reader-workspace";
import { getBibleJson, swapSectionAndParagraph } from "@/lib/getBibleText";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";
import getVersions from "@/lib/getVersions";
import groupChildrenByTags from "@/lib/groupChildrenByTag";
import { findBookBySlug } from "@/lib/findBookBySlug";
import curateChapter from "@/lib/curateChapter";
import { getByBC } from "@texttree/bible-crossref";

export const dynamicParams = false;
type Params = { version: string; book: string; chapter: string };

export function generateStaticParams(): Params[] {
  return getVersions().flatMap((version) => getBooks(version.lang).flatMap((book) =>
    Array.from({ length: book.c }, (_, index) => ({ version: version.id, book: book.slug, chapter: String(index + 1) }))));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { version, book, chapter } = await params;
  const versionInfo = getVersions().find((item) => item.id === version);
  const bookInfo = versionInfo && findBookBySlug(getBooks(versionInfo.lang), book);
  if (!versionInfo || !bookInfo) return {};
  const title = `${bookInfo.n} ${chapter} | ${versionInfo.name}`;
  const description = `Read ${bookInfo.n} chapter ${chapter} in ${versionInfo.name}.`;
  const canonical = `/${version}/${bookInfo.slug}/${chapter}`;
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical } };
}

export default async function Read({ params }: { params: Promise<Params> }) {
  const { version, book, chapter } = await params;
  const versions = getVersions();
  const versionInfo = versions.find((item) => item.id === version);
  if (!versionInfo) notFound();
  const language = versionInfo.lang;
  const books = getBooks(language);
  const bookInfo = findBookBySlug(books, book);
  if (!bookInfo || !/^\d+$/.test(chapter) || Number(chapter) < 1 || Number(chapter) > bookInfo.c) notFound();
  const sourceChapter = getBibleJson(bookInfo.b, version).chapters?.[Number(chapter)];
  if (!sourceChapter) notFound();
  const json = groupChildrenByTags(swapSectionAndParagraph(structuredClone(sourceChapter)));
  const chapterCrossReferences = getByBC({ book: bookInfo.short, chapter });
  const verseNumbers = Object.keys(json).map(Number).filter((value) => Number.isFinite(value) && value > 0);
  const initialCommentary = await curateChapter(version, language, bookInfo.slug, chapter, Math.max(...verseNumbers));
  const canonical = `https://bible.bishoy.io/${version}/${bookInfo.slug}/${chapter}`;
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: `${bookInfo.n} ${chapter} | ${versionInfo.name}`, url: canonical, inLanguage: language, isPartOf: { "@type": "Book", name: bookInfo.n, bookFormat: "https://schema.org/EBook" } };
  return <>
    <Script id="scripture-json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <BibleReaderWorkspace
      language={language}
      book={bookInfo.slug}
      comparisonBookSlugs={Object.fromEntries(versions.map((item) => [item.id, getBooks(item.lang).find((candidate) => candidate.b === bookInfo.b)?.slug ?? bookInfo.slug]))}
      comparisonBooksByVersion={Object.fromEntries(versions.map((item) => [item.id, getBooks(item.lang)]))}
      comparisonBookInfoByVersion={Object.fromEntries(versions.map((item) => [item.id, getBooks(item.lang).find((candidate) => candidate.b === bookInfo.b) ?? bookInfo]))}
      chapterCrossReferences={chapterCrossReferences}
      bookInfo={bookInfo}
      chapter={chapter}
      version={version}
      version2={versions.find((item) => item.id !== version)?.id ?? version}
      versions={versions}
      json={json}
      json2={null}
      language2={language}
      booksCategorized={getBooksCategorized(language)}
      books={books}
      initialCommentary={initialCommentary}
    />
  </>;
}
