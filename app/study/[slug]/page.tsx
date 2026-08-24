import type { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import legacy from "@/public/generated/legacy/manifest.json";
import { ArrowLeft, BookOpenText } from "lucide-react";
import { ReaderPage } from "@/components/reader-page";

type Params = { slug: string };
const studies = legacy.studies as { slug: string; title: string; topic: string; updatedAt: string | null }[];
const slugs = studies.map((study) => study.slug);
function title(slug: string) { return slug.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" "); }
export const dynamicParams = false;
export function generateStaticParams(): Params[] { return slugs.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> { const { slug } = await params; const study = studies.find((item) => item.slug === slug); const label = study?.title || title(slug); return { title: label, description: `Guided Scripture study for ${label}.`, alternates: { canonical: `/study/${slug}` } }; }
function isStudyHeading(paragraph: string) {
  return paragraph.length < 90 && !/[.!?:;]$/.test(paragraph);
}

function cleanTypography(value: string) {
  return value.replace(/[—–]/g, "-");
}

export default async function LegacyStudy({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const study = studies.find((item) => item.slug === slug);
  const label = study?.title || title(slug);
  let paragraphs: string[] = [];
  try {
    paragraphs = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "generated", "legacy", "studies", `${slug}.json`), "utf8")).paragraphs || [];
  } catch {}

  return (
    <ReaderPage
      title={label}
      description="A published study from the original library. Read its references in context before drawing conclusions."
      compactTitle
      actions={
        <Link className="reader-button reader-button-secondary" href="/study">
          <ArrowLeft aria-hidden="true" />
          All study tools
        </Link>
      }
    >
      {paragraphs.length ? (
        <article className="reader-prose">
          {paragraphs.map((paragraph, index) =>
            isStudyHeading(paragraph) ? (
              <h2 key={`${index}-${paragraph}`}>{cleanTypography(paragraph)}</h2>
            ) : (
              <p key={`${index}-${paragraph}`}>{cleanTypography(paragraph)}</p>
            )
          )}
        </article>
      ) : (
        <div className="reader-empty-state">
          <BookOpenText aria-hidden="true" />
          <h2>This study is not available</h2>
          <p>Open guided study and begin with a passage.</p>
          <Link className="reader-button reader-button-primary" href="/study">Open guided study</Link>
        </div>
      )}
    </ReaderPage>
  );
}
