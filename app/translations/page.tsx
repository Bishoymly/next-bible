import sources from "@/public/data/sources.json";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ReaderPage } from "@/components/reader-page";

const translationNames: Record<string, { name: string; note: string }> = {
  bsb: { name: "Berean Standard Bible", note: "Modern English" },
  asv: { name: "American Standard Version", note: "Formal English" },
  kjv: { name: "King James Version", note: "Historic English" },
  avd: { name: "Arabic Van Dyck", note: "Classic Arabic" },
};

export const metadata = { title: "Translations and sources", alternates: { canonical: "/translations" } };
export default function TranslationsPage() {
  return (
    <ReaderPage
      title="Translations and text sources"
      description="Every translation is bundled from a documented source, so reading and search do not depend on a third-party API."
      wide
    >
      <div className="reader-source-grid">
        {Object.entries(sources.versions).map(([id, source]) => {
          const translation = translationNames[id];
          return (
            <article key={id} className="reader-source-entry">
              <div>
                <p>{id.toUpperCase()}</p>
                <h2>{translation?.name ?? id.toUpperCase()}</h2>
                <span>{translation?.note}</span>
              </div>
              <p>{source.license}</p>
              <div className="reader-source-actions">
                <Link href={`/${id}`}>
                  Read this translation
                  <ArrowRight aria-hidden="true" />
                </Link>
                {source.urls.map((url, index) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                    {index === 0 ? "Source details" : "Download details"}
                    <ExternalLink aria-hidden="true" />
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </ReaderPage>
  );
}
