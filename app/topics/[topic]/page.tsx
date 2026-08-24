import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import legacy from "@/public/generated/legacy/manifest.json";
import { ReaderPage } from "@/components/reader-page";

type Params = { topic: string };
const topics = (legacy.records as { kind?: string; slug?: string }[]).filter((record) => record.kind === "topics" && record.slug).map((record) => record.slug!);
export const dynamicParams = false;
export function generateStaticParams(): Params[] { return topics.map((topic) => ({ topic })); }
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> { const { topic } = await params; const label = topic === "unknown" ? "Unclassified study archive" : topic.replaceAll("-", " "); return { title: label, alternates: { canonical: `/topics/${topic}` } }; }
export default async function TopicPage({ params }: { params: Promise<Params> }) {
  const { topic } = await params;
  const label = topic === "unknown" ? "Unclassified study archive" : topic.replaceAll("-", " ");
  const studies = (legacy.studies as { slug: string; title: string; topicSlug: string }[]).filter((study) => study.topicSlug === topic);
  const displayedStudies = studies.slice(0, 24);
  return (
    <ReaderPage
      title={label}
      description={topic === "unknown" ? "Older imported studies that still need topic classification. The original URLs remain available." : "Published studies connected to this subject. Open a study, then check its references in the reader."}
      compactTitle={topic === "unknown"}
    >
      {studies.length ? (
        <>
          <ul className="reader-study-list">
            {displayedStudies.map((study) => (
              <li key={study.slug}>
                <Link href={`/study/${study.slug}`}>
                  <span>{study.title}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          {studies.length > displayedStudies.length ? (
            <p className="reader-archive-note">
              Showing {displayedStudies.length} of {studies.length} imported studies. Use Scripture search or the reader for a passage-specific study.
            </p>
          ) : null}
        </>
      ) : (
        <div className="reader-empty-state">
          <h2>No studies are assigned yet</h2>
          <p>Use guided study to begin with a passage instead.</p>
          <Link className="reader-button reader-button-secondary" href="/study">Open guided study</Link>
        </div>
      )}
    </ReaderPage>
  );
}
