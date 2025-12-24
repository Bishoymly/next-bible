import { Metadata } from "next";
import { BibleReader } from "@/components/bible-reader";
import { getBibleJson, swapSectionAndParagraph } from "@/lib/getBibleText";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";
import getVersions from "@/lib/getVersions";
import groupChildrenByTags from "@/lib/groupChildrenByTag";
import { findBookBySlug } from "@/lib/findBookBySlug";
import Script from 'next/script';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ version: string; book: string; chapter: string }>;
  searchParams: Promise<{ side?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { version, book, chapter } = await params;
  const versions = getVersions();
  const versionInfo = versions.find((v) => v.id === version);
  const language = versionInfo?.lang || 'en';
  const books = getBooks(language);
  const bookInfo = findBookBySlug(books, book);
  
  const title = `${bookInfo?.n || book} ${chapter} - ${versionInfo?.name || version}`;
  const description = `Read and study ${bookInfo?.n || book} chapter ${chapter} in ${versionInfo?.name || version}. Access multiple translations, study tools, and cross-references.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${version}/${bookInfo?.slug || book}/${chapter}`,
    },
    twitter: {
      title,
      description,
    }
  };
}

export default async function Read({ params, searchParams }: Props) {
  const { version, book, chapter } = await params;
  const searchParamsResolved = await searchParams;
  const versions = getVersions();
  
  // Validate version exists
  const versionInfo = versions.find((v) => v.id === version);
  if (!versionInfo) {
    notFound();
  }
  
  const language = versionInfo.lang;
  const books = getBooks(language);
  
  // Validate book exists (accepts slugs with or without dashes)
  const bookInfo = findBookBySlug(books, book);
  if (!bookInfo) {
    notFound();
  }

  const version2 = searchParamsResolved.side || "study";
  // Validate secondary version exists
  const version2Info = versions.find((v) => v.id === version2);
  if (!version2Info) {
    notFound();
  }
  const language2 = version2Info.lang;

  let json = null;
  try {
    const bibleJson = getBibleJson(bookInfo.b, version);
    
    // Validate chapter exists
    if (!bibleJson["chapters"] || !bibleJson["chapters"][parseInt(chapter)]) {
      notFound();
    }
    
    json = bibleJson["chapters"][parseInt(chapter)];
    if (json["front"]) {
      json["0"] = json["front"];
      delete json.front;
    }
    json = swapSectionAndParagraph(json);
    json = groupChildrenByTags(json);
  } catch (error) {
    console.error("Error loading Bible JSON:", error);
    notFound();
  }

  let json2 = null;
  if (version2 != "study") {
    try {
      const bibleJson2 = getBibleJson(bookInfo.b, version2);
      
      if (bibleJson2["chapters"] && bibleJson2["chapters"][parseInt(chapter)]) {
        json2 = bibleJson2["chapters"][parseInt(chapter)];
        if (json2["front"]) {
          json2["0"] = json2["front"];
          delete json2.front;
        }
        json2 = swapSectionAndParagraph(json2);
        json2 = groupChildrenByTags(json2);
      }
    } catch (error) {
      console.error("Error loading secondary Bible JSON:", error);
      // We don't throw notFound here since the primary content can still be shown
    }
  }

  const booksCategorized = getBooksCategorized(language);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${bookInfo.name} ${chapter} - ${versionInfo.name}`,
    "description": `Read and study ${bookInfo.name} chapter ${chapter}`,
    "inLanguage": language,
    "isPartOf": {
      "@type": "Book",
      "name": bookInfo.name,
      "bookFormat": "http://schema.org/EBook"
    }
  };

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BibleReader
        language={language}
        book={bookInfo.slug}
        bookInfo={bookInfo}
        chapter={chapter}
        version={version}
        version2={version2}
        versions={versions}
        json={json}
        json2={json2}
        language2={language2}
        booksCategorized={booksCategorized}
        books={books}
      />
    </>
  );
}
