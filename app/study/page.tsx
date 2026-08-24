import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScriptureSearch } from "@/components/scripture-search";
import { ReaderPage } from "@/components/reader-page";

export const metadata: Metadata = { title: "Guided Study", description: "Local, source-backed Scripture study and search.", alternates: { canonical: "/study" } };
export default function StudyPage() {
  return (
    <ReaderPage
      title="Study a passage with care"
      description="Open a chapter, then bring observations, references, and reflection questions beside the biblical text."
      actions={
        <>
          <Link className="reader-button reader-button-primary" href="/bsb/genesis/1">
            Read Genesis 1
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link className="reader-button reader-button-secondary" href="/topics">
            Browse study topics
          </Link>
        </>
      }
    >
      <section className="reader-page-section" aria-labelledby="study-search-title">
        <div className="reader-page-section-heading">
          <h2 id="study-search-title">Find a passage</h2>
          <p>Search the biblical text, then open a result in the reader.</p>
        </div>
        <ScriptureSearch />
      </section>
    </ReaderPage>
  );
}
