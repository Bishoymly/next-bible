import { BibleBookHome } from "@/components/bible-book-home";
import curateBook from "@/lib/curateBook";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";
import getVersions from "@/lib/getVersions";
import { findBookBySlug } from "@/lib/findBookBySlug";
import type { Metadata } from "next";

export const dynamicParams = false;
export function generateStaticParams() {
  return getVersions().flatMap((version) =>
    getBooks(version.lang).map((book) => ({ version: version.id, book: book.slug }))
  );
}
export async function generateMetadata({ params }: { params: Promise<{ version: string; book: string }> }): Promise<Metadata> { const { version, book } = await params; const info = getVersions().find((item) => item.id === version); const item = info && findBookBySlug(getBooks(info.lang), book); if (!info || !item) return {}; const title = `${item.n} | ${info.name}`; const description = `Read and study ${item.n} in the ${info.name}.`; return { title, description, alternates: { canonical: `/${version}/${item.slug}` }, openGraph: { title, description, url: `/${version}/${item.slug}` } }; }

export default async function BookPage({ params }: { params: Promise<{ version: string; book: string }> }) {
  const { version, book } = await params;
  const versions = getVersions();
  const versionInfo = versions.find((v) => v.id === version);
  if (!versionInfo) {
    throw new Error(`Version ${version} not found`);
  }
  const language = versionInfo.lang;
  const books = getBooks(language);
  const booksCategorized = getBooksCategorized(language);
  
  // Find book (accepts slugs with or without dashes)
  const bookInfo = findBookBySlug(books, book);
  if (!bookInfo) {
    throw new Error(`Book ${book} not found`);
  }
  
  bookInfo.previousBook = bookInfo.b === 1 ? books[books.length - 1] : books[books.indexOf(bookInfo) - 1];
  bookInfo.nextBook = bookInfo.b === books.length ? books[0] : books[books.indexOf(bookInfo) + 1];
  const curation = await curateBook(language, bookInfo.slug);
  bookInfo.translationSlugs = Object.fromEntries(versions.map((item) => [item.id, getBooks(item.lang).find((candidate) => candidate.b === bookInfo.b)?.slug ?? bookInfo.slug]));

  return <BibleBookHome language={language} versions={versions} version={version} book={bookInfo.slug} curation={curation} bookInfo={bookInfo} booksCategorized={booksCategorized} />;
}
