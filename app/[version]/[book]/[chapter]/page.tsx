import { Metadata } from "next";
import { BibleReader } from "@/components/bible-reader";
import { getBibleJson, swapSectionAndParagraph } from "@/lib/getBibleText";
import getBooks from "@/lib/getBooks";
import getBooksCategorized from "@/lib/getBooksCategorized";
import getVersions from "@/lib/getVersions";
import groupChildrenByTags from "@/lib/groupChildrenByTag";
import Script from 'next/script';

type Props = {
  params: { version: string; book: string; chapter: string };
  searchParams: { side?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { version, book, chapter } = params;
  const versions = getVersions();
  const language = versions.find((v) => v.id === version)?.lang || 'en';
  const books = getBooks(language);
  const bookInfo = books.find((b) => b.slug === book);
  const versionInfo = versions.find((v) => v.id === version);
  
  const title = `${bookInfo?.name || book} ${chapter} - ${versionInfo?.name || version}`;
  const description = `Read and study ${bookInfo?.name || book} chapter ${chapter} in ${versionInfo?.name || version}. Access multiple translations, study tools, and cross-references.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${version}/${book}/${chapter}`,
    },
    twitter: {
      title,
      description,
    }
  };
}

export default async function Read({ params, searchParams }) {
  const { version, book, chapter } = params;
  const versions = getVersions();
  const language = versions.filter((v) => v.id === version)[0].lang;
  const books = getBooks(language);
  const bookInfo = books.filter((b) => b.slug === book)[0];

  const version2 = searchParams.side || "study";
  const language2 = versions.filter((v) => v.id === version2)[0].lang;

  let json = null;
  json = getBibleJson(bookInfo.b, version)["chapters"][parseInt(chapter)];
  if (json["front"]) {
    json["0"] = json["front"];
    delete json.front;
  }
  json = swapSectionAndParagraph(json);
  json = groupChildrenByTags(json);

  let json2 = null;
  if (version2 != "study") {
    json2 = getBibleJson(bookInfo.b, version2)["chapters"][parseInt(chapter)];
    if (json2["front"]) {
      json2["0"] = json2["front"];
      delete json2.front;
    }
    json2 = swapSectionAndParagraph(json2);
    json2 = groupChildrenByTags(json2);
  }

  const booksCategorized = getBooksCategorized(language);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${bookInfo.name} ${chapter} - ${versions.find(v => v.id === version)?.name}`,
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
        book={book}
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
